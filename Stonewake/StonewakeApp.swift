import SwiftUI
import AVFoundation
import WebKit
import UniformTypeIdentifiers
import UIKit

@main
struct StonewakeApp: App {
    init() { activateAudio() }

    private func activateAudio() {
        do {
            let session = AVAudioSession.sharedInstance()
            try session.setCategory(.playback, mode: .default, options: [.mixWithOthers])
            try session.setActive(true)
        } catch {
            NSLog("Stonewake audio activation failed: %@", error.localizedDescription)
        }
    }

    var body: some Scene {
        WindowGroup {
            GameView()
                .ignoresSafeArea(.all)
                .statusBarHidden(true)
                .background(Color(red: 23/255, green: 34/255, blue: 55/255))
                .preferredColorScheme(.dark)
                .onReceive(NotificationCenter.default.publisher(for: UIApplication.didBecomeActiveNotification)) { _ in
                    activateAudio()
                }
        }
    }
}

struct GameView: UIViewRepresentable {
    func makeCoordinator() -> Coordinator { Coordinator() }
    func makeUIView(context: Context) -> StonewakeSurface15 {
        let configuration = WKWebViewConfiguration()
        configuration.websiteDataStore = .default()
        configuration.setURLSchemeHandler(context.coordinator, forURLScheme: "stonewake")
        configuration.userContentController.add(context.coordinator, name: "stonewake")
        configuration.allowsInlineMediaPlayback = true
        configuration.mediaTypesRequiringUserActionForPlayback = [.video]
        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.isOpaque = false
        webView.backgroundColor = StonewakeSurface15.ink
        webView.scrollView.backgroundColor = StonewakeSurface15.ink
        webView.scrollView.isScrollEnabled = false
        webView.scrollView.bounces = false
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        webView.scrollView.bouncesZoom = false
        webView.scrollView.minimumZoomScale = 1
        webView.scrollView.maximumZoomScale = 1
        webView.scrollView.pinchGestureRecognizer?.isEnabled = false
        webView.navigationDelegate = context.coordinator
        let surface = StonewakeSurface15(webView: webView)
        context.coordinator.surface = surface
        context.coordinator.webView = webView
        context.coordinator.online.webView = webView
        context.coordinator.native.webView = webView
        surface.onRetry = { [weak coordinator = context.coordinator] in coordinator?.loadGame(reason: "manual_reload") }
        context.coordinator.loadGame(reason: "session_start")
        return surface
    }
    func updateUIView(_ uiView: StonewakeSurface15, context: Context) {}
    static func dismantleUIView(_ uiView: StonewakeSurface15, coordinator: Coordinator) {
        uiView.webView.configuration.userContentController.removeScriptMessageHandler(forName: "stonewake")
        uiView.webView.navigationDelegate = nil
        coordinator.teardown()
    }
    final class Coordinator: NSObject, WKNavigationDelegate, WKURLSchemeHandler, WKScriptMessageHandler {
        weak var webView: WKWebView?
        weak var surface: StonewakeSurface15?
        let native = StonewakeNative15()
        let assets = StonewakeAssets15()
        private var recoveryDates: [Date] = []
        private var observers: [NSObjectProtocol] = []
        private var loadingTimeout: DispatchWorkItem?
        private var ready = false
        override init() {
            super.init()
            for (name, state) in [(UIApplication.willResignActiveNotification, "inactive"), (UIApplication.didEnterBackgroundNotification, "background"), (UIApplication.didBecomeActiveNotification, "active")] {
                observers.append(NotificationCenter.default.addObserver(forName: name, object: nil, queue: .main) { [weak self] _ in
                    Task { @MainActor [weak self] in
                        guard let self else { return }
                        self.native.lifecycle(state)
                        if state == "active" { self.surface?.publishInsets(force: true) }
                    }
                })
            }
            observers.append(NotificationCenter.default.addObserver(forName: UIApplication.didReceiveMemoryWarningNotification, object: nil, queue: .main) { [weak self] _ in
                Task { @MainActor [weak self] in self?.native.diagnostics.record("memory_warning") }
            })
        }
        func teardown() {
            observers.forEach(NotificationCenter.default.removeObserver)
            observers.removeAll()
            loadingTimeout?.cancel()
            narration.stop()
            audio.suspend()
            assets.cancelAll()
            native.lifecycle("closed")
        }
        func loadGame(reason: String) {
            guard let webView else { return }
            ready = false
            narration.stop()
            audio.suspend()
            assets.cancelAll()
            surface?.showLoading()
            native.diagnostics.record(reason)
            // Replace boot scripts on every recovery. Never accumulate old save snapshots.
            let data = SaveStore.load() ?? Data("null".utf8)
            let encoded = data.base64EncodedString()
            let seen = UserDefaults.standard.bool(forKey: "openingSeen") ? "true" : "false"
            let boot = "window.__STONEWAKE_SAVE__=JSON.parse(new TextDecoder().decode(Uint8Array.from(atob('\(encoded)'),c=>c.charCodeAt(0))));window.__STONEWAKE_INTRO_SEEN__=\(seen);window.__STONEWAKE_NATIVE__={version:15,landscape:true};"
            webView.configuration.userContentController.removeAllUserScripts()
            webView.configuration.userContentController.addUserScript(WKUserScript(source: boot, injectionTime: .atDocumentStart, forMainFrameOnly: true))
            webView.load(URLRequest(url: URL(string: "stonewake://app/index.html")!, cachePolicy: .reloadIgnoringLocalCacheData))
            loadingTimeout?.cancel()
            let timeout = DispatchWorkItem { [weak self] in
                guard let self, !self.ready else { return }
                self.surface?.showFailure("Your kingdom is taking longer to open. Try again without changing your saved progress.")
                self.native.diagnostics.record("load_timeout")
            }
            loadingTimeout = timeout
            DispatchQueue.main.asyncAfter(deadline: .now() + 25, execute: timeout)
        }
        private func gameReady() {
            guard !ready else { return }
            ready = true
            audio.resumeIfActive(UIApplication.shared.applicationState == .active)
            loadingTimeout?.cancel()
            surface?.finishLoading()
            surface?.publishInsets(force: true)
            native.diagnostics.record("game_ready")
        }
        let audio = GameAudio()
        let feedback = GameFeedback()
        let online = StonewakeOnline()
        lazy var narration: GameNarration = {
            let voice = GameNarration(audio: audio)
            voice.onState = { [weak self] value in
                guard let data = try? JSONSerialization.data(withJSONObject: value) else { return }
                let encoded = data.base64EncodedString()
                self?.webView?.evaluateJavaScript("window.dispatchEvent(new CustomEvent('stonewake-narration-status',{detail:JSON.parse(new TextDecoder().decode(Uint8Array.from(atob('\(encoded)'),c=>c.charCodeAt(0))))}));", completionHandler: nil)
            }
            return voice
        }()
        func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
            guard message.frameInfo.isMainFrame, message.frameInfo.request.url?.scheme == "stonewake", message.frameInfo.request.url?.host == "app",
                  let body = message.body as? [String: Any], let kind = body["kind"] as? String else { return }
            if kind == "native", let method = body["method"] as? String {
                let payload = body["payload"] as? [String: Any] ?? [:]
                if method == "ready" { gameReady() }
                native.handle(id: body["id"] as? String, method: method, payload: payload)
                return
            }
            if kind == "online", let id = body["id"] as? String, let method = body["method"] as? String {
                online.handle(id: id, method: method, payload: body["payload"] as? [String: Any] ?? [:]); return
            }
            if kind == "runtimeStatus", let engine = body["engine"] as? String, ["worker", "failed"].contains(engine) {
                native.diagnostics.record(engine == "worker" ? "engine_worker" : "engine_failed")
                return
            }
            if kind == "narration" {
                if body["action"] as? String == "stop" { narration.stop() }
                else if body["action"] as? String == "speak", let text = body["text"] as? String {
                    narration.speak(text, speaker: body["speaker"] as? String, eventID: body["eventId"] as? String)
                }
                return
            }
            if kind == "musicContext", let context = body["context"] as? String {
                audio.setMusicContext(context, intensity: body["intensity"] as? Double ?? 0.4)
                return
            }
            if kind == "musicSettings", let enabled = body["enabled"] as? Bool {
                audio.setMusic(enabled: enabled, volume: body["volume"] as? Double ?? 0.12, battleVolume: body["battleVolume"] as? Double ?? 0.14)
                return
            }
            if kind == "sound", let effect = body["effect"] as? String, let volume = body["volume"] as? Double {
                audio.play(effect, volume: volume)
                return
            }
            if kind == "feedbackSettings" {
                let reduced = body["reducedEffects"] as? Bool ?? false
                feedback.update(enabled: body["haptics"] as? Bool ?? true, reduced: reduced)
                audio.setReducedEffects(reduced)
                return
            }
            if kind == "haptic", let event = body["event"] as? String {
                feedback.play(event, intensity: body["intensity"] as? Double ?? 0.5, eventID: body["eventId"] as? String)
                return
            }
            if kind == "soundSettings", let enabled = body["enabled"] as? Bool, let volume = body["volume"] as? Double {
                audio.update(enabled: enabled, volume: volume)
                narration.update(enabled: enabled, volume: volume)
                return
            }
            if kind == "introSeen" { UserDefaults.standard.set(true, forKey: "openingSeen"); return }
            guard kind == "save", let payload = body["payload"] as? String, let data = payload.data(using: .utf8) else { return }
            // Acknowledge only after the serial durable writer finishes. Disk and JSON
            // validation never occupy the web view's input thread.
            let requestID = (body["requestId"] as? String).flatMap { $0.count <= 160 ? $0 : nil }
            let backgroundTask = UIApplication.shared.beginBackgroundTask(withName: "Save kingdom")
            SaveStore.writeAsync(data) { [weak self] saved in
                DispatchQueue.main.async {
                    if !saved { self?.native.diagnostics.record("save_failed") }
                    let detail: [String: Any] = ["saved": saved, "requestId": requestID ?? ""]
                    if let encoded = try? JSONSerialization.data(withJSONObject: detail), let json = String(data: encoded, encoding: .utf8) {
                        self?.webView?.evaluateJavaScript("window.dispatchEvent(new CustomEvent('stonewake-save-status',{detail:\(json)}));", completionHandler: nil)
                    }
                    if backgroundTask != .invalid { UIApplication.shared.endBackgroundTask(backgroundTask) }
                }
            }
        }
        func webView(_ webView: WKWebView, start urlSchemeTask: WKURLSchemeTask) { assets.start(urlSchemeTask) }
        func webView(_ webView: WKWebView, stop urlSchemeTask: WKURLSchemeTask) { assets.stop(urlSchemeTask) }
        func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
            guard let url = navigationAction.request.url else { decisionHandler(.cancel); return }
            if url.scheme == "stonewake" && url.host == "app" { decisionHandler(.allow) }
            else { decisionHandler(.cancel) }
        }
        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            webView.scrollView.pinchGestureRecognizer?.isEnabled = false
            webView.scrollView.setZoomScale(1, animated: false)
            surface?.publishInsets(force: true)
            native.diagnostics.record("document_loaded")
            // Legacy-compatible fallback only after React has actually rendered.
            DispatchQueue.main.asyncAfter(deadline: .now() + 2) { [weak self, weak webView] in
                webView?.evaluateJavaScript("!!document.querySelector('#root')?.children.length") { value, _ in
                    if value as? Bool == true { self?.gameReady() }
                }
            }
        }
        func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) { failed(error) }
        func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) { failed(error) }
        private func failed(_ error: Error) {
            guard (error as NSError).code != NSURLErrorCancelled else { return }
            loadingTimeout?.cancel()
            native.diagnostics.record("navigation_failed", metrics: ["code": Double((error as NSError).code)])
            surface?.showFailure("Your kingdom could not open. Your saved progress is still on this iPhone.")
        }
        func webViewWebContentProcessDidTerminate(_ webView: WKWebView) {
            native.diagnostics.record("web_process_terminated")
            let now = Date()
            recoveryDates = recoveryDates.filter { now.timeIntervalSince($0) < 60 }
            recoveryDates.append(now)
            if recoveryDates.count <= 2 { loadGame(reason: "automatic_reload") }
            else {
                loadingTimeout?.cancel()
                surface?.showFailure("The game stopped several times. Try opening your saved kingdom again.")
            }
        }
    }
}

