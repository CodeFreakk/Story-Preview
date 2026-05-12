/**
 * Sample a video URL into evenly spaced JPEG stills (object-cover into outW×outH).
 * Used for story scrub preview “filmstrip” frames.
 */
export async function extractVideoPreviewFrames(
  src: string,
  frameCount: number,
  outWidth: number,
  outHeight: number,
  jpegQuality: number,
  /** Called after each captured frame so the UI can show a strip preview before the full filmstrip is ready. */
  onPartial?: (framesSoFar: string[]) => void,
): Promise<string[]> {
  const v = document.createElement("video");
  v.muted = true;
  v.playsInline = true;
  v.preload = "auto";
  v.src = src;

  await new Promise<void>((resolve, reject) => {
    if (v.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      resolve();
      return;
    }
    const onData = () => {
      v.removeEventListener("loadeddata", onData);
      resolve();
    };
    v.addEventListener("loadeddata", onData);
    v.addEventListener(
      "error",
      () => {
        v.removeEventListener("loadeddata", onData);
        reject(new Error("video load failed"));
      },
      { once: true },
    );
  });

  const dur = v.duration;
  const vw = v.videoWidth;
  const vh = v.videoHeight;
  if (!Number.isFinite(dur) || dur <= 0 || vw === 0 || vh === 0) {
    v.removeAttribute("src");
    v.load();
    return [];
  }

  const canvas = document.createElement("canvas");
  canvas.width = outWidth;
  canvas.height = outHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    v.removeAttribute("src");
    v.load();
    return [];
  }

  const er = outWidth / outHeight;
  const vr = vw / vh;
  let sx = 0;
  let sy = 0;
  let sw = vw;
  let sh = vh;
  if (vr > er) {
    sw = Math.round(vh * er);
    sx = Math.round((vw - sw) / 2);
    sh = vh;
  } else {
    sh = Math.round(vw / er);
    sy = Math.round((vh - sh) / 2);
    sw = vw;
  }

  const frames: string[] = [];
  const n = Math.max(2, frameCount);

  const seekTo = (t: number) =>
    new Promise<void>((resolveSeek) => {
      const target = Math.min(dur - 1e-3, Math.max(0, t));
      if (Math.abs(v.currentTime - target) < 0.02) {
        resolveSeek();
        return;
      }
      const onSeeked = () => {
        v.removeEventListener("seeked", onSeeked);
        resolveSeek();
      };
      v.addEventListener("seeked", onSeeked);
      v.currentTime = target;
    });

  for (let fi = 0; fi < n; fi++) {
    const t = n === 1 ? 0 : (dur * fi) / (n - 1);
    await seekTo(t);

    ctx.clearRect(0, 0, outWidth, outHeight);
    ctx.drawImage(v, sx, sy, sw, sh, 0, 0, outWidth, outHeight);
    frames.push(canvas.toDataURL("image/jpeg", jpegQuality));
    onPartial?.(frames.slice());
  }

  v.removeAttribute("src");
  v.load();
  return frames;
}
