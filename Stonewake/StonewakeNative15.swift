import Foundation
import UIKit
import WebKit
import UserNotifications
import UniformTypeIdentifiers

// A full-bleed world beneath safe-area-aware web controls. No page zoom.
final class StonewakeSurface15: UIView {
    static let ink = UIColor(red: 13/255, green: 25/255, blue: 35/255, alpha: 1)
    let webView: WKWebView
    var onRetry: (() -> Void)?
    private let cover = UIView()
    private let status = UILabel()
    private let spinner = UIActivityIndicatorView(style: .medium)
    private let retry = UIButton(type: .system)
    private var priorInsets: UIEdgeInsets?
    init(webView: WKWebView) {
        self.webView = webView
        super.init(frame: .zero)
        backgroundColor = Self.ink
        addSubview(webView)
        webView.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([webView.leadingAnchor.constraint(equalTo: leadingAnchor), webView.trailingAnchor.constraint(equalTo: trailingAnchor), webView.topAnchor.constraint(equalTo: topAnchor), webView.bottomAnchor.constraint(equalTo: bottomAnchor)])
        cover.backgroundColor = Self.ink
        cover.translatesAutoresizingMaskIntoConstraints = false
        addSubview(cover)
        NSLayoutConstraint.activate([cover.leadingAnchor.constraint(equalTo: leadingAnchor), cover.trailingAnchor.constraint(equalTo: trailingAnchor), cover.topAnchor.constraint(equalTo: topAnchor), cover.bottomAnchor.constraint(equalTo: bottomAnchor)])
        let crest = UIImageView(image: UIImage(systemName: "sun.horizon.fill"))
        crest.tintColor = UIColor(red: 222/255, green: 184/255, blue: 108/255, alpha: 1)
        crest.contentMode = .scaleAspectFit
        crest.heightAnchor.constraint(equalToConstant: 40).isActive = true
        let title = UILabel()
        title.text = "STONEWAKE"
        title.textColor = UIColor(red: 243/255, green: 232/255, blue: 205/255, alpha: 1)
        title.font = .systemFont(ofSize: 30, weight: .semibold)
        title.textAlignment = .center
        status.textColor = UIColor(red: 157/255, green: 176/255, blue: 185/255, alpha: 1)
        status.font = .systemFont(ofSize: 14)
        status.numberOfLines = 3
        status.textAlignment = .center
        spinner.color = .white
        retry.setTitle("Open kingdom again", for: .normal)
        retry.titleLabel?.font = .systemFont(ofSize: 16, weight: .semibold)
        retry.setTitleColor(crest.tintColor, for: .normal)
        retry.addTarget(self, action: #selector(retryTapped), for: .touchUpInside)
        retry.heightAnchor.constraint(greaterThanOrEqualToConstant: 44).isActive = true
        let stack = UIStackView(arrangedSubviews: [crest, title, status, spinner, retry])
        stack.axis = .vertical
        stack.spacing = 12
        stack.translatesAutoresizingMaskIntoConstraints = false
        cover.addSubview(stack)
        NSLayoutConstraint.activate([stack.centerXAnchor.constraint(equalTo: cover.centerXAnchor), stack.centerYAnchor.constraint(equalTo: cover.centerYAnchor), stack.widthAnchor.constraint(lessThanOrEqualToConstant: 440), stack.widthAnchor.constraint(equalTo: cover.widthAnchor, multiplier: 0.7)])
        showLoading()
    }
    required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }
    @objc private func retryTapped() { onRetry?() }
    func showLoading() {
        cover.isHidden = false
        cover.alpha = 1
        webView.accessibilityElementsHidden = true
        status.text = "Opening your coastal kingdom"
        retry.isHidden = true
        spinner.startAnimating()
    }
    func showFailure(_ message: String) {
        cover.isHidden = false
        cover.alpha = 1
        webView.accessibilityElementsHidden = true
        status.text = message
        retry.isHidden = false
        spinner.stopAnimating()
    }
    func finishLoading() {
        webView.accessibilityElementsHidden = false
        spinner.stopAnimating()
        UIView.animate(withDuration: UIAccessibility.isReduceMotionEnabled ? 0 : 0.2, animations: { self.cover.alpha = 0 }) { _ in
            self.cover.isHidden = self.cover.alpha == 0
        }
    }
    override func safeAreaInsetsDidChange() { super.safeAreaInsetsDidChange(); publishInsets() }
    override func layoutSubviews() { super.layoutSubviews(); publishInsets() }
    func publishInsets(force: Bool = false) {
        let inset = window?.safeAreaInsets ?? safeAreaInsets
        guard force || priorInsets != inset else { return }
        priorInsets = inset
        let values = ["top": inset.top, "right": inset.right, "bottom": inset.bottom, "left": inset.left]
        guard let data = try? JSONSerialization.data(withJSONObject: values), let json = String(data: data, encoding: .utf8) else { return }
        webView.evaluateJavaScript("(()=>{const v=\(json);window.__STONEWAKE_SAFE_AREA__=v;for(const k in v)document.documentElement.style.setProperty('--sw-native-safe-'+k,v[k]+'px');window.dispatchEvent(new CustomEvent('stonewake-safe-area',{detail:v}));})()", completionHandler: nil)
    }
}