enum SaveStore {
    private static let queue = DispatchQueue(label: "com.chrismozer.stonewake.saves", qos: .utility)
    static var directory: URL { FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0].appendingPathComponent("Stonewake", isDirectory: true) }
    static var primary: URL { directory.appendingPathComponent("kingdom.json") }
    static var backup: URL { directory.appendingPathComponent("kingdom.backup.json") }
    static func valid(_ data: Data) -> Bool {
        guard data.count < 8_000_000, let root = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let state = root["state"] as? [String: Any], (state["schema"] as? Int) == 1,
              state["revision"] is NSNumber, let buildings = state["buildings"] as? [[String: Any]], !buildings.isEmpty else { return false }
        return true
    }
    static func load() -> Data? {
        queue.sync {
            for file in [primary, backup] { if let data = try? Data(contentsOf: file), valid(data) { return data } }
            return nil
        }
    }
    static func write(_ data: Data) throws { try queue.sync { try writeSerial(data) } }
    static func writeAsync(_ data: Data, completion: @escaping @Sendable (Bool) -> Void) {
        queue.async {
            do { try writeSerial(data); completion(true) }
            catch { completion(false) }
        }
    }
    private static func writeSerial(_ data: Data) throws {
        guard valid(data) else { throw CocoaError(.fileWriteInapplicableStringEncoding) }
        try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
        if let old = try? Data(contentsOf: primary), valid(old) { try old.write(to: backup, options: [.atomic, .completeFileProtectionUntilFirstUserAuthentication]) }
        try data.write(to: primary, options: [.atomic, .completeFileProtectionUntilFirstUserAuthentication])
    }
}

