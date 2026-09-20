#!/usr/bin/env python3
"""Compile the production Swift save and notification validators into isolated tests.
No simulator or phone data is read. The production save directory is substituted
with a disposable temporary directory before compilation.
"""
from pathlib import Path
import json, plistlib, subprocess, tempfile
ROOT = Path(__file__).resolve().parents[1]
app = (ROOT / 'Stonewake/StonewakeApp.swift').read_text()
native = (ROOT / 'Stonewake/StonewakeNative15.swift').read_text()
info = plistlib.loads((ROOT / 'Stonewake/Info.plist').read_bytes())
assert info['CFBundleVersion'] == '18'
assert set(info['UISupportedInterfaceOrientations']) == {'UIInterfaceOrientationLandscapeLeft','UIInterfaceOrientationLandscapeRight'}
assert info['StonewakeServiceURL'] == ''
assert info['UILaunchStoryboardName'] == 'LaunchScreen'
assert '.ignoresSafeArea(.all)' in app
assert 'removeAllUserScripts()' in app
assert 'recoveryDates.count <= 2' in app
assert 'maxConcurrentOperationCount = 2' in native
assert 'read(upToCount: 64 * 1024)' in native
assert 'guard payload["userInitiated"] as? Bool == true' in native
assert 'appActive, volume.isFinite' in app
assert 'com.chrismozer.stonewake.audio' in app
assert 'SaveStore.writeAsync(data)' in app
assert 'webView.scrollView.contentInsetAdjustmentBehavior = .never' in app

def block(source, marker):
    start = source.index(marker)
    pos = source.index('{', start)
    count = 1
    end = pos + 1
    while count:
        if source[end] == '{': count += 1
        elif source[end] == '}': count -= 1
        end += 1
    return source[start:end]