// Read-only bundle assets are streamed in 64 KB chunks off the main thread.
// Two concurrent readers and cancellation bound memory and avoid a full-file copy.
final class StonewakeAssets15 {
    private final class Job {
        let lock = NSRecursiveLock()
        var cancelled = false
        func deliver(_ block: () -> Void) { lock.lock(); defer { lock.unlock() }; if !cancelled { block() } }
        func cancel() { lock.lock(); cancelled = true; lock.unlock() }
        var active: Bool { lock.lock(); defer { lock.unlock() }; return !cancelled }
    }
    private let queue: OperationQueue = {
        let queue = OperationQueue()
        queue.name = "Stonewake bundle reader"
        queue.maxConcurrentOperationCount = 2
        queue.qualityOfService = .userInitiated
        return queue
    }()
    private let lock = NSLock()
    private var jobs: [ObjectIdentifier: Job] = [:]
    func start(_ task: WKURLSchemeTask) {
        let key = ObjectIdentifier(task as AnyObject), job = Job()
        lock.lock(); jobs[key] = job; lock.unlock()
        queue.addOperation { [weak self] in
            guard let self else { return }
            defer { self.lock.lock(); self.jobs.removeValue(forKey: key); self.lock.unlock() }
            guard job.active else { return }
            do {
                guard let url = task.request.url, url.scheme == "stonewake", url.host == "app", ["GET", "HEAD"].contains(task.request.httpMethod ?? "GET"),
                      let root = Bundle.main.url(forResource: "Web", withExtension: nil)?.resolvingSymlinksInPath() else { throw URLError(.badURL) }
                let path = url.path == "/" ? "index.html" : String(url.path.dropFirst())
                let file = root.appendingPathComponent(path).standardizedFileURL.resolvingSymlinksInPath()
                guard file.path.hasPrefix(root.path + "/") else { throw URLError(.noPermissionsToReadFile) }
                let handle = try FileHandle(forReadingFrom: file)
                defer { try? handle.close() }
                let size = try handle.seekToEnd()
                guard size <= 64 * 1024 * 1024 else { throw URLError(.dataLengthExceedsMaximum) }
                try handle.seek(toOffset: 0)
                let mime: String
                switch file.pathExtension.lowercased() {
                case "js", "mjs": mime = "text/javascript"
                case "css": mime = "text/css"
                case "html": mime = "text/html"
                case "json", "webmanifest": mime = "application/json"
                case "webp": mime = "image/webp"
                case "svg": mime = "image/svg+xml"
                default: mime = UTType(filenameExtension: file.pathExtension)?.preferredMIMEType ?? "application/octet-stream"
                }
                let cache = url.query?.contains("v=") == true ? "private, max-age=31536000, immutable" : "no-cache"
                let response = HTTPURLResponse(url: url, statusCode: 200, httpVersion: "HTTP/1.1", headerFields: ["Content-Type": mime + (mime.hasPrefix("text/") ? "; charset=utf-8" : ""), "Content-Length": String(size), "Cache-Control": cache, "X-Content-Type-Options": "nosniff"])!
                job.deliver { task.didReceive(response) }
                if task.request.httpMethod != "HEAD" {
                    while job.active, let chunk = try handle.read(upToCount: 64 * 1024), !chunk.isEmpty { job.deliver { task.didReceive(chunk) } }
                }
                job.deliver { task.didFinish() }
            } catch { job.deliver { task.didFailWithError(error) } }
        }
    }
    func stop(_ task: WKURLSchemeTask) {
        lock.lock(); let job = jobs.removeValue(forKey: ObjectIdentifier(task as AnyObject)); lock.unlock()
        job?.cancel()
    }
    func cancelAll() {
        lock.lock(); let active = Array(jobs.values); jobs.removeAll(); lock.unlock()
        active.forEach { $0.cancel() }
        queue.cancelAllOperations()
    }
}