// Explicit visual-event feedback is independent of the sound toggle.
final class GameFeedback {
    private let tap = UIImpactFeedbackGenerator(style: .soft)
    private let reward = UINotificationFeedbackGenerator()
    private let impact = UIImpactFeedbackGenerator(style: .rigid)
    private var lastTap: TimeInterval = 0
    private var enabled = true
    private var reduced = false
    private var recentIDs: [String] = []
    func update(enabled: Bool, reduced: Bool) { self.enabled = enabled; self.reduced = reduced }
    func play(_ event: String, intensity: Double, eventID: String?) {
        let now = ProcessInfo.processInfo.systemUptime
        guard enabled, intensity.isFinite, UIApplication.shared.applicationState == .active else { return }
        if let id = eventID {
            guard !recentIDs.contains(id) else { return }
            recentIDs.append(id); if recentIDs.count > 128 { recentIDs.removeFirst() }
        }
        let value = CGFloat(max(0, min(reduced ? 0.3 : 0.7, intensity)))
        let heavy = ["naval", "destroy", "impact"].contains(event)
        guard now - lastTap > (heavy ? (reduced ? 0.9 : 0.3) : 0.1) else { return }
        lastTap = now
        switch event {
        case "victory", "reward":
            if reduced { tap.impactOccurred(intensity: value) } else { reward.notificationOccurred(.success) }
        case "error", "defeat":
            if reduced { tap.impactOccurred(intensity: value) } else { reward.notificationOccurred(.warning) }
        case "naval", "destroy", "impact": impact.impactOccurred(intensity: value)
        case "select", "place", "deploy": tap.impactOccurred(intensity: value)
        default: break
        }
    }
}

