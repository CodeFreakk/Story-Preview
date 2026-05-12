import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useNavigate, useParams } from "react-router";
import InstagramStory, {
  STORY_VIDEO_PREVIEW_FRAME_HEIGHT_PX,
  STORY_VIDEO_PREVIEW_FRAME_WIDTH_PX,
  type StoryMediaSlide,
  type StoryTooltipState,
} from "../imports/InstagramStory/InstagramStory";
import { extractVideoPreviewFrames } from "../lib/extractVideoPreviewFrames";

const STORY_DISPLAY: Record<string, string> = {
  colegreen: "colegreen",
  rodek: "rodek",
  macronbi: "macronbi",
  selena: "selena",
};

const STORY_AVATAR: Record<string, string> = {
  colegreen: "/images/colegreen.png",
  rodek: "/images/rodek.png",
  macronbi: "/images/macronbi.png",
  selena: "/images/selena.png",
};

/** Per-user story slides: profile shot then post (same pattern as Instagram photo stories). */
const STORY_SLIDES: Record<string, StoryMediaSlide[]> = {
  colegreen: [
    { type: "image", src: "/images/colegreen.png" },
    { type: "image", src: "/images/tokyoPost.png" },
  ],
  rodek: [
    { type: "video", src: "/videos/rodek_story_video1.mp4" },
    { type: "image", src: "/images/rodek_story_image2.jpg" },
  ],
  macronbi: [
    { type: "image", src: "/images/macronbi.png" },
    { type: "image", src: "/images/tokyoPost.png" },
  ],
  selena: [
    { type: "image", src: "/images/selena.png" },
    { type: "image", src: "/images/tokyoPost.png" },
  ],
};

const SLIDE_DURATION_MS = 5000;
/** Video-only: show preview chip after holding this long (ms). */
const VIDEO_HOLD_PREVIEW_MS = 120;
/** Treat release as a tap (vs hold-to-pause) if short and barely moved. */
const TAP_MAX_DURATION_MS = 320;
const TAP_MAX_MOVE_PX = 14;

/** Number of stills sampled along each video slide for long-press / scrub preview. */
const VIDEO_PREVIEW_STRIP_LEN = 10;

/** Geometry of one timeline segment in coordinates relative to the timeline outer box (preview `left` space). */
function getTimelineSegmentBoundsOuter(
  outerEl: HTMLElement,
  innerEl: HTMLElement,
  segmentIndex: number,
  segmentCount: number,
): { left: number; right: number } {
  const outerRect = outerEl.getBoundingClientRect();
  const innerRect = innerEl.getBoundingClientRect();
  const cs = getComputedStyle(innerEl);
  const pl = parseFloat(cs.paddingLeft) || 0;
  const pr = parseFloat(cs.paddingRight) || 0;
  const gap =
    parseFloat(cs.columnGap) || parseFloat(cs.gap) || 0;
  const innerClientW = innerEl.clientWidth;
  const contentW = Math.max(0, innerClientW - pl - pr);
  const n = Math.max(1, segmentCount);
  const gapsTotal = Math.max(0, n - 1) * gap;
  const segW = (contentW - gapsTotal) / n;
  const i = Math.max(0, Math.min(n - 1, segmentIndex));
  const innerLeftInOuter = innerRect.left - outerRect.left;
  const left = innerLeftInOuter + pl + i * (segW + gap);
  const right = left + segW;
  return { left, right };
}

/** Clamp a horizontal center (outer-relative) so a frame stays inside one segment. */
function clampPreviewCenterToSegment(
  centerOuter: number,
  outerEl: HTMLElement,
  innerEl: HTMLElement,
  segmentIndex: number,
  segmentCount: number,
  frameWidthPx: number,
): number {
  const { left, right } = getTimelineSegmentBoundsOuter(
    outerEl,
    innerEl,
    segmentIndex,
    segmentCount,
  );
  const half = frameWidthPx / 2;
  const span = right - left;
  if (span <= 0) return centerOuter;
  if (span <= frameWidthPx) {
    return (left + right) / 2;
  }
  return Math.min(right - half, Math.max(left + half, centerOuter));
}

/** Map pointer clientX to preview center, clamped to the given slide’s segment. */
function previewCenterFromClientX(
  clientX: number,
  outerEl: HTMLElement,
  innerEl: HTMLElement,
  segmentIndex: number,
  segmentCount: number,
  frameWidthPx: number,
): number {
  const outerRect = outerEl.getBoundingClientRect();
  const pointerCenterOuter = clientX - outerRect.left;
  return clampPreviewCenterToSegment(
    pointerCenterOuter,
    outerEl,
    innerEl,
    segmentIndex,
    segmentCount,
    frameWidthPx,
  );
}

