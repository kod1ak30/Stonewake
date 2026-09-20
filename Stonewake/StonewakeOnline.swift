import Foundation
import AuthenticationServices
import StoreKit
import Security
import WebKit

struct OnlineFailure: Error, LocalizedError {
    let code: String
    let message: String
    var details: Any? = nil
    var errorDescription: String? { message }
}

// Sessions remain in the Keychain. JavaScript receives game data, never bearer tokens.
@MainActor final class StonewakeOnline: NSObject, ASAuthorizationControllerDelegate, ASAuthorizationControllerPresentationContextProviding {
    weak var webView: WKWebView?
    private var signInContinuation: CheckedContinuation<ASAuthorizationAppleIDCredential, Error>?
    private var authorizationController: ASAuthorizationController?
    private var products: [Product] = []
    private var catalog: [String: [String: Any]] = [:]
    private var account: [String: Any] = [:]
    private var listener: Task<Void, Never>?
    private var pendingDeliveries = Set<UInt64>()
    private var lastMessage = ""
    private var sessionGeneration = 0
    private var token: String? { OnlineKeychain.read("session") }
    private var baseURL: URL? {
        guard let raw = Bundle.main.object(forInfoDictionaryKey: "StonewakeServiceURL") as? String,
              let url = URL(string: raw), url.scheme == "https", url.host != nil else { return nil }
        return url
    }
    private var configured: Bool { baseURL != nil }
    private var snapshot: [String: Any] {
        var result: [String: Any] = ["configured": configured, "signedIn": token != nil, "status": configured ? (token == nil ? "signedOut" : "connected") : "unavailable", "products": productRows(), "onlineKingdom": account["onlineKingdom"] as? Bool ?? false, "message": lastMessage.isEmpty ? (configured ? "" : "Online services are not connected yet. Your kingdom stays on this iPhone.") : lastMessage]
        result["accountId"] = account["accountId"] ?? OnlineKeychain.read("account") ?? NSNull()
        result["backup"] = account["backup"] ?? NSNull()
        return result
    }
    override init() {
        super.init()
        listener = Task { [weak self] in
            for await result in Transaction.updates {
                guard let self else { return }
                do { _ = try await self.deliver(result); self.broadcast() }
                catch { self.lastMessage = "A purchase is waiting for verification. It will retry when you reconnect."; self.broadcast() }
            }
        }
    }
    deinit { listener?.cancel() }
    func handle(id: String, method: String, payload: [String: Any]) {
        Task {
            do {
                let result = try await perform(method, payload)
                reply(["id": id, "ok": true, "result": result, "state": snapshot])
            } catch {
                let failure = error as? OnlineFailure ?? OnlineFailure(code: "unavailable", message: error.localizedDescription)
                var detail: [String: Any] = ["code": failure.code, "message": failure.message]
                if let details = failure.details { detail["details"] = details }
                reply(["id": id, "ok": false, "error": detail, "state": snapshot])
            }
        }
    }
    private func perform(_ method: String, _ payload: [String: Any]) async throws -> [String: Any] {
        if method == "status" {
            if configured, token != nil { do { account = try await request("/v1/account") } catch let error as OnlineFailure { if error.code == "sign_in" { clearSession() }; lastMessage = error.message } }
            return snapshot
        }
        if method == "archiveLocal" || method == "cacheOnline" || method == "getOnlineCache" { return try localOperation(method, payload) }
        guard configured else { throw OnlineFailure(code: "unavailable", message: "Online services are not connected yet. Your kingdom stays on this iPhone.") }
        switch method {
        case "signIn":
            guard signInContinuation == nil else { throw OnlineFailure(code: "busy", message: "Sign-in is already open.") }
            sessionGeneration += 1
            let generation = sessionGeneration
            let challenge = try await request("/v1/auth/challenge", method: "POST", body: [:], authenticated: false)
            guard let id = challenge["id"] as? String, let nonce = challenge["nonce"] as? String else { throw OnlineFailure(code: "invalid_response", message: "Sign-in could not start.") }
            let credential = try await authorize(nonce: nonce)
            guard let data = credential.identityToken, let identity = String(data: data, encoding: .utf8) else { throw OnlineFailure(code: "sign_in", message: "Apple did not return a sign-in credential.") }
            let session = try await request("/v1/auth/apple", method: "POST", body: ["challengeId": id, "identityToken": identity], authenticated: false)
            guard let sessionToken = session["token"] as? String, let accountID = session["accountId"] as? String else { throw OnlineFailure(code: "invalid_response", message: "Sign-in could not finish.") }
            guard generation == sessionGeneration else { throw OnlineFailure(code: "account_changed", message: "The account changed while signing in. Please try again.") }
            try OnlineKeychain.write(sessionToken, key: "session")
            try OnlineKeychain.write(accountID, key: "account")
            account = try await request("/v1/account"); lastMessage = ""
            await retryUnfinished()
            do { try await restoreEntitlements() } catch { lastMessage = "Some purchases are waiting for server verification." }
            return snapshot
        case "signOut":
            sessionGeneration += 1
            let previousToken = token
            clearSession(); lastMessage = ""
            _ = try? await request("/v1/auth/signout", method: "POST", body: [:], authenticated: false, sessionToken: previousToken)
            return snapshot
        case "products":
            try await loadProducts(); return ["products": productRows()]
        case "purchase":
            guard let accountID = account["accountId"] as? String ?? OnlineKeychain.read("account"), let accountToken = UUID(uuidString: accountID), token != nil else { throw OnlineFailure(code: "sign_in", message: "Sign in before buying items for your online kingdom.") }
            guard let productID = payload["productId"] as? String else { throw OnlineFailure(code: "invalid_product", message: "Choose a store item.") }
            try await loadProducts()
            guard let product = products.first(where: { $0.id == productID }) else { throw OnlineFailure(code: "store_unavailable", message: "This item is not available from the App Store.") }
            switch try await product.purchase(options: [.appAccountToken(accountToken)]) {
            case .success(let verified): return try await deliver(verified)
            case .pending: return ["status": "pending", "message": "Apple is waiting for purchase approval."]
            case .userCancelled: return ["status": "cancelled"]
            @unknown default: throw OnlineFailure(code: "store_unavailable", message: "The App Store could not complete this purchase.")
            }
        case "restorePurchases":
            guard token != nil else { throw OnlineFailure(code: "sign_in", message: "Sign in to reconnect purchases.") }
            try await AppStore.sync(); await retryUnfinished(); try await restoreEntitlements()
            return ["status": "checked", "game": try await request("/v1/game")]
        case "backup":
            guard let save = payload["save"] as? [String: Any], let revision = payload["expectedRevision"] as? Int else { throw OnlineFailure(code: "invalid_backup", message: "A saved kingdom and its cloud revision are required.") }
            let result = try await request("/v1/backup", method: "POST", body: ["save": save, "expectedRevision": revision]); account["backup"] = result; return result
        case "restoreBackup": return try await request("/v1/backup")
        case "request":
            guard let path = payload["path"] as? String, path.hasPrefix("/v1/"), !path.contains(".."), !path.contains("?"), !path.contains("#"), !path.hasPrefix("/v1/auth/"), !path.hasPrefix("/v1/store/") else { throw OnlineFailure(code: "invalid_request", message: "This service request is not allowed.") }
            let verb = payload["method"] as? String ?? "GET"
            guard ["GET", "POST"].contains(verb) else { throw OnlineFailure(code: "invalid_request", message: "This service request is not allowed.") }
            return try await request(path, method: verb, body: payload["body"] as? [String: Any])
        default: throw OnlineFailure(code: "invalid_request", message: "This online feature is not available.")
        }
    }
    private func localOperation(_ method: String, _ payload: [String: Any]) throws -> [String: Any] {
        let directory = SaveStore.directory.appendingPathComponent("Online", isDirectory: true)
        try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
        let cache = directory.appendingPathComponent("online-cache.json")
        if method == "getOnlineCache" {
            guard let data = try? Data(contentsOf: cache), let value = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else { return [:] }
            guard value["accountId"] as? String == OnlineKeychain.read("account") else { return [:] }
            return value
        }
        if method == "cacheOnline" {
            guard let game = payload["game"] as? [String: Any], game["state"] is [String: Any], let accountID = OnlineKeychain.read("account") else { throw OnlineFailure(code: "invalid_cache", message: "No connected kingdom is available to cache.") }
            let value: [String: Any] = ["accountId": accountID, "game": game, "cachedAt": Date().timeIntervalSince1970 * 1000]
            let data = try JSONSerialization.data(withJSONObject: value)
            guard data.count < 8_000_000 else { throw OnlineFailure(code: "invalid_cache", message: "This kingdom snapshot is too large.") }
            try data.write(to: cache, options: [.atomic, .completeFileProtectionUntilFirstUserAuthentication])
            return ["saved": true]
        }
        guard let save = payload["save"], JSONSerialization.isValidJSONObject(save) else { throw OnlineFailure(code: "invalid_backup", message: "No valid kingdom was supplied.") }
        let data = try JSONSerialization.data(withJSONObject: save)
        guard SaveStore.valid(data) else { throw OnlineFailure(code: "invalid_backup", message: "No valid kingdom was supplied.") }
        let archives = SaveStore.directory.appendingPathComponent("Archives", isDirectory: true)
        try FileManager.default.createDirectory(at: archives, withIntermediateDirectories: true)
        let url = archives.appendingPathComponent("kingdom-\(Int(Date().timeIntervalSince1970 * 1000))-\(UUID().uuidString).json")
        try data.write(to: url, options: [.atomic, .completeFileProtectionUntilFirstUserAuthentication])
        let files = try FileManager.default.contentsOfDirectory(at: archives, includingPropertiesForKeys: nil).filter { $0.pathExtension == "json" }.sorted { $0.lastPathComponent > $1.lastPathComponent }
        for file in files.dropFirst(10) { try? FileManager.default.removeItem(at: file) }
        return ["saved": true]
    }
    private func productRows() -> [[String: Any]] {
        products.sorted { $0.id < $1.id }.map { product in
            var row = catalog[product.id] ?? [:]
            row["id"] = product.id; row["name"] = product.displayName
            row["description"] = product.description; row["displayPrice"] = product.displayPrice
            return row
        }
    }
    private func loadProducts() async throws {
        let response = try await request("/v1/catalog", authenticated: false)
        guard response["enabled"] as? Bool == true else { products = []; catalog = [:]; throw OnlineFailure(code: "store_unavailable", message: "The store is not connected yet.") }
        var next: [String: [String: Any]] = [:]
        for row in (response["products"] as? [[String: Any]]) ?? [] {
            guard let id = row["id"] as? String, let type = row["type"] as? String, ["consumable", "nonConsumable"].contains(type) else { continue }
            next[id] = row
        }
        catalog = next
        products = try await Product.products(for: Array(catalog.keys)).filter { product in
            catalog[product.id]?["type"] as? String == "nonConsumable" ? product.type == .nonConsumable : product.type == .consumable
        }
        if products.isEmpty { throw OnlineFailure(code: "store_unavailable", message: "The App Store has no available items yet.") }
    }
    private func restoreEntitlements() async throws {
        // StoreKit supplies signed transactions, but only the service grants ownership.
        // Empty local entitlements never remove server ownership for another Apple device.
        for await result in Transaction.currentEntitlements { _ = try await deliver(result) }
    }
    private func deliver(_ result: VerificationResult<Transaction>) async throws -> [String: Any] {
        guard case .verified(let transaction) = result else { throw OnlineFailure(code: "unverified", message: "Apple could not verify the purchase. Nothing was granted.") }
        guard let deliveryToken = token else { throw OnlineFailure(code: "sign_in", message: "Sign in to verify your pending purchase.") }
        let deliveryAccount = OnlineKeychain.read("account")
        guard !pendingDeliveries.contains(transaction.id) else { return ["status": "pending"] }
        pendingDeliveries.insert(transaction.id); defer { pendingDeliveries.remove(transaction.id) }
        let response = try await request("/v1/store/verify", method: "POST", body: ["jws": result.jwsRepresentation])
        guard ["granted", "revoked"].contains(response["status"] as? String ?? "") else { throw OnlineFailure(code: "verification_pending", message: "This purchase is still waiting for server verification.") }
        await transaction.finish()
        guard deliveryToken == token, deliveryAccount == OnlineKeychain.read("account") else { throw OnlineFailure(code: "account_changed", message: "The account changed while completing the purchase. Refresh the current kingdom.") }
        lastMessage = response["status"] as? String == "revoked" ? "The refunded item was removed from your online kingdom." : "Purchase verified and saved in your online kingdom."
        if let game = response["game"] { emit(event: "stonewake-online-purchase", value: ["game": game]) }
        return response
    }
    private func retryUnfinished() async {
        for await result in Transaction.unfinished { do { _ = try await deliver(result) } catch { lastMessage = "A purchase is waiting for verification. Reconnect to retry." } }
    }
    private func request(_ path: String, method: String = "GET", body: [String: Any]? = nil, authenticated: Bool = true, sessionToken: String? = nil) async throws -> [String: Any] {
        guard let baseURL, let url = URL(string: path, relativeTo: baseURL)?.absoluteURL, url.host == baseURL.host, url.scheme == "https" else { throw OnlineFailure(code: "unavailable", message: "Online services are not connected yet.") }
        let requestToken = token, requestAccount = OnlineKeychain.read("account")
        var request = URLRequest(url: url); request.httpMethod = method; request.timeoutInterval = 30
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        if let sessionToken { request.setValue("Bearer " + sessionToken, forHTTPHeaderField: "Authorization") }
        else if authenticated { guard let token else { throw OnlineFailure(code: "sign_in", message: "Sign in to continue.") }; request.setValue("Bearer " + token, forHTTPHeaderField: "Authorization") }
        if let body { request.httpBody = try JSONSerialization.data(withJSONObject: body) }
        let (data, response) = try await URLSession.shared.data(for: request)
        if authenticated, requestToken != token || requestAccount != OnlineKeychain.read("account") { throw OnlineFailure(code: "account_changed", message: "The account changed during this request. Refresh the current kingdom.") }
        guard data.count < 8_000_000, let result = try JSONSerialization.jsonObject(with: data) as? [String: Any], let http = response as? HTTPURLResponse else { throw OnlineFailure(code: "invalid_response", message: "The online service returned an unreadable response.") }
        guard (200..<300).contains(http.statusCode) else { let detail = result["error"] as? [String: Any] ?? [:]; throw OnlineFailure(code: detail["code"] as? String ?? "unavailable", message: detail["message"] as? String ?? "The service is temporarily unavailable.", details: detail["details"]) }
        return result
    }
    private func clearSession() { OnlineKeychain.delete("session"); OnlineKeychain.delete("account"); account = [:]; products = [] }
    private func authorize(nonce: String) async throws -> ASAuthorizationAppleIDCredential {
        try await withCheckedThrowingContinuation { continuation in
            signInContinuation = continuation
            let request = ASAuthorizationAppleIDProvider().createRequest(); request.nonce = nonce
            let controller = ASAuthorizationController(authorizationRequests: [request]); controller.delegate = self; controller.presentationContextProvider = self; authorizationController = controller; controller.performRequests()
        }
    }
    func authorizationController(controller: ASAuthorizationController, didCompleteWithAuthorization authorization: ASAuthorization) {
        defer { signInContinuation = nil; authorizationController = nil }
        if let credential = authorization.credential as? ASAuthorizationAppleIDCredential { signInContinuation?.resume(returning: credential) }
        else { signInContinuation?.resume(throwing: OnlineFailure(code: "sign_in", message: "Apple sign-in could not finish.")) }
    }
    func authorizationController(controller: ASAuthorizationController, didCompleteWithError error: Error) {
        defer { signInContinuation = nil; authorizationController = nil }
        let cancelled = (error as? ASAuthorizationError)?.code == .canceled
        signInContinuation?.resume(throwing: OnlineFailure(code: cancelled ? "cancelled" : "sign_in", message: cancelled ? "Sign-in was cancelled." : "Apple sign-in is unavailable. Your local kingdom is unchanged."))
    }
    func presentationAnchor(for controller: ASAuthorizationController) -> ASPresentationAnchor { webView?.window ?? ASPresentationAnchor() }
    private func reply(_ value: [String: Any]) { emit(event: "stonewake-online-reply", value: value) }
    private func broadcast() { emit(event: "stonewake-online-native-status", value: snapshot) }
    private func emit(event: String, value: [String: Any]) {
        guard JSONSerialization.isValidJSONObject(value), let data = try? JSONSerialization.data(withJSONObject: value) else { return }
        let encoded = data.base64EncodedString()
        webView?.evaluateJavaScript("window.dispatchEvent(new CustomEvent('\(event)',{detail:JSON.parse(new TextDecoder().decode(Uint8Array.from(atob('\(encoded)'),c=>c.charCodeAt(0))))}));", completionHandler: nil)
    }
}