// Keep overlapping effects alive until playback finishes.
final class GameAudio: NSObject, AVAudioPlayerDelegate, @unchecked Sendable {
    private let queue = DispatchQueue(label: "com.chrismozer.stonewake.audio", qos: .userInitiated)
    private var appActive = false
    private var sessionPrepared = false
    private var effectPool: [String: [AVAudioPlayer]] = [:]
    private var players: [AVAudioPlayer] = []
    private var music: AVAudioPlayer?
    private var percussion: AVAudioPlayer?
    private var intensity: Float = 0.4
    private var reducedEffects = false
    private var narrationActive = false
    private var retiringMusic: [AVAudioPlayer] = []
    private var musicContext = "city"
    private var loadedTrack: String?
    private var audioInterrupted = false
    private var routeSuspended = false
    private var soundEnabled = true
    private var musicEnabled = true
    private var level: Float = 0.55
    private var musicLevel: Float = 0.12
    private var battleMusicLevel: Float = 0.14
    private var effectDuck: Float = 1
    private var duckRecovery: DispatchWorkItem?
    private var lastEffects: [String: TimeInterval] = [:]

    override init() {
        super.init()
        appActive = UIApplication.shared.applicationState == .active
        queue.async { [weak self] in self?.prepareEffects() }
        NotificationCenter.default.addObserver(self, selector: #selector(pauseMusic), name: UIApplication.willResignActiveNotification, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(resumeMusic), name: UIApplication.didBecomeActiveNotification, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(interrupted(_:)), name: AVAudioSession.interruptionNotification, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(routeChanged(_:)), name: AVAudioSession.routeChangeNotification, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(resetAudio), name: AVAudioSession.mediaServicesWereResetNotification, object: nil)
    }

    deinit { NotificationCenter.default.removeObserver(self) }

    func setMusic(enabled: Bool, volume: Double, battleVolume: Double = 0.14) { queue.async { self.setMusicQueued(enabled: enabled, volume: volume, battleVolume: battleVolume) } }
    func setMusicContext(_ context: String, intensity: Double) { queue.async { self.setMusicContextQueued(context, intensity: intensity) } }
    func setReducedEffects(_ reduced: Bool) { queue.async { self.setReducedEffectsQueued(reduced) } }
    func setNarrationActive(_ active: Bool) { queue.async { self.setNarrationActiveQueued(active) } }
    func update(enabled: Bool, volume: Double) { queue.async { self.updateQueued(enabled: enabled, volume: volume) } }
    func play(_ effect: String, volume: Double) { queue.async { self.playQueued(effect, volume: volume) } }
    func suspend() { queue.async { self.appActive = false; self.pauseMusicQueued() } }
    func resumeIfActive(_ active: Bool) { queue.async { self.appActive = active; self.resumeMusicQueued() } }
    @objc private func pauseMusic() { queue.async { self.appActive = false; self.pauseMusicQueued() } }
    @objc private func resumeMusic() { queue.async { self.appActive = true; self.resumeMusicQueued() } }
    @objc private func interrupted(_ note: Notification) { queue.async { self.interruptedQueued(note) } }
    @objc private func routeChanged(_ note: Notification) { queue.async { self.routeChangedQueued(note) } }
    @objc private func resetAudio() { queue.async { self.resetAudioQueued() } }
    func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool) { queue.async { self.audioPlayerDidFinishPlayingQueued(player, successfully: flag) } }

