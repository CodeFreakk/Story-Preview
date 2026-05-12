import type { RefObject } from 'react'
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import svgPaths from '../InstagramStory-2/svg-hblpgyq5r6'

/** Frame width for video long-press preview; must match tooltip layout. */
export const STORY_VIDEO_PREVIEW_FRAME_WIDTH_PX = 60
/** Frame height for video long-press preview; must match tooltip layout. */
export const STORY_VIDEO_PREVIEW_FRAME_HEIGHT_PX = 79

export type StoryTooltipState = {
  visible: boolean
  centerX: number
  previewUrl: string | null
  timeLabel: string
}

export type StoryMediaSlide =
  | { type: 'image'; src: string }
  | { type: 'video'; src: string }

export type InstagramStoryViewProps = {
  slides: StoryMediaSlide[]
  currentSlideIndex: number
  /** Progress within the current slide only, 0–1 (timeline bar). */
  slideProgress: number
  /** Scrub ratio for long-press preview frames; while preview is open, this tracks finger X, not the frozen timeline. */
  scrubPreviewProgress: number
  displayName: string
  timeLabel: string
  avatarSrc: string
  /** When true, pauses story video playback (hold-to-pause). */
  isMediaPaused: boolean
  /** Reported once per video slide when duration is known (drives progress timing). */
  onVideoMetadata?: (info: { slideIndex: number; durationMs: number }) => void
  /** Per-slide preview stills: image slides use `[src]`; video slides use extracted JPEG data URLs (empty until ready). */
  previewFrameStrips: string[][]
  /** Main story `<video>`; used for seek scrubbing and preview frame sampling. */
  storyVideoRef: RefObject<HTMLVideoElement | null>
  timelineRef: RefObject<HTMLDivElement | null>
  /** Positioning context for the video preview; wraps the padded timeline row. */
  timelineOuterRef: RefObject<HTMLDivElement | null>
  onTouchLayerPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void
  onTouchLayerPointerMove?: (e: ReactPointerEvent<HTMLDivElement>) => void
  onTouchLayerPointerUp: (e: ReactPointerEvent<HTMLDivElement>) => void
  timelinePointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void
  timelinePointerUp: (e: ReactPointerEvent<HTMLDivElement>) => void
  tooltip: StoryTooltipState
  onClosePointerDown: (e: ReactPointerEvent<HTMLButtonElement>) => void
  onClosePointerUp: (e: ReactPointerEvent<HTMLButtonElement>) => void
  onMessagePointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void
}

function TimelineSegment({
  state,
  activeProgress,
}: {
  state: 'complete' | 'active' | 'upcoming'
  activeProgress: number
}) {
  const ratio =
    state === 'complete' ? 1 : state === 'active' ? Math.min(Math.max(activeProgress, 0), 1) : 0
  return (
    <div
      className="content-stretch flex min-w-px flex-[1_0_0] flex-col items-start relative"
      data-name="Story Timeline Elements"
    >
      <div className="relative h-[1.96px] w-full shrink-0" data-name="Container">
        <div
          className="-translate-y-1/2 absolute h-[1.96px] left-0 right-0 top-1/2 rounded-[3px] backdrop-blur-[1.633px] bg-[rgba(255,255,255,0.35)]"
          data-name="Story Timeline Elements"
        />
        <div
          className="-translate-y-1/2 absolute left-0 top-1/2 h-[1.96px] max-w-full rounded-[3px] bg-white opacity-55"
          data-name="Progress"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
    </div>
  )
}

function UserNameAndTime({
  displayName,
  timeLabel,
}: {
  displayName: string
  timeLabel: string
}) {
  return (
    <div
      className="content-stretch flex gap-[9px] items-end not-italic relative shrink-0 whitespace-nowrap"
      data-name="User Name and Time"
    >
      <div className="flex flex-col font-sans font-medium justify-center leading-[0] relative shrink-0 text-[15px] text-white tracking-[0.3432px]">
        <p className="leading-[normal]">{displayName}</p>
      </div>
      <p className="font-sans font-normal leading-[normal] relative shrink-0 text-[14px] text-[rgba(255,255,255,0.7)]">
        {timeLabel}
      </p>
    </div>
  )
}

function UserDetails({
  displayName,
  timeLabel,
  avatarSrc,
}: {
  displayName: string
  timeLabel: string
  avatarSrc: string
}) {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="User Details">
      <div className="relative shrink-0 size-[33.28px]" data-name="User Picture 1">
        <img
          alt=""
          className="absolute block inset-0 max-w-none size-full"
          height="33.28"
          src={avatarSrc}
          width="33.28"
        />
      </div>
      <UserNameAndTime displayName={displayName} timeLabel={timeLabel} />
    </div>
  )
}

