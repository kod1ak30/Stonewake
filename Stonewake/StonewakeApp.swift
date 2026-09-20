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
    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.websiteDataStore = .default()
        configuration.setURLSchemeHandler(context.coordinator, forURLScheme: "stonewake")
        configuration.userContentController.add(context.coordinator, name: "stonewake")
        configuration.allowsInlineMediaPlayback = true
        configuration.mediaTypesRequiringUserActionForPlayback = [.video]
        let saved = SaveStore.load().flatMap { String(data: $0, encoding: .utf8) } ?? "null"
        let seen = UserDefaults.standard.bool(forKey: "openingSeen") ? "true" : "false"
        // JSON is parsed as data, never inserted as executable source.
        let encoded = Data(saved.utf8).base64EncodedString()
        let boot = "window.__STONEWAKE_SAVE__=JSON.parse(new TextDecoder().decode(Uint8Array.from(atob('\(encoded)'),c=>c.charCodeAt(0))));window.__STONEWAKE_INTRO_SEEN__=\(seen);"
        configuration.userContentController.addUserScript(WKUserScript(source: boot, injectionTime: .atDocumentStart, forMainFrameOnly: true))
        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.isOpaque = false
        webView.backgroundColor = UIColor(red: 23/255, green: 34/255, blue: 55/255, alpha: 1)
        webView.scrollView.isScrollEnabled = false
        webView.scrollView.bounces = false
        // The game camera owns zoom. Disable page-level pinch resizing in WebKit.
        webView.scrollView.bouncesZoom = false
        webView.scrollView.minimumZoomScale = 1
        webView.scrollView.maximumZoomScale = 1
        webView.scrollView.pinchGestureRecognizer?.isEnabled = false
        webView.navigationDelegate = context.coordinator
        context.coordinator.webView = webView
        context.coordinator.online.webView = webView
        webView.load(URLRequest(url: URL(string: "stonewake://app/index.html")!))
        return webView
    }
    func updateUIView(_ uiView: WKWebView, context: Context) {}
    static func dismantleUIView(_ uiView: WKWebView, coordinator: Coordinator) {
        uiView.configuration.userContentController.removeScriptMessageHandler(forName: "stonewake")
        uiView.navigationDelegate = nil
        coordinator.narration.stop()
    }
    final class Coordinator: NSObject, WKNavigationDelegate, WKURLSchemeHandler, WKScriptMessageHandler {
        weak var webView: WKWebView?
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
            if kind == "online", let id = body["id"] as? String, let method = body["method"] as? String {
                online.handle(id: id, method: method, payload: body["payload"] as? [String: Any] ?? [:]); return
            }
            if kind == "runtimeStatus", let engine = body["engine"] as? String, ["worker", "fallback"].contains(engine) {
                NSLog("Stonewake simulation engine: %@", engine)
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
            let saved: Bool
            do { try SaveStore.write(data); saved = true } catch { saved = false }
            webView?.evaluateJavaScript("window.dispatchEvent(new CustomEvent('stonewake-save-status',{detail:{saved:\(saved ? "true" : "false")}}));", completionHandler: nil)
        }
        func webView(_ webView: WKWebView, start urlSchemeTask: WKURLSchemeTask) {
            guard let url = urlSchemeTask.request.url, url.host == "app",
                  let root = Bundle.main.url(forResource: "Web", withExtension: nil) else {
                urlSchemeTask.didFailWithError(URLError(.fileDoesNotExist)); return
            }
            let path = url.path == "/" ? "index.html" : String(url.path.dropFirst())
            let file = root.appendingPathComponent(path).standardizedFileURL
            guard file.path.hasPrefix(root.standardizedFileURL.path + "/"), let data = try? Data(contentsOf: file) else {
                urlSchemeTask.didFailWithError(URLError(.fileDoesNotExist)); return
            }
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
            urlSchemeTask.didReceive(URLResponse(url: url, mimeType: mime, expectedContentLength: data.count, textEncodingName: mime.hasPrefix("text/") ? "utf-8" : nil))
            urlSchemeTask.didReceive(data)
            urlSchemeTask.didFinish()
        }
        func webView(_ webView: WKWebView, stop urlSchemeTask: WKURLSchemeTask) {}
        func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
            guard let url = navigationAction.request.url else { decisionHandler(.cancel); return }
            if url.scheme == "stonewake" && url.host == "app" { decisionHandler(.allow) }
            else { decisionHandler(.cancel) }
        }
        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            webView.scrollView.pinchGestureRecognizer?.isEnabled = false
            webView.scrollView.setZoomScale(1, animated: false)
        }
        func webViewWebContentProcessDidTerminate(_ webView: WKWebView) {
            // Recreate the document with the most recent acknowledged native save.
            let data = SaveStore.load() ?? Data("null".utf8)
            let encoded = data.base64EncodedString()
            let seen = UserDefaults.standard.bool(forKey: "openingSeen") ? "true" : "false"
            let boot = "window.__STONEWAKE_SAVE__=JSON.parse(new TextDecoder().decode(Uint8Array.from(atob('\(encoded)'),c=>c.charCodeAt(0))));window.__STONEWAKE_INTRO_SEEN__=\(seen);"
            webView.configuration.userContentController.addUserScript(WKUserScript(source: boot, injectionTime: .atDocumentStart, forMainFrameOnly: true))
            webView.reload()
        }
    }
}