    private func prepareSession() throws {
        guard !sessionPrepared else { return }
        let session = AVAudioSession.sharedInstance()
        try session.setCategory(.playback, mode: .default, options: [.mixWithOthers])
        try session.setActive(true)
        sessionPrepared = true
    }
    private func prepareEffects() {
        for name in effects {
            guard let url = Bundle.main.url(forResource: name, withExtension: "wav", subdirectory: "Web/audio") else { continue }
            let voices = ["click", "hit", "naval-impact", "wood-break"].contains(name) ? 3 : 2
            effectPool[name] = (0..<voices).compactMap { _ in
                guard let player = try? AVAudioPlayer(contentsOf: url) else { return nil }
                player.enableRate = true; player.delegate = self; player.prepareToPlay()
                return player
            }
        }
    }


    func setMusicQueued(enabled: Bool, volume: Double, battleVolume: Double = 0.14) {
        guard volume.isFinite else { return }
        musicLevel = Float(max(0, min(1, volume)))
        if battleVolume.isFinite { battleMusicLevel = Float(max(0, min(1, battleVolume))) }
        musicEnabled = enabled
        routeSuspended = false
        resumeMusicQueued()
    }

    func setMusicContextQueued(_ context: String, intensity: Double) {
        let context = context == "calm" ? "city" : context
        guard ["city", "scout", "battle", "victory"].contains(context), intensity.isFinite else { return }
        self.intensity = Float(max(0, min(1, intensity)))
        if context == musicContext { updatePercussion(); return }
        musicContext = context
        resumeMusicQueued()
    }