function CloseIcon() {
  return (
    <div className="relative shrink-0 size-[18.474px]" data-name="Close Icon">
      <div className="absolute inset-[-1.13%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.89 18.89">
          <g id="Close Icon">
            <g id="Shape">
              <path
                d={svgPaths.p3f11e700}
                fill="var(--fill-0, white)"
                style={{ fill: 'white', fillOpacity: '1' }}
              />
              <path
                d={svgPaths.p76c9200}
                stroke="var(--stroke-0, black)"
                strokeOpacity="0.2"
                strokeWidth="0.208"
                style={{ stroke: 'black', strokeOpacity: '0.2' }}
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
}

function PostHeader({
  displayName,
  timeLabel,
  avatarSrc,
  onClosePointerDown,
  onClosePointerUp,
}: Pick<
  InstagramStoryViewProps,
  'displayName' | 'timeLabel' | 'avatarSrc' | 'onClosePointerDown' | 'onClosePointerUp'
>) {
  return (
    <div className="relative shrink-0 w-full" data-name="Post Header">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[2px] relative size-full">
          <UserDetails
            avatarSrc={avatarSrc}
            displayName={displayName}
            timeLabel={timeLabel}
          />
          <button
            type="button"
            aria-label="Close"
            className="relative shrink-0 flex size-[44px] cursor-pointer touch-manipulation items-center justify-center border-0 bg-transparent p-0"
            onPointerDown={onClosePointerDown}
            onPointerUp={onClosePointerUp}
          >
            <CloseIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

function UserInfo(p: InstagramStoryViewProps) {
  const { slides, currentSlideIndex, slideProgress } = p
  return (
    <div
      className="absolute z-[4] flex min-h-0 w-[372.84px] flex-col content-stretch items-center gap-[8px] left-[8.32px] top-[8.78px] h-[63.892px]"
      data-name="User Info"
    >
      <div
        className="relative z-[8] min-h-0 w-full shrink-0 overflow-visible"
        data-name="Timeline Bar"
      >
        <div
          ref={p.timelineOuterRef}
          className="relative z-[8] min-h-0 w-full shrink-0 overflow-visible"
          data-name="Timeline Outer"
        >
          <div
            ref={p.timelineRef}
            className="content-stretch flex gap-[1.96px] items-start p-[7.839px] relative size-full"
          onPointerDown={(e) => {
            if (e.currentTarget instanceof HTMLElement) {
              try {
                e.currentTarget.setPointerCapture(e.pointerId);
              } catch {
                /* ignore */
              }
            }
            p.timelinePointerDown(e);
          }}
          onPointerUp={p.timelinePointerUp}
          onPointerCancel={p.timelinePointerUp}
        >
          {slides.map((_, i) => (
            <TimelineSegment
              key={i}
              activeProgress={slideProgress}
              state={
                i < currentSlideIndex ? 'complete' : i === currentSlideIndex ? 'active' : 'upcoming'
              }
            />
          ))}
        </div>
        </div>
        <SeekTooltip
          currentSlideIndex={p.currentSlideIndex}
          isVideoSlide={p.slides[p.currentSlideIndex]?.type === 'video'}
          previewFrameStrips={p.previewFrameStrips}
          slideProgress={
            p.tooltip.visible ? p.scrubPreviewProgress : p.slideProgress
          }
          storyVideoRef={p.storyVideoRef}
          timelineBarRef={p.timelineRef}
          timelineOuterRef={p.timelineOuterRef}
          tooltip={p.tooltip}
        />
      </div>
      <PostHeader
        avatarSrc={p.avatarSrc}
        displayName={p.displayName}
        onClosePointerDown={p.onClosePointerDown}
        onClosePointerUp={p.onClosePointerUp}
        timeLabel={p.timeLabel}
      />
    </div>
  )
}

function Story(p: InstagramStoryViewProps) {
  const slide = p.slides[p.currentSlideIndex]
  const src = slide?.src ?? ''
  const isVideo = slide?.type === 'video'

  useEffect(() => {
    if (!isVideo) return
    const v = p.storyVideoRef.current
    if (!v) return
    if (p.isMediaPaused) v.pause()
    else void v.play().catch(() => {})
  }, [isVideo, p.isMediaPaused, p.currentSlideIndex, src, p.storyVideoRef])

  return (
    <div className="absolute contents left-0 top-[-0.24px]" data-name="Story">
      <div
        className="absolute z-0 h-[752.238px] left-0 rounded-[18px] top-[-0.24px] w-[390px]"
        data-name="Rectangle"
      >
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[18px]">
          {isVideo ? (
            <video
              ref={p.storyVideoRef}
              key={src}
              className="absolute max-w-none object-cover rounded-[18px] size-full"
              src={src}
              muted
              playsInline
              autoPlay
              onLoadedMetadata={(e) => {
                const d = e.currentTarget.duration
                if (!Number.isFinite(d) || d <= 0) return
                p.onVideoMetadata?.({
                  slideIndex: p.currentSlideIndex,
                  durationMs: d * 1000,
                })
              }}
            />
          ) : (
            <img
              alt=""
              key={src}
              className="absolute max-w-none object-cover rounded-[18px] size-full"
              src={src}
            />
          )}
          <div
            className="absolute inset-0 rounded-[18px]"
            style={{
              backgroundImage:
                'linear-gradient(-2.13163e-13deg, rgba(0, 0, 0, 0) 42.916%, rgba(0, 0, 0, 0.8) 99.92%), linear-gradient(rgba(0, 0, 0, 0) 56.399%, rgba(0, 0, 0, 0.3) 99.678%)',
            }}
          />
        </div>
        <div
          className="absolute left-0 right-0 z-[2] rounded-[18px] touch-manipulation"
          style={{ top: '65.412px', bottom: '100px' }}
          onPointerDown={(e) => {
            if (e.currentTarget instanceof HTMLElement) {
              try {
                e.currentTarget.setPointerCapture(e.pointerId);
              } catch {
                /* ignore */
              }
            }
            p.onTouchLayerPointerDown(e);
          }}
          onPointerMove={(e) => {
            p.onTouchLayerPointerMove?.(e)
          }}
          onPointerUp={p.onTouchLayerPointerUp}
          onPointerCancel={p.onTouchLayerPointerUp}
        />
      </div>
      <div
        className="absolute bg-[rgba(0,0,0,0)] h-[65.412px] left-0 top-[-0.24px] w-[390px] z-[3] pointer-events-none"
        data-name="Rectangle"
      />
      <UserInfo {...p} />
    </div>
  )
}

function Message() {
  return (
    <div
      className="content-stretch flex items-center justify-center pl-[20px] pr-[146.01px] py-[13px] relative rounded-[21.558px] shrink-0"
      data-name="Message"
    >
      <div
        aria-hidden="true"
        className="absolute border-[1.633px] border-solid border-white inset-0 pointer-events-none rounded-[21.558px]"
      />
      <p className="font-sans font-normal leading-[16.005px] not-italic relative shrink-0 text-[15px] text-[rgba(255,255,255,0.8)] tracking-[0.0327px] whitespace-nowrap">
        Send message
      </p>
    </div>
  )
}

function Icons() {
  return (
    <div className="h-[20.251px] relative shrink-0 w-[63.04px]" data-name="Icons">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 63.0402 20.2513">
        <g id="Icons">
          <path
            clipRule="evenodd"
            d={svgPaths.p5e66bf0}
            fill="var(--fill-0, white)"
            fillRule="evenodd"
            id="Like"
            style={{ fill: 'white', fillOpacity: '1' }}
          />
          <path
            clipRule="evenodd"
            d={svgPaths.p57e3900}
            fill="var(--fill-0, white)"
            fillRule="evenodd"
            id="Sent"
            style={{ fill: 'white', fillOpacity: '1' }}
          />
        </g>
      </svg>
    </div>
  )
}

function MessageBar({ onMessagePointerDown }: { onMessagePointerDown: InstagramStoryViewProps['onMessagePointerDown'] }) {
  return (
    <div
      className="-translate-x-1/2 absolute bg-black bottom-[-0.28px] content-stretch flex gap-[18.291px] items-center justify-center left-[calc(50%-0.5px)] pb-[16px] pt-[14px] px-[16px] w-[390px] z-[5]"
      data-name="Message Bar"
      onPointerDown={onMessagePointerDown}
    >
      <Message />
      <Icons />
    </div>
  )
}

/** Draw the portion of the video that matches CSS `object-cover` on the element. */
function drawVideoObjectCover(
  video: HTMLVideoElement,
  ctx: CanvasRenderingContext2D,
  destW: number,
  destH: number,
) {
  const vw = video.videoWidth
  const vh = video.videoHeight
  if (vw === 0 || vh === 0) return
  const ew = video.clientWidth
  const eh = video.clientHeight
  if (ew === 0 || eh === 0) return
  const vr = vw / vh
  const er = ew / eh
  let sx = 0
  let sy = 0
  let sw = vw
  let sh = vh
  if (vr > er) {
    sw = Math.round(vh * er)
    sx = Math.round((vw - sw) / 2)
    sh = vh
  } else {
    sh = Math.round(vw / er)
    sy = Math.round((vh - sh) / 2)
    sw = vw
  }
  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, destW, destH)
}

function SeekTooltip({
  tooltip,
  isVideoSlide,
  storyVideoRef,
  timelineOuterRef,
  timelineBarRef,
  previewFrameStrips,
  currentSlideIndex,
  slideProgress,
}: {
  tooltip: StoryTooltipState
  isVideoSlide: boolean
  storyVideoRef: RefObject<HTMLVideoElement | null>
  timelineOuterRef: RefObject<HTMLDivElement | null>
  /** Thin progress row only — tooltip `top` anchors here so in-flow siblings don’t inflate the outer box. */
  timelineBarRef: RefObject<HTMLDivElement | null>
  previewFrameStrips: string[][]
  currentSlideIndex: number
  slideProgress: number
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRedrawRef = useRef(0)

  const stripUrls = previewFrameStrips[currentSlideIndex] ?? []
  const useStripPreview = stripUrls.length > 0
  const stripFrameIndex =
    stripUrls.length <= 1
      ? 0
      : Math.min(
          stripUrls.length - 1,
          Math.round(slideProgress * (stripUrls.length - 1)),
        )

  const redraw = useCallback(() => {
    const video = storyVideoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || video.readyState < 2) return
    const w = STORY_VIDEO_PREVIEW_FRAME_WIDTH_PX
    const h = STORY_VIDEO_PREVIEW_FRAME_HEIGHT_PX
    const dpr = Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1)
    const bw = Math.round(w * dpr)
    const bh = Math.round(h * dpr)
    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw
      canvas.height = bh
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, bw, bh)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    drawVideoObjectCover(video, ctx, w, h)
  }, [storyVideoRef])

  const scheduleRedraw = useCallback(() => {
    if (rafRedrawRef.current) return
    rafRedrawRef.current = requestAnimationFrame(() => {
      rafRedrawRef.current = 0
      redraw()
    })
  }, [redraw])

  useLayoutEffect(() => {
    const root = rootRef.current
    const outer = timelineOuterRef.current
    const bar = timelineBarRef.current
    if (!root || !outer || !bar || !tooltip.visible || !isVideoSlide) return

    const place = () => {
      const outer = timelineOuterRef.current
      const bar = timelineBarRef.current
      if (!outer || !bar) return
      const outerR = outer.getBoundingClientRect()
      const barR = bar.getBoundingClientRect()
      root.style.position = 'fixed'
      root.style.left = `${outerR.left + tooltip.centerX}px`
      root.style.top = `${barR.bottom + 4}px`
      root.style.transform = 'translateX(-50%)'
      root.style.width = `${STORY_VIDEO_PREVIEW_FRAME_WIDTH_PX}px`
      root.style.zIndex = '200'
      root.style.pointerEvents = 'none'
      if (!useStripPreview) scheduleRedraw()
    }
    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [
    tooltip.visible,
    tooltip.centerX,
    isVideoSlide,
    timelineOuterRef,
    timelineBarRef,
    scheduleRedraw,
    useStripPreview,
  ])

  useLayoutEffect(() => {
    if (!tooltip.visible || !isVideoSlide || useStripPreview) return
    redraw()
  }, [tooltip.visible, isVideoSlide, useStripPreview, redraw, tooltip.centerX])

  useEffect(() => {
    if (!tooltip.visible || !isVideoSlide || useStripPreview) return
    const video = storyVideoRef.current
    if (!video) return
    redraw()
    const onSeeked = () => {
      redraw()
    }
    video.addEventListener('loadeddata', onSeeked)
    video.addEventListener('seeked', onSeeked)
    video.addEventListener('timeupdate', scheduleRedraw)
    return () => {
      video.removeEventListener('loadeddata', onSeeked)
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('timeupdate', scheduleRedraw)
      if (rafRedrawRef.current) {
        cancelAnimationFrame(rafRedrawRef.current)
        rafRedrawRef.current = 0
      }
    }
  }, [tooltip.visible, isVideoSlide, useStripPreview, storyVideoRef, redraw, scheduleRedraw])

  if (!tooltip.visible || !isVideoSlide) return null
  return (
    <div
      ref={rootRef}
      className="flex flex-col content-stretch items-center"
      data-name="Profile"
    >
      <div
        className="relative h-[79.487px] w-full shrink-0 overflow-hidden rounded-[10px] border-[2.5px] border-solid border-white"
        data-name="Profile Picture"
      >
        {useStripPreview ? (
          <img
            alt=""
            className="pointer-events-none block h-full w-full rounded-[10px] object-cover"
            src={stripUrls[stripFrameIndex] ?? ''}
          />
        ) : (
          <canvas
            ref={canvasRef}
            aria-hidden
            className="pointer-events-none block h-full w-full rounded-[10px]"
          />
        )}
      </div>
    </div>
  )
}

export default function InstagramStory(props: InstagramStoryViewProps) {
  return (
    <div className="relative h-full min-h-0 w-full bg-black" data-name="Instagram Story">
      <Story {...props} />
      <MessageBar onMessagePointerDown={props.onMessagePointerDown} />
    </div>
  )
}