enum OnlineKeychain {
    private static let service = "com.chrismozer.stonewake.online"
    static func read(_ key: String) -> String? {
        var item: CFTypeRef?
        let query: [String: Any] = [kSecClass as String: kSecClassGenericPassword, kSecAttrService as String: service, kSecAttrAccount as String: key, kSecReturnData as String: true, kSecMatchLimit as String: kSecMatchLimitOne]
        guard SecItemCopyMatching(query as CFDictionary, &item) == errSecSuccess, let data = item as? Data else { return nil }
        return String(data: data, encoding: .utf8)
    }
    static func write(_ value: String, key: String) throws {
        let query: [String: Any] = [kSecClass as String: kSecClassGenericPassword, kSecAttrService as String: service, kSecAttrAccount as String: key]
        let attrs: [String: Any] = [kSecValueData as String: Data(value.utf8), kSecAttrAccessible as String: kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly]
        let status = SecItemUpdate(query as CFDictionary, attrs as CFDictionary)
        if status == errSecItemNotFound { var insert = query; attrs.forEach { insert[$0.key] = $0.value }; guard SecItemAdd(insert as CFDictionary, nil) == errSecSuccess else { throw OnlineFailure(code: "secure_storage", message: "This iPhone could not save the secure session.") } }
        else if status != errSecSuccess { throw OnlineFailure(code: "secure_storage", message: "This iPhone could not save the secure session.") }
    }
    static func delete(_ key: String) { SecItemDelete([kSecClass as String: kSecClassGenericPassword, kSecAttrService as String: service, kSecAttrAccount as String: key] as CFDictionary) }
}