    func setReducedEffectsQueued(_ reduced: Bool) { reducedEffects = reduced; updatePercussion() }

    func setNarrationActiveQueued(_ active: Bool) {
        narrationActive = active
        updateMusicVolume(fade: active ? 0.2 : 0.65)
        updatePercussion()
    }

    private func updateMusicVolume(fade: TimeInterval) {
        music?.setVolume(musicEnabled ? (musicContext == "battle" ? battleMusicLevel : musicLevel) * (musicContext == "victory" ? 0.36 : 0.45) * (narrationActive ? 0.22 : 1) * effectDuck : 0, fadeDuration: fade)
    }

    private func updatePercussion() {
        percussion?.setVolume(musicEnabled && musicContext == "battle" && !reducedEffects ? battleMusicLevel * intensity * 0.25 * effectDuck * (narrationActive ? 0.22 : 1) : 0, fadeDuration: 1.2)
    }

    private func pauseMusicQueued() {
        players.forEach { $0.stop() }
        players.removeAll()
        duckRecovery?.cancel()
        effectDuck = 1
        music?.pause()
        percussion?.pause()
        retiringMusic.forEach { $0.stop() }
        retiringMusic.removeAll()
    }

    private func interruptedQueued(_ notification: Notification) {
        guard let raw = notification.userInfo?[AVAudioSessionInterruptionTypeKey] as? UInt,
              let type = AVAudioSession.InterruptionType(rawValue: raw) else { return }
        if type == .began { audioInterrupted = true; sessionPrepared = false; pauseMusicQueued() }
        else if let options = notification.userInfo?[AVAudioSessionInterruptionOptionKey] as? UInt,
                AVAudioSession.InterruptionOptions(rawValue: options).contains(.shouldResume) { audioInterrupted = false; resumeMusicQueued() }
        else { audioInterrupted = false }
    }

    private func routeChangedQueued(_ notification: Notification) {
        guard let raw = notification.userInfo?[AVAudioSessionRouteChangeReasonKey] as? UInt,
              AVAudioSession.RouteChangeReason(rawValue: raw) == .oldDeviceUnavailable else { return }
        // Do not unexpectedly play aloud after headphones disconnect.
        routeSuspended = true
        sessionPrepared = false
        pauseMusicQueued()
    }
    private func resetAudioQueued() {
        pauseMusicQueued()
        music = nil; percussion = nil; loadedTrack = nil
        effectPool.removeAll(); sessionPrepared = false
        prepareEffects()
        audioInterrupted = false
        resumeMusicQueued()
    }
    private func resumeMusicQueued() {
        guard musicEnabled, !audioInterrupted, !routeSuspended, appActive else { pauseMusicQueued(); return }
        do {
            try prepareSession()
            let track = musicContext == "city" ? "kingdom" : musicContext
            if music == nil || loadedTrack != track {
                guard let url = Bundle.main.url(forResource: track, withExtension: "m4a", subdirectory: "Web/audio") else { return }
                let next = try AVAudioPlayer(contentsOf: url)
                next.numberOfLoops = musicContext == "victory" ? 0 : -1
                next.delegate = self
                next.volume = 0
                next.prepareToPlay()
                if let old = music {
                    old.setVolume(0, fadeDuration: 0.7)
                    retiringMusic.append(old)
                    queue.asyncAfter(deadline: .now() + 0.75) { [weak self, weak old] in
                        old?.stop()
                        self?.retiringMusic.removeAll { $0 === old }
                    }
                }
                if let layer = percussion {
                    layer.setVolume(0, fadeDuration: 0.7)
                    retiringMusic.append(layer)
                    queue.asyncAfter(deadline: .now() + 0.75) { [weak self, weak layer] in layer?.stop(); self?.retiringMusic.removeAll { $0 === layer } }
                    percussion = nil
                }
                if musicContext == "battle", let layerURL = Bundle.main.url(forResource: "battle-pulse", withExtension: "m4a", subdirectory: "Web/audio"), let layer = try? AVAudioPlayer(contentsOf: layerURL) {
                    layer.numberOfLoops = -1; layer.volume = 0; layer.prepareToPlay(); percussion = layer
                }
                music = next
                loadedTrack = track
                NSLog("Stonewake music context: %@", musicContext)
            }
            if let music, !music.isPlaying {
                let start = music.deviceCurrentTime + 0.06
                percussion?.currentTime = music.currentTime
                music.play(atTime: start); percussion?.play(atTime: start)
            }
            updateMusicVolume(fade: 0.9)
            updatePercussion()
        } catch { NSLog("Stonewake music failed: %@", error.localizedDescription) }
    }

