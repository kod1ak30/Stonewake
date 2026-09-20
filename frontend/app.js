import { Qa, F } from "./vendor/runtime.js";
import { Ju } from "../client/build14/Ju.js";
import { startNativeTouchActivation } from "./runtime/touch-activation.js";
// Native finger input has a single, validated button activation path.
// Browser mouse and keyboard input keep their normal click behavior.
if (window.__STONEWAKE_NATIVE__) {
  const stopTouchActivation = startNativeTouchActivation();
  window.addEventListener("pagehide", stopTouchActivation, {once: true});
}
Qa.createRoot(document.getElementById("root")).render(F.jsx(Ju, {deviceOnly:true}));