enum SaveStore {
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
        for file in [primary, backup] { if let data = try? Data(contentsOf: file), valid(data) { return data } }
        return nil
    }
    static func write(_ data: Data) throws {
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
final class GameAudio: NSObject, AVAudioPlayerDelegate {
    private var players: [AVAudioPlayer] = []
    private var music: AVAudioPlayer?
    private var percussion: AVAudioPlayer?
    private var intensity: Float = 0.4
    private var reducedEffects = false
    private var narrationActive = false
    private var retiringMusic: [AVAudioPlayer] = []
    private var musicContext = "city"
    private var loadedTrack: String?
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
        NotificationCenter.default.addObserver(self, selector: #selector(pauseMusic), name: UIApplication.willResignActiveNotification, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(resumeMusic), name: UIApplication.didBecomeActiveNotification, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(interrupted(_:)), name: AVAudioSession.interruptionNotification, object: nil)
    }

    deinit { NotificationCenter.default.removeObserver(self) }

    func setMusic(enabled: Bool, volume: Double, battleVolume: Double = 0.14) {
        guard volume.isFinite else { return }
        musicLevel = Float(max(0, min(1, volume)))
        if battleVolume.isFinite { battleMusicLevel = Float(max(0, min(1, battleVolume))) }
        musicEnabled = enabled
        resumeMusic()
    }

    func setMusicContext(_ context: String, intensity: Double) {
        let context = context == "calm" ? "city" : context
        guard ["city", "scout", "battle", "victory"].contains(context), intensity.isFinite else { return }
        self.intensity = Float(max(0, min(1, intensity)))
        if context == musicContext { updatePercussion(); return }
        musicContext = context
        resumeMusic()
    }

    func setReducedEffects(_ reduced: Bool) { reducedEffects = reduced; updatePercussion() }

    func setNarrationActive(_ active: Bool) {
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

    @objc private func pauseMusic() {
        music?.pause()
        percussion?.pause()
        retiringMusic.forEach { $0.stop() }
        retiringMusic.removeAll()
    }

    @objc private func interrupted(_ notification: Notification) {
        guard let raw = notification.userInfo?[AVAudioSessionInterruptionTypeKey] as? UInt,
              let type = AVAudioSession.InterruptionType(rawValue: raw) else { return }
        if type == .began { pauseMusic() }
        else if let options = notification.userInfo?[AVAudioSessionInterruptionOptionKey] as? UInt,
                AVAudioSession.InterruptionOptions(rawValue: options).contains(.shouldResume) { resumeMusic() }
    }

    @objc private func resumeMusic() {
        guard musicEnabled, UIApplication.shared.applicationState == .active else { pauseMusic(); return }
        do {
            let session = AVAudioSession.sharedInstance()
            try session.setCategory(.playback, mode: .default, options: [.mixWithOthers])
            try session.setActive(true)
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
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.75) { [weak self, weak old] in
                        old?.stop()
                        self?.retiringMusic.removeAll { $0 === old }
                    }
                }
                if let layer = percussion {
                    layer.setVolume(0, fadeDuration: 0.7)
                    retiringMusic.append(layer)
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.75) { [weak self, weak layer] in layer?.stop(); self?.retiringMusic.removeAll { $0 === layer } }
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

    func update(enabled: Bool, volume: Double) {
        guard volume.isFinite else { return }
        soundEnabled = enabled
        level = Float(max(0, min(1, volume)))
        resumeMusic()
        if !enabled {
            players.forEach { $0.stop() }
            players.removeAll()
        } else {
            players.forEach { $0.volume = Float(max(0, min(1, volume))) }
        }
    }

    func play(_ effect: String, volume: Double) {
        guard soundEnabled, volume.isFinite, volume > 0 else { return }
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
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.38, execute: recovery)
        }
        guard let url = Bundle.main.url(forResource: name, withExtension: "wav", subdirectory: "Web/audio") else { return }
        do {
            let session = AVAudioSession.sharedInstance()
            try session.setCategory(.playback, mode: .default, options: [.mixWithOthers])
            try session.setActive(true)
            players.removeAll { !$0.isPlaying }
            if players.count >= (reducedEffects ? 4 : 10) { players.removeFirst().stop() }
            let player = try AVAudioPlayer(contentsOf: url)
            player.volume = Float(max(0, min(1, volume))) * (reducedEffects ? 0.7 : 1)
            player.enableRate = true
            if ["hit", "march", "wood-break", "naval-impact"].contains(name) { player.rate = Float.random(in: 0.94...1.06) }
            player.delegate = self
            players.append(player)
            if !player.play() { NSLog("Stonewake sound failed to start: %@", name) }
        } catch {
            NSLog("Stonewake sound playback failed: %@", error.localizedDescription)
        }
    }

    func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool) {
        if player === music && musicContext == "victory" { musicContext = "city"; resumeMusic() }
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