    private let effects: Set<String> = ["click", "hit", "cannon", "build", "recruit", "march", "defeat", "rally", "win", "achievement", "complete", "reward", "naval-fire", "naval-impact", "building-destroy", "wood-break", "water-splash"]

    func updateQueued(enabled: Bool, volume: Double) {
        guard volume.isFinite else { return }
        soundEnabled = enabled
        level = Float(max(0, min(1, volume)))
        resumeMusicQueued()
        if !enabled {
            players.forEach { $0.stop() }
            players.removeAll()
        } else {
            players.forEach { $0.volume = Float(max(0, min(1, volume))) }
        }
    }

    func playQueued(_ effect: String, volume: Double) {
        guard soundEnabled, !audioInterrupted, !routeSuspended, appActive, volume.isFinite, volume > 0 else { return }
        let name = effects.contains(effect) ? effect : "reward"
        let now = CACurrentMediaTime()
        let spacing: TimeInterval = ["hit", "march", "naval-fire", "naval-impact", "wood-break"].contains(name) ? 0.13 : 0.045
        if now - (lastEffects[name] ?? -10) < spacing { return }
        lastEffects[name] = now
        if ["cannon", "naval-impact", "building-destroy", "win", "achievement"].contains(name) {
            effectDuck = 0.62
            updateMusicVolume(fade: 0.06)
            duckRecovery?.cancel()
            let recovery = DispatchWorkItem { [weak self] in
                self?.effectDuck = 1; self?.updateMusicVolume(fade: 0.45); self?.updatePercussion()
            }
            duckRecovery = recovery
            queue.asyncAfter(deadline: .now() + 0.38, execute: recovery)
        }
        guard let url = Bundle.main.url(forResource: name, withExtension: "wav", subdirectory: "Web/audio") else { return }
        do {
            try prepareSession()
            players.removeAll { !$0.isPlaying }
            if players.count >= (reducedEffects ? 4 : 10) { players.removeFirst().stop() }
            let pool = effectPool[name] ?? []
            let player: AVAudioPlayer
            if let ready = pool.first(where: { !$0.isPlaying }) { player = ready }
            else if let reusable = pool.first { reusable.stop(); player = reusable }
            else {
                player = try AVAudioPlayer(contentsOf: url)
                player.prepareToPlay(); effectPool[name] = [player]
            }
            players.removeAll { $0 === player }
            player.currentTime = 0
            player.volume = Float(max(0, min(1, volume))) * (reducedEffects ? 0.7 : 1)
            player.enableRate = true
            player.rate = 1
            if ["hit", "march", "wood-break", "naval-impact"].contains(name) { player.rate = Float.random(in: 0.94...1.06) }
            player.delegate = self
            players.append(player)
            if !player.play() { NSLog("Stonewake sound failed to start: %@", name) }
        } catch {
            NSLog("Stonewake sound playback failed: %@", error.localizedDescription)
        }
    }

    func audioPlayerDidFinishPlayingQueued(_ player: AVAudioPlayer, successfully flag: Bool) {
        // A pooled voice may already have been reused before its callback arrived.
        guard !player.isPlaying else { return }
        if player === music && musicContext == "victory" { musicContext = "city"; resumeMusicQueued() }
        players.removeAll { $0 === player }
    }
}

// Optional on-device narration only starts after an explicit Listen message.
// Available built-in voices are selected without downloading voice assets.
final class GameNarration: NSObject, AVSpeechSynthesizerDelegate {
    var onState: (([String: Any]) -> Void)?
    private weak var audio: GameAudio?
    private let synthesizer = AVSpeechSynthesizer()
    private var current: AVSpeechUtterance?
    private var currentID: String?
    private var enabled = true
    private var volume: Float = 0.55

