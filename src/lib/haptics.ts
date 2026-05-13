import { WebHaptics } from "web-haptics";

const haptics = new WebHaptics();

/** Stop any in-flight haptic pattern (e.g. user lifted finger before hold completed). */
export function cancelHaptic(): void {
  try {
    haptics.cancel();
  } catch {
    /* ignore */
  }
}

/** Short pulse when video hold-to-scrub preview engages ([WebHaptics](https://haptics.lochie.me/)). */
export function triggerHoldPreviewHaptic(): void {
  try {
    void haptics.trigger([{ duration: 8 }], { intensity: 0.3 });
  } catch {
    /* ignore */
  }
}