// Local diagnostic metadata only. Never stores names, save contents, tokens or URLs.
// An unclosed foreground session is not classified as a crash.
@MainActor final class StonewakeDiagnostics15 {
    static let allowedEvents: Set<String> = ["session_start", "session_active", "session_inactive", "session_background", "session_closed", "previous_session_unclosed", "game_ready", "document_loaded", "load_timeout", "navigation_failed", "web_process_terminated", "automatic_reload", "manual_reload", "memory_warning", "save_failed", "engine_worker", "engine_failed", "js_error", "unhandled_rejection", "performance_sample", "tutorial_step", "tutorial_complete", "battle_start", "battle_end", "screen_view", "notifications_enabled", "notifications_disabled", "diagnostics_export", "session_resume", "session_end", "screen_open", "action_ok", "action_blocked", "guide_start", "guide_step", "guide_skip", "guide_complete", "frame_sample", "runtime_error", "promise_error", "input_sample"]
    static let allowedMetrics: Set<String> = ["fps", "p50", "p95", "p99", "frameMs", "slowFrames", "samples", "width", "height", "durationMs", "code", "step", "count", "won", "chapter", "sea", "elapsedMs", "screen", "action", "completed", "total", "slow_percent", "damage", "tapDowns", "tapReleases", "tapClicks", "tapCancelled", "tapMissingClicks", "tapDetached", "tapMoved", "tapRepeated", "inputDelayMaxMs", "inputDelayP95Ms", "mainLagMaxMs", "sampleSeconds", "tapReleaseHitMismatch", "tapDisabledRelease", "tapPreventedRelease", "tapUnmatchedClicks", "tapActivatedTouch", "tapRejected"]
    private(set) var events: [[String: Any]] = []
    var enabled: Bool {
        get { UserDefaults.standard.object(forKey: "native15.diagnosticsEnabled") as? Bool ?? true }
        set { UserDefaults.standard.set(newValue, forKey: "native15.diagnosticsEnabled") }
    }
    private var pendingFlush: DispatchWorkItem?
    private let file = SaveStore.directory.appendingPathComponent("native-diagnostics15.json")
    init() {
        if let data = try? Data(contentsOf: file), data.count < 512_000, let prior = try? JSONSerialization.jsonObject(with: data) as? [[String: Any]] { events = Array(prior.suffix(300)) }
        if UserDefaults.standard.bool(forKey: "native15.foregroundSession") { record("previous_session_unclosed") }
        UserDefaults.standard.set(true, forKey: "native15.foregroundSession")
    }
    func record(_ event: String, metrics: [String: Double] = [:]) {
        guard enabled, Self.allowedEvents.contains(event) else { return }
        let safe = metrics.filter { Self.allowedMetrics.contains($0.key) && $0.value.isFinite && abs($0.value) <= 1_000_000_000 }
        events.append(["event": event, "at": Int(Date().timeIntervalSince1970 * 1000), "metrics": safe])
        if events.count > 300 { events.removeFirst(events.count - 300) }
        if pendingFlush == nil {
            let work = DispatchWorkItem { [weak self] in self?.flush() }
            pendingFlush = work
            DispatchQueue.main.asyncAfter(deadline: .now() + 3, execute: work)
        }
    }
    func lifecycle(_ state: String) {
        record("session_" + state)
        UserDefaults.standard.set(state == "active", forKey: "native15.foregroundSession")
        if state != "active" { flush() }
    }
    func flush() {
        pendingFlush?.cancel(); pendingFlush = nil
        try? FileManager.default.createDirectory(at: SaveStore.directory, withIntermediateDirectories: true)
        if let data = try? JSONSerialization.data(withJSONObject: events) { try? data.write(to: file, options: [.atomic, .completeFileProtectionUntilFirstUserAuthentication]) }
    }
    func clear() {
        events.removeAll()
        flush()
    }
    func exportFile() throws -> URL {
        record("diagnostics_export"); flush()
        let report: [String: Any] = ["format": 1, "build": Bundle.main.object(forInfoDictionaryKey: "CFBundleVersion") as? String ?? "15", "system": UIDevice.current.systemVersion, "deviceClass": UIDevice.current.userInterfaceIdiom == .phone ? "phone" : "tablet", "localOnly": true, "enabled": enabled, "note": "Unclosed sessions are not proof of a crash. This report excludes kingdom saves and account credentials.", "events": events]
        let url = FileManager.default.temporaryDirectory.appendingPathComponent("Stonewake-Support.json")
        try JSONSerialization.data(withJSONObject: report, options: [.prettyPrinted, .sortedKeys]).write(to: url, options: [.atomic, .completeFileProtectionUntilFirstUserAuthentication])
        return url
    }
}