save = block(app, 'enum SaveStore {')
projects = block(native, 'static func validProjects(')
diagnostics = block(native, '@MainActor final class StonewakeDiagnostics15 {').replace('UserDefaults.standard','Native15TestDefaults').replace('UIDevice.current','NativeDeviceStub.current')
with tempfile.TemporaryDirectory(prefix='stonewake-native15-') as folder:
    tmp = Path(folder)
    original = 'FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0].appendingPathComponent("Stonewake", isDirectory: true)'
    assert original in save
    save = save.replace(original, 'URL(fileURLWithPath: '+json.dumps(str(tmp/'save'))+', isDirectory: true)')
    harness = r'''
var count = 0
func check(_ condition: @autoclosure () -> Bool, _ name: String) {
    guard condition() else { fatalError("FAIL: " + name) }
    count += 1
}
func state(_ revision: Int) throws -> Data {
    try JSONSerialization.data(withJSONObject: ["state": ["schema":1,"revision":revision,"buildings":[["id":"keep","level":7]]],"reports":[],"battle":NSNull()])
}
let first = try state(1), second = try state(2)
check(SaveStore.valid(first), "valid save accepted")
check(!SaveStore.valid(Data("{}".utf8)), "empty object rejected")
check(!SaveStore.valid(Data("not json".utf8)), "malformed JSON rejected")
check(!SaveStore.valid(Data(repeating: 1, count: 8_000_000)), "oversized save rejected")
let empty = try JSONSerialization.data(withJSONObject:["state":["schema":1,"revision":1,"buildings":[]]])
check(!SaveStore.valid(empty), "empty kingdom rejected")
try SaveStore.write(first)
check(SaveStore.load() == first, "first save round trip")
try SaveStore.write(second)
check(SaveStore.load() == second, "new save round trip")
check(try Data(contentsOf: SaveStore.backup) == first, "last acknowledged save backed up")
do { try SaveStore.write(Data("bad".utf8)); fatalError("invalid save write succeeded") } catch {}
check(SaveStore.load() == second, "invalid save leaves primary unchanged")
try Data("corrupt".utf8).write(to: SaveStore.primary)
check(SaveStore.load() == first, "corrupt primary falls back to valid backup")

let asyncGroup = DispatchGroup()
let queuedPayloads = try (3...12).map { try state($0) }
for payload in queuedPayloads {
    asyncGroup.enter()
    SaveStore.writeAsync(payload) { success in
        precondition(success, "valid async write must succeed")
        precondition(!Thread.isMainThread, "disk completion must not run on the input thread")
        asyncGroup.leave()
    }
}
check(asyncGroup.wait(timeout: .now() + 5) == .success, "queued saves finish within a bounded wait")
let finalAsync = queuedPayloads[9], previousAsync = queuedPayloads[8]
check(SaveStore.load() == finalAsync, "serial writer preserves newest queued revision")
let asyncBackup = try Data(contentsOf: SaveStore.backup)
check(asyncBackup == previousAsync, "serial backup preserves previous queued revision")
let rejectedAsync = DispatchSemaphore(value: 0)
SaveStore.writeAsync(Data("invalid".utf8)) { success in precondition(!success); rejectedAsync.signal() }
check(rejectedAsync.wait(timeout: .now() + 5) == .success, "invalid async write acknowledges failure")
check(SaveStore.load() == finalAsync, "invalid async save cannot overwrite latest valid save")

let now = 1_000_000.0
func project(_ id: String = "building:keep", _ time: Double = 1_010_000, _ title: String = "Keep upgrade") -> [String:Any] { ["id":id,"title":title,"readyAt":time] }
check(Policy.validProjects([project()],now:now).count == 1, "future completion accepted")
check(Policy.validProjects([project("../../escape")],now:now).isEmpty, "unsafe identifier rejected")
check(Policy.validProjects([project("x",now-1)],now:now).isEmpty, "completed project rejected")
check(Policy.validProjects([project("x",now+1000)],now:now).isEmpty, "immediate stale completion rejected")
check(Policy.validProjects([project("x",Double.infinity)],now:now).isEmpty, "infinite date rejected")
check(Policy.validProjects([project("x",Double.nan)],now:now).isEmpty, "NaN date rejected")
check(Policy.validProjects([project("x",now+31*86400000)],now:now).isEmpty, "beyond 30 days rejected")
check(Policy.validProjects([project("x",now+2000,"  ")],now:now).isEmpty, "empty title rejected")
check(Policy.validProjects([project(),project()],now:now).count == 1, "duplicate project deduplicated")
check(Policy.validProjects([project(String(repeating:"x",count:81))],now:now).isEmpty, "long ID rejected")
let title = Policy.validProjects([project("x",now+2000,String(repeating:"x",count:90))],now:now)[0]["title"] as! String
check(title.count == 80, "title bounded")
let safe = Policy.validProjects([project("x",now+2000,"Keep\nupgrade")],now:now)[0]["title"] as! String
check(!safe.contains("\n"), "notification control characters removed")
let many = (0..<30).map { project("p\($0)",now+Double(40000-$0*1000)) }
let ordered = Policy.validProjects(many,now:now)
check(ordered.count == 20, "pending projects capped at 20")
check((ordered.first?["readyAt"] as? Double) == now+11000, "soonest projects first")
try MainActor.assumeIsolated {
    let log = StonewakeDiagnostics15()
    log.clear()
    log.record("session_start", metrics:["fps":60,"account_id":123])
    check(log.events.count == 1, "native event recorded")
    check((log.events[0]["metrics"] as? [String:Double])?["account_id"] == nil, "native private metric excluded")
    log.enabled = false
    log.record("runtime_error")
    check(log.events.count == 1, "native disabled logging adds no events")
    log.flush()
    let restored = StonewakeDiagnostics15()
    check(!restored.enabled, "native opt-out persists across reload")
    restored.clear()
    check(restored.events.isEmpty, "clear empties native event ring")
    let cleared = try Data(contentsOf: SaveStore.directory.appendingPathComponent("native-diagnostics15.json"))
    check((try JSONSerialization.jsonObject(with: cleared) as? [[String:Any]])?.isEmpty == true, "clear persists an empty native ring")
    restored.enabled = true
    restored.record("frame_sample", metrics:["fps":60])
    check(restored.events.count == 1, "native logging resumes only when enabled")
}
Native15TestDefaults.removePersistentDomain(forName: Native15TestDomain)
print("Native15: \(count) Swift checks passed; orientation, recovery, explicit consent and asset bounds validated.")
'''
    # Swift check autoclosures cannot throw; materialize the only throwing comparison.
    harness = harness.replace('check(try Data(contentsOf: SaveStore.backup) == first,', 'let backedUp = try Data(contentsOf: SaveStore.backup)\ncheck(backedUp == first,')
    harness = harness.replace('check((try JSONSerialization.jsonObject(with: cleared) as? [[String:Any]])?.isEmpty == true,', 'let clearedEvents = try JSONSerialization.jsonObject(with: cleared) as? [[String:Any]]\n    check(clearedEvents?.isEmpty == true,')
    support = 'let Native15TestDomain = "stonewake-native15.tests." + UUID().uuidString\nlet Native15TestDefaults = UserDefaults(suiteName: Native15TestDomain)!\nenum NativeIdiom { case phone }\nstruct NativeDeviceStub { static let current = NativeDeviceStub(); let systemVersion = "test"; let userInterfaceIdiom = NativeIdiom.phone }\n'
    source = 'import Foundation\n'+save+'\n'+support+diagnostics+'\nenum Policy {\n'+projects+'\n}\n'+harness
    (tmp/'main.swift').write_text(source)
    subprocess.run(['/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/swiftc','-target','arm64-apple-macosx14.0','-sdk','/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX.sdk',str(tmp/'main.swift'),'-o',str(tmp/'check')],check=True)
    subprocess.run([str(tmp/'check')],check=True)