    init(audio: GameAudio) {
        self.audio = audio
        super.init()
        synthesizer.delegate = self
        synthesizer.usesApplicationAudioSession = true
        NotificationCenter.default.addObserver(self, selector: #selector(backgroundStop), name: UIApplication.willResignActiveNotification, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(interrupted(_:)), name: AVAudioSession.interruptionNotification, object: nil)
    }
    deinit { NotificationCenter.default.removeObserver(self) }

    func update(enabled: Bool, volume: Double) {
        guard volume.isFinite else { return }
        let nextVolume = Float(max(0, min(1, volume)))
        let changed = self.enabled != enabled || abs(self.volume - nextVolume) > 0.001
        self.enabled = enabled; self.volume = nextVolume
        if !enabled || volume <= 0 { stop() }
        else if changed && current != nil { stop() } // Apply a changed level on the next explicit Listen tap.
    }
    func speak(_ text: String, speaker: String?, eventID: String?) {
        stop()
        let text = String(text.prefix(3000)).trimmingCharacters(in: .whitespacesAndNewlines)
        let voices = AVSpeechSynthesisVoice.speechVoices().filter { $0.language == "en-US" && $0.identifier.hasPrefix("com.apple.") }
        guard enabled, volume > 0, !text.isEmpty, UIApplication.shared.applicationState == .active,
              let voice = voices.first(where: { $0.quality == .default }) ?? voices.first else {
            notify("unavailable", id: eventID); return
        }
        do {
            let session = AVAudioSession.sharedInstance()
            try session.setCategory(.playback, mode: .default, options: [.mixWithOthers])
            try session.setActive(true)
        } catch { notify("unavailable", id: eventID); return }
        let utterance = AVSpeechUtterance(string: text)
        utterance.voice = voice; utterance.volume = volume; utterance.rate = AVSpeechUtteranceDefaultSpeechRate * 0.93
        utterance.pitchMultiplier = speaker == "Bram Flint" ? 0.94 : speaker == "Elowen Vale" ? 1.03 : 1
        current = utterance; currentID = eventID.map { String($0.prefix(120)) }
        audio?.setNarrationActive(true)
        synthesizer.speak(utterance)
        // No speech is resumed after interruption; another Listen tap is required.
        DispatchQueue.main.asyncAfter(deadline: .now() + 6) { [weak self, weak utterance] in
            guard let self, let utterance, self.current === utterance, !self.synthesizer.isSpeaking else { return }
            let id = self.currentID; self.stop(); self.notify("unavailable", id: id)
        }
    }
    func stop() {
        let id = currentID, hadSpeech = current != nil
        current = nil; currentID = nil
        synthesizer.stopSpeaking(at: .immediate)
        audio?.setNarrationActive(false)
        if hadSpeech { notify("stopped", id: id) }
    }
    @objc private func backgroundStop() { stop() }
    @objc private func interrupted(_ notification: Notification) {
        guard let value = notification.userInfo?[AVAudioSessionInterruptionTypeKey] as? UInt,
              AVAudioSession.InterruptionType(rawValue: value) == .began else { return }
        stop()
    }
    private func notify(_ status: String, id: String?) {
        var detail: [String: Any] = ["status": status]
        if let id { detail["eventId"] = id }
        onState?(detail)
    }
    func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didStart utterance: AVSpeechUtterance) {
        DispatchQueue.main.async { [weak self] in
            guard let self, self.current === utterance else { return }
            self.notify("speaking", id: self.currentID)
        }
    }
    func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didFinish utterance: AVSpeechUtterance) {
        DispatchQueue.main.async { [weak self] in self?.complete(utterance, status: "finished") }
    }
    func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didCancel utterance: AVSpeechUtterance) {
        DispatchQueue.main.async { [weak self] in self?.complete(utterance, status: "stopped") }
    }
    private func complete(_ utterance: AVSpeechUtterance, status: String) {
        guard current === utterance else { return }
        let id = currentID; current = nil; currentID = nil
        audio?.setNarrationActive(false); notify(status, id: id)
    }
}