/** 0–1 scrub position within one timeline segment, from viewport clientX. */
function getVideoScrubRatioFromClientX(
  clientX: number,
  outerEl: HTMLElement,
  innerEl: HTMLElement,
  segmentIndex: number,
  segmentCount: number,
): number {
  const outerRect = outerEl.getBoundingClientRect();
  const { left, right } = getTimelineSegmentBoundsOuter(
    outerEl,
    innerEl,
    segmentIndex,
    segmentCount,
  );
  const x = clientX - outerRect.left;
  const span = right - left;
  if (span <= 0) return 0;
  return Math.min(1, Math.max(0, (x - left) / span));
}

function slidesForStory(storyId: string | undefined, fallbackAvatar: string): StoryMediaSlide[] {
  if (storyId && STORY_SLIDES[storyId]) return STORY_SLIDES[storyId];
  return [
    { type: "image", src: fallbackAvatar },
    { type: "image", src: "/images/tokyoPost.png" },
  ];
}

export default function StoryScreen() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineOuterRef = useRef<HTMLDivElement>(null);
  const storyVideoRef = useRef<HTMLVideoElement | null>(null);
  const lastScrubClientXRef = useRef(0);
  const [slideIndex, setSlideIndex] = useState(0);
  const [slideProgress, setSlideProgress] = useState(0);
  const [isMediaPaused, setIsMediaPaused] = useState(false);
  const [tooltip, setTooltip] = useState<StoryTooltipState>({
    visible: false,
    centerX: 0,
    previewUrl: null,
    timeLabel: "",
  });
  const [previewFrameStrips, setPreviewFrameStrips] = useState<string[][]>([]);
  const [scrubPreviewProgress, setScrubPreviewProgress] = useState(0);

  const displayName =
    (storyId && STORY_DISPLAY[storyId]) ?? storyId ?? "Story";

  const avatarSrc =
    (storyId && STORY_AVATAR[storyId]) ?? "/images/fredrick_g.png";

  const slides = useMemo(
    () => slidesForStory(storyId, avatarSrc),
    [storyId, avatarSrc],
  );

  const slideStartRef = useRef(performance.now());
  const pausedRef = useRef(false);
  const slideProgressRef = useRef(0);
  const slideIndexRef = useRef(0);
  /** After hitting 100%, wait one painted frame before advancing so the bar visibly completes. */
  const completionHoldRef = useRef(false);
  const touchStartRef = useRef<{ t: number; x: number; y: number } | null>(null);
  const slidesLengthRef = useRef(slides.length);
  slidesLengthRef.current = slides.length;
  /** Optional per-slide duration (ms); video slides set from metadata. */
  const slideDurationMsRef = useRef<Record<number, number>>({});
  const slidesRef = useRef(slides);
  slidesRef.current = slides;
  const routeStoryIdRef = useRef(storyId);
  routeStoryIdRef.current = storyId;
  const videoHoldOriginRef = useRef<{
    routeStoryId: string | undefined;
    slideIndex: number;
  } | null>(null);
  const storyPointerDownRef = useRef(false);
  const videoPreviewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seekCenterXRef = useRef(0);

  useEffect(() => {
    slideIndexRef.current = slideIndex;
  }, [slideIndex]);

  useEffect(() => {
    slideProgressRef.current = slideProgress;
  }, [slideProgress]);

  useEffect(() => {
    let cancelled = false;
    const snapshot = slides;
    setPreviewFrameStrips(
      snapshot.map((s) => (s.type === "image" ? [s.src] : [])),
    );

    void (async () => {
      for (let i = 0; i < snapshot.length; i++) {
        if (cancelled) return;
        const s = snapshot[i];
        if (s.type !== "video") continue;
        try {
          const w = Math.round(STORY_VIDEO_PREVIEW_FRAME_WIDTH_PX * 2);
          const h = Math.round(STORY_VIDEO_PREVIEW_FRAME_HEIGHT_PX * 2);
          const frames = await extractVideoPreviewFrames(
            s.src,
            VIDEO_PREVIEW_STRIP_LEN,
            w,
            h,
            0.68,
            (partial) => {
              if (cancelled) return;
              setPreviewFrameStrips((prev) => {
                const cur = slidesRef.current[i];
                if (!cur || cur.type !== "video" || cur.src !== s.src) return prev;
                if (i >= prev.length) return prev;
                const copy = [...prev];
                copy[i] = partial.length > 0 ? partial.slice() : copy[i] ?? [];
                return copy;
              });
            },
          );
          if (cancelled) return;
          setPreviewFrameStrips((prev) => {
            const cur = slidesRef.current[i];
            if (!cur || cur.type !== "video" || cur.src !== s.src) return prev;
            if (i >= prev.length) return prev;
            const copy = [...prev];
            copy[i] = frames.length > 0 ? frames : copy[i] ?? [];
            return copy;
          });
        } catch {
          /* keep [] → canvas fallback */
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slides]);

  useEffect(() => {
    setSlideIndex(0);
    setSlideProgress(0);
    slideProgressRef.current = 0;
    setScrubPreviewProgress(0);
    slideStartRef.current = performance.now();
    pausedRef.current = false;
    completionHoldRef.current = false;
    slideDurationMsRef.current = {};
    setIsMediaPaused(false);
    if (videoPreviewTimerRef.current != null) {
      clearTimeout(videoPreviewTimerRef.current);
      videoPreviewTimerRef.current = null;
    }
    setTooltip((t) => ({ ...t, visible: false, previewUrl: null }));
    videoHoldOriginRef.current = null;
  }, [storyId]);

  useEffect(() => {
    setTooltip((t) => ({ ...t, visible: false, previewUrl: null }));
    if (videoPreviewTimerRef.current != null) {
      clearTimeout(videoPreviewTimerRef.current);
      videoPreviewTimerRef.current = null;
    }
    videoHoldOriginRef.current = null;
    setScrubPreviewProgress(slideProgressRef.current);
  }, [slideIndex]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (!pausedRef.current) {
        const i = slideIndexRef.current;
        const slideDurationMs =
          slideDurationMsRef.current[i] ?? SLIDE_DURATION_MS;
        const elapsed = performance.now() - slideStartRef.current;
        const p = Math.min(1, elapsed / slideDurationMs);

        if (p >= 1) {
          setSlideProgress(1);
          slideProgressRef.current = 1;
          setScrubPreviewProgress(1);

          if (!completionHoldRef.current) {
            completionHoldRef.current = true;
          } else {
            completionHoldRef.current = false;
            if (i + 1 >= slidesLengthRef.current) {
              navigate("/");
              return;
            }
            slideIndexRef.current = i + 1;
            setSlideIndex(i + 1);
            slideStartRef.current = performance.now();
            setSlideProgress(0);
            slideProgressRef.current = 0;
            setScrubPreviewProgress(0);
          }
        } else {
          completionHoldRef.current = false;
          setSlideProgress(p);
          slideProgressRef.current = p;
          setScrubPreviewProgress(p);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      completionHoldRef.current = false;
    };
  }, [slideIndex, slides.length, navigate]);

  const onClosePointerDown = useCallback(() => {}, []);

  const onClosePointerUp = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const resumeFromProgress = useCallback(() => {
    const idx = slideIndexRef.current;
    const dur = slideDurationMsRef.current[idx] ?? SLIDE_DURATION_MS;
    slideStartRef.current =
      performance.now() - slideProgressRef.current * dur;
    pausedRef.current = false;
    completionHoldRef.current = false;
    setIsMediaPaused(false);
  }, []);

  const goToNextSlide = useCallback(() => {
    if (videoPreviewTimerRef.current != null) {
      clearTimeout(videoPreviewTimerRef.current);
      videoPreviewTimerRef.current = null;
    }
    setTooltip((t) => ({ ...t, visible: false, previewUrl: null }));
    videoHoldOriginRef.current = null;
    const i = slideIndexRef.current;
    const len = slidesLengthRef.current;
    if (i + 1 >= len) {
      navigate("/");
      return;
    }
    slideIndexRef.current = i + 1;
    setSlideIndex(i + 1);
    setSlideProgress(0);
    slideProgressRef.current = 0;
    setScrubPreviewProgress(0);
    slideStartRef.current = performance.now();
    completionHoldRef.current = false;
    pausedRef.current = false;
    setIsMediaPaused(false);
  }, [navigate]);

  const goToPreviousSlide = useCallback(() => {
    if (videoPreviewTimerRef.current != null) {
      clearTimeout(videoPreviewTimerRef.current);
      videoPreviewTimerRef.current = null;
    }
    setTooltip((t) => ({ ...t, visible: false, previewUrl: null }));
    videoHoldOriginRef.current = null;
    const i = slideIndexRef.current;
    if (i > 0) {
      slideIndexRef.current = i - 1;
      setSlideIndex(i - 1);
    }
    setSlideProgress(0);
    slideProgressRef.current = 0;
    setScrubPreviewProgress(0);
    slideStartRef.current = performance.now();
    completionHoldRef.current = false;
    pausedRef.current = false;
    setIsMediaPaused(false);
  }, []);

  const onVideoMetadata = useCallback(
    (info: { slideIndex: number; durationMs: number }) => {
      if (info.slideIndex !== slideIndexRef.current) return;
      const ms = Math.max(500, Math.min(info.durationMs, 120_000));
      slideDurationMsRef.current[info.slideIndex] = ms;
      slideStartRef.current = performance.now();
      setSlideProgress(0);
      slideProgressRef.current = 0;
      setScrubPreviewProgress(0);
      completionHoldRef.current = false;
    },
    [],
  );

  /** Seek the story video to `clientX` in the slide’s segment and sync timeline + preview with that scrub ratio. */
  const seekStoryVideoToClientX = useCallback(
    (clientX: number, segmentSlideIndex: number): number | null => {
      const outer = timelineOuterRef.current;
      const inner = timelineRef.current;
      const video = storyVideoRef.current;
      if (!outer || !inner || !video) return null;
      const n = slidesLengthRef.current;
      const ratio = getVideoScrubRatioFromClientX(
        clientX,
        outer,
        inner,
        segmentSlideIndex,
        n,
      );
      const durMs =
        slideDurationMsRef.current[segmentSlideIndex] ?? SLIDE_DURATION_MS;
      const durS = durMs / 1000;
      if (!Number.isFinite(durS) || durS <= 0) return null;
      const nextTime = Math.min(durS - 1e-3, Math.max(0, ratio * durS));
      video.currentTime = nextTime;
      slideProgressRef.current = ratio;
      setSlideProgress(ratio);
      setScrubPreviewProgress(ratio);
      return ratio;
    },
    [],
  );

  const syncProgressFromStoryVideo = useCallback(() => {
    const idx = slideIndexRef.current;
    if (slidesRef.current[idx]?.type !== "video") return;
    const video = storyVideoRef.current;
    if (!video) return;
    const durMs = slideDurationMsRef.current[idx] ?? SLIDE_DURATION_MS;
    const durS = durMs / 1000;
    if (!Number.isFinite(durS) || durS <= 0) return;
    const r = Math.min(1, Math.max(0, video.currentTime / durS));
    slideProgressRef.current = r;
    setSlideProgress(r);
    setScrubPreviewProgress(r);
  }, []);

  const onTouchLayerPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      lastScrubClientXRef.current = e.clientX;
      storyPointerDownRef.current = true;
      videoHoldOriginRef.current = null;

      const idx = slideIndexRef.current;
      const outer = timelineOuterRef.current;
      const inner = timelineRef.current;
      if (outer && inner) {
        seekCenterXRef.current = previewCenterFromClientX(
          e.clientX,
          outer,
          inner,
          idx,
          slidesLengthRef.current,
          STORY_VIDEO_PREVIEW_FRAME_WIDTH_PX,
        );
        if (slidesRef.current[idx]?.type === "video") {
          seekStoryVideoToClientX(e.clientX, idx);
        }
      }

      touchStartRef.current = {
        t: performance.now(),
        x: e.clientX,
        y: e.clientY,
      };
      pausedRef.current = true;
      setIsMediaPaused(true);

      if (slidesRef.current[idx]?.type === "video") {
        videoHoldOriginRef.current = {
          routeStoryId: routeStoryIdRef.current,
          slideIndex: idx,
        };
        if (videoPreviewTimerRef.current != null) {
          clearTimeout(videoPreviewTimerRef.current);
        }
        videoPreviewTimerRef.current = setTimeout(() => {
          videoPreviewTimerRef.current = null;
          if (!storyPointerDownRef.current) return;
          const origin = videoHoldOriginRef.current;
          if (!origin) return;
          if (routeStoryIdRef.current !== origin.routeStoryId) return;
          if (slideIndexRef.current !== origin.slideIndex) return;
          if (slidesRef.current[slideIndexRef.current]?.type !== "video") {
            return;
          }
          const outer = timelineOuterRef.current;
          const inner = timelineRef.current;
          if (!outer || !inner) return;
          seekStoryVideoToClientX(
            lastScrubClientXRef.current,
            origin.slideIndex,
          );
          const cx = previewCenterFromClientX(
            lastScrubClientXRef.current,
            outer,
            inner,
            origin.slideIndex,
            slidesLengthRef.current,
            STORY_VIDEO_PREVIEW_FRAME_WIDTH_PX,
          );
          seekCenterXRef.current = cx;
          setTooltip({
            visible: true,
            centerX: cx,
            previewUrl: null,
            timeLabel: "",
          });
        }, VIDEO_HOLD_PREVIEW_MS);
      }
    },
    [seekStoryVideoToClientX],
  );

  const onTouchLayerPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!storyPointerDownRef.current) return;
      const origin = videoHoldOriginRef.current;
      if (!origin) return;
      if (routeStoryIdRef.current !== origin.routeStoryId) return;
      if (slideIndexRef.current !== origin.slideIndex) return;
      if (slidesRef.current[slideIndexRef.current]?.type !== "video") {
        return;
      }

      const outer = timelineOuterRef.current;
      const inner = timelineRef.current;
      if (!outer || !inner) return;
      lastScrubClientXRef.current = e.clientX;
      seekStoryVideoToClientX(e.clientX, origin.slideIndex);
      const x = previewCenterFromClientX(
        e.clientX,
        outer,
        inner,
        origin.slideIndex,
        slidesLengthRef.current,
        STORY_VIDEO_PREVIEW_FRAME_WIDTH_PX,
      );
      seekCenterXRef.current = x;
      setTooltip((prev) =>
        prev.visible ? { ...prev, centerX: x } : prev,
      );
    },
    [seekStoryVideoToClientX],
  );

  const onTouchLayerPointerUp = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      storyPointerDownRef.current = false;
      videoHoldOriginRef.current = null;
      if (videoPreviewTimerRef.current != null) {
        clearTimeout(videoPreviewTimerRef.current);
        videoPreviewTimerRef.current = null;
      }
      setTooltip((t) => ({ ...t, visible: false, previewUrl: null }));
      syncProgressFromStoryVideo();

      if (e.type === "pointercancel") {
        touchStartRef.current = null;
        resumeFromProgress();
        return;
      }

      const start = touchStartRef.current;
      touchStartRef.current = null;

      if (!start) {
        resumeFromProgress();
        return;
      }

      const elapsed = performance.now() - start.t;
      const moved = Math.hypot(e.clientX - start.x, e.clientY - start.y);

      if (elapsed < TAP_MAX_DURATION_MS && moved < TAP_MAX_MOVE_PX) {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const localX = e.clientX - rect.left;
        const isRightHalf = localX >= rect.width / 2;
        if (isRightHalf) {
          goToNextSlide();
        } else {
          goToPreviousSlide();
        }
        return;
      }

      resumeFromProgress();
    },
    [goToNextSlide, goToPreviousSlide, resumeFromProgress, syncProgressFromStoryVideo],
  );

  const timelinePointerDown = useCallback(() => {
    pausedRef.current = true;
    setIsMediaPaused(true);
  }, []);

  const timelinePointerUp = useCallback(() => {
    resumeFromProgress();
  }, [resumeFromProgress]);

  const onMessagePointerDown = useCallback(() => {}, []);

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col bg-black">
      <InstagramStory
        slides={slides}
        currentSlideIndex={slideIndex}
        slideProgress={slideProgress}
        scrubPreviewProgress={scrubPreviewProgress}
        displayName={displayName}
        timeLabel="12h"
        avatarSrc={avatarSrc}
        isMediaPaused={isMediaPaused}
        onVideoMetadata={onVideoMetadata}
        previewFrameStrips={previewFrameStrips}
        timelineRef={timelineRef}
        timelineOuterRef={timelineOuterRef}
        storyVideoRef={storyVideoRef}
        onTouchLayerPointerDown={onTouchLayerPointerDown}
        onTouchLayerPointerMove={onTouchLayerPointerMove}
        onTouchLayerPointerUp={onTouchLayerPointerUp}
        timelinePointerDown={timelinePointerDown}
        timelinePointerUp={timelinePointerUp}
        tooltip={tooltip}
        onClosePointerDown={onClosePointerDown}
        onClosePointerUp={onClosePointerUp}
        onMessagePointerDown={onMessagePointerDown}
      />
    </div>
  );
}