@MainActor final class StonewakeNative15: NSObject, UNUserNotificationCenterDelegate {
    weak var webView: WKWebView?
    let diagnostics = StonewakeDiagnostics15()
    private let center = UNUserNotificationCenter.current()
    private let prefix = "stonewake.project."
    private var projects: [[String: Any]] = []
    private var scheduleGeneration = 0
    private var notificationTail: Task<Void, Never>?
    private var enabled: Bool {
        get { UserDefaults.standard.bool(forKey: "native15.notificationsEnabled") }
        set { UserDefaults.standard.set(newValue, forKey: "native15.notificationsEnabled") }
    }
    override init() { super.init(); center.delegate = self }
    func lifecycle(_ state: String) {
        diagnostics.lifecycle(state)
        emit("stonewake-lifecycle", value: ["state": state])
        if state == "active" { Task { emit("stonewake-notifications-changed", value: await notificationStatus()) } }
    }
    func handle(id: String?, method: String, payload: [String: Any]) {
        guard id == nil || id!.count <= 100 else { return }
        Task {
            do {
                let result = try await perform(method, payload: payload)
                if let id { emit("stonewake-native-response", value: ["id": id, "ok": true, "result": result]) }
            } catch {
                if let id { emit("stonewake-native-response", value: ["id": id, "ok": false, "error": ["message": error.localizedDescription]]) }
            }
        }
    }
    private func perform(_ method: String, payload: [String: Any]) async throws -> [String: Any] {
        switch method {
        case "ready": return ["ready": true]
        case "status": return ["version": 15, "landscape": true, "notifications": await notificationStatus(), "diagnostics": ["localOnly": true, "enabled": diagnostics.enabled, "eventCount": diagnostics.events.count]]
        case "notifications.status": return await notificationStatus()
        case "notifications.request":
            guard payload["userInitiated"] as? Bool == true else { throw Native15Error.userActionRequired }
            let before = await center.notificationSettings()
            if before.authorizationStatus == .notDetermined { _ = try await center.requestAuthorization(options: [.alert, .sound]) }
            let settings = await center.notificationSettings()
            enabled = [.authorized, .provisional, .ephemeral].contains(settings.authorizationStatus)
            if enabled { diagnostics.record("notifications_enabled"); await syncNotifications() }
            let result = await notificationStatus()
            emit("stonewake-notifications-changed", value: result)
            return result
        case "notifications.sync":
            projects = Self.validProjects(payload["projects"] as? [[String: Any]] ?? [])
            await syncNotifications()
            return await notificationStatus()
        case "notifications.disable":
            enabled = false
            scheduleGeneration += 1
            await notificationTail?.value
            let pending = await center.pendingNotificationRequests()
            center.removePendingNotificationRequests(withIdentifiers: pending.filter { $0.identifier.hasPrefix(prefix) }.map(\.identifier))
            let delivered = await center.deliveredNotifications()
            center.removeDeliveredNotifications(withIdentifiers: delivered.filter { $0.request.identifier.hasPrefix(prefix) }.map { $0.request.identifier })
            diagnostics.record("notifications_disabled")
            let result = await notificationStatus()
            emit("stonewake-notifications-changed", value: result)
            return result
        case "notifications.settings":
            guard payload["userInitiated"] as? Bool == true, let url = URL(string: UIApplication.openSettingsURLString) else { throw Native15Error.userActionRequired }
            await UIApplication.shared.open(url)
            return ["opened": true]
        case "diagnostics.settings":
            guard let enabled = payload["enabled"] as? Bool else { throw Native15Error.unknownMethod }
            diagnostics.enabled = enabled
            return ["enabled": diagnostics.enabled, "localOnly": true]
        case "diagnostics.clear":
            guard payload["userInitiated"] as? Bool == true else { throw Native15Error.userActionRequired }
            diagnostics.clear()
            return ["cleared": true, "enabled": diagnostics.enabled, "localOnly": true]
        case "diagnostics.record":
            if let event = payload["event"] as? String { diagnostics.record(event, metrics: (payload["metrics"] as? [String: NSNumber] ?? [:]).mapValues(\.doubleValue)) }
            return ["recorded": true]
        case "diagnostics.export":
            guard payload["userInitiated"] as? Bool == true else { throw Native15Error.userActionRequired }
            let file = try diagnostics.exportFile()
            guard let scene = webView?.window?.windowScene, var presenter = scene.windows.first(where: \.isKeyWindow)?.rootViewController else { throw Native15Error.unavailable }
            while let shown = presenter.presentedViewController { presenter = shown }
            guard !presenter.isBeingDismissed, !(presenter is UIActivityViewController) else { throw Native15Error.unavailable }
            let share = UIActivityViewController(activityItems: [file], applicationActivities: nil)
            share.popoverPresentationController?.sourceView = webView
            share.popoverPresentationController?.sourceRect = CGRect(x: (webView?.bounds.midX ?? 0), y: (webView?.bounds.midY ?? 0), width: 1, height: 1)
            presenter.present(share, animated: true)
            return ["presented": true]
        default: throw Native15Error.unknownMethod
        }
    }
    private func notificationStatus() async -> [String: Any] {
        let settings = await center.notificationSettings()
        let names: [UNAuthorizationStatus: String] = [.notDetermined: "notDetermined", .denied: "denied", .authorized: "authorized", .provisional: "provisional", .ephemeral: "ephemeral"]
        return ["authorization": names[settings.authorizationStatus] ?? "unknown", "enabled": enabled && [.authorized, .provisional, .ephemeral].contains(settings.authorizationStatus), "localOnly": true]
    }
    static func validProjects(_ raw: [[String: Any]], now: Double = Date().timeIntervalSince1970 * 1000) -> [[String: Any]] {
        var seen = Set<String>()
        return raw.prefix(100).compactMap { item in
            guard let id = item["id"] as? String, !id.isEmpty, id.count <= 80, id.range(of: "^[A-Za-z0-9_:.\\-]+$", options: .regularExpression) != nil, !seen.contains(id),
                  let title = item["title"] as? String, !title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty,
                  let ready = item["readyAt"] as? Double, ready.isFinite, ready > now + 1000, ready <= now + 30 * 86400000 else { return nil }
            seen.insert(id)
            return ["id": id, "title": String(title.components(separatedBy: .controlCharacters).joined(separator: " ").prefix(80)), "readyAt": ready]
        }.sorted { ($0["readyAt"] as! Double) < ($1["readyAt"] as! Double) }.prefix(20).map { $0 }
    }
    private func syncNotifications() async {
        scheduleGeneration += 1
        let generation = scheduleGeneration
        let previous = notificationTail
        let task = Task { [weak self] in
            await previous?.value
            await self?.applyNotifications(generation: generation)
        }
        notificationTail = task
        await task.value
    }
    private func applyNotifications(generation: Int) async {
        let settings = await center.notificationSettings()
        guard generation == scheduleGeneration, enabled, [.authorized, .provisional, .ephemeral].contains(settings.authorizationStatus) else { return }
        let pending = await center.pendingNotificationRequests()
        guard generation == scheduleGeneration, enabled else { return }
        let desired = Self.validProjects(projects)
        let ids = Set(desired.map { prefix + ($0["id"] as! String) })
        center.removePendingNotificationRequests(withIdentifiers: pending.filter { $0.identifier.hasPrefix(prefix) && !ids.contains($0.identifier) }.map(\.identifier))
        for item in desired {
            guard generation == scheduleGeneration, enabled else { return }
            let id = prefix + (item["id"] as! String), ready = item["readyAt"] as! Double, title = item["title"] as! String
            if pending.contains(where: { $0.identifier == id && ($0.content.userInfo["readyAt"] as? Double) == ready && $0.content.body == title + " is ready." }) { continue }
            let content = UNMutableNotificationContent()
            content.title = "Stonewake"
            content.body = title + " is ready."
            content.sound = .default
            content.threadIdentifier = "stonewake-projects"
            content.userInfo = ["readyAt": ready]
            let interval = max(1, ready / 1000 - Date().timeIntervalSince1970)
            try? await center.add(UNNotificationRequest(identifier: id, content: content, trigger: UNTimeIntervalNotificationTrigger(timeInterval: interval, repeats: false)))
            if !enabled { center.removePendingNotificationRequests(withIdentifiers: [id]) }
        }
    }
    private func emit(_ name: String, value: [String: Any]) {
        guard let data = try? JSONSerialization.data(withJSONObject: value) else { return }
        let encoded = data.base64EncodedString()
        webView?.evaluateJavaScript("window.dispatchEvent(new CustomEvent('\(name)',{detail:JSON.parse(new TextDecoder().decode(Uint8Array.from(atob('\(encoded)'),c=>c.charCodeAt(0))))}));", completionHandler: nil)
    }
    // Completion notices stay quiet while the player is already in the game.
    nonisolated func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) { completionHandler([]) }
}

enum Native15Error: LocalizedError {
    case userActionRequired, unavailable, unknownMethod
    var errorDescription: String? {
        switch self {
        case .userActionRequired: return "Choose this action in Settings first."
        case .unavailable: return "This action is not available right now."
        case .unknownMethod: return "This app does not support that action."
        }
    }
}
