import { WebHaptics } from "web-haptics";

/** Audio + simulated ticks when `navigator.vibrate` is missing (iOS Safari, most desktop browsers). */
const haptics = new WebHaptics({ debug: !WebHaptics.isSupported });

let audioCtx: AudioContext | null = null;
let pendingSeekHaptic: ReturnType<typeof setTimeout> | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    if (!audioCtx) audioCtx = new AC();
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Resume audio from a pointer/tap gesture so a delayed soft tick can play (iOS / desktop).
 * Call synchronously from `pointerdown` / `touchstart`.
 */
export function primeHapticFromUserGesture(): void {
  if (WebHaptics.isSupported) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    if (ctx.state === "suspended") void ctx.resume();
  } catch {
    /* ignore */
  }
}

function playOscillatorTick(): void {
  const ctx = getAudioContext();
  if (!ctx || ctx.state !== "running") return;
  try {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    g.gain.value = 0.04;
    o.type = "sine";
    o.frequency.setValueAtTime(260, ctx.currentTime);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.012);
  } catch {
    /* ignore */
  }
}

/** Stop seek haptic timer, WebHaptics pattern, and native vibrate. */
export function cancelHaptic(): void {
  if (pendingSeekHaptic != null) {
    clearTimeout(pendingSeekHaptic);
    pendingSeekHaptic = null;
  }
  try {
    haptics.cancel();
  } catch {
    /* ignore */
  }
  try {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      void navigator.vibrate(0);
    }
  } catch {
    /* ignore */
  }
}

/**
 * Subtle feedback when hold-to-seek engages (~after `holdDelayMs`).
 * - **Android (Vibration API):** single pulse scheduled in the same gesture via `vibrate` pattern.
 * - **iOS / desktop:** [WebHaptics](https://haptics.lochie.me/) `selection` preset (soft audio + tick) after delay, with audio primed from `primeHapticFromUserGesture()` on pointer down.
 */
export function armHoldSeekFeedback(holdDelayMs: number): void {
  if (pendingSeekHaptic != null) {
    clearTimeout(pendingSeekHaptic);
    pendingSeekHaptic = null;
  }

  if (WebHaptics.isSupported) {
    const lead = 1;
    const pause = Math.max(0, Math.round(holdDelayMs) - lead);
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      void navigator.vibrate([lead, pause, 16]);
    }
    return;
  }

  pendingSeekHaptic = setTimeout(() => {
    pendingSeekHaptic = null;
    try {
      void haptics.trigger("selection");
    } catch {
      playOscillatorTick();
    }
  }, Math.max(0, Math.round(holdDelayMs)));
}
