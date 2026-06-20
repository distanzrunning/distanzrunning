"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

// ============================================================================
// Glyphs — Geist's exact play / pause SVG paths (16×16, currentColor)
// ============================================================================

function PlayGlyph() {
  return (
    <svg viewBox="0 0 16 16" height="16" width="16" aria-hidden="true">
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.55 7.78c.19.09.19.35 0 .44l-13.19 6.6A.25.25 0 0 1 1 14.6V1.4c0-.18.2-.3.36-.22z"
      />
    </svg>
  );
}

function PauseGlyph() {
  return (
    <svg viewBox="0 0 16 16" height="16" width="16" aria-hidden="true">
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.5 2.5v-.75H4v12.5h1.5V2.5m6.5 0v-.75h-1.5v12.5H12V2.5"
      />
    </svg>
  );
}

// ============================================================================
// Types
// ============================================================================

export interface VideoProps {
  /** Video source URL. */
  src: string;
  /** Intrinsic width — sets the aspect ratio with `height`. Default 600. */
  width?: number;
  /** Intrinsic height — sets the aspect ratio with `width`. Default 400. */
  height?: number;
  /** Max rendered width; the player is centred and never exceeds it. Default 600. */
  maxWidth?: number;
  /** Loop playback. Default true. */
  loop?: boolean;
  /** Show the custom control bar. Default true. */
  controls?: boolean;
  /** Autoplay (requires muted in browsers). Default true. */
  autoPlay?: boolean;
  /** Muted — kept true so autoplay is allowed. Default true. */
  muted?: boolean;
  /** Inline playback on iOS. Default true. */
  playsInline?: boolean;
  /** Poster frame shown before playback. */
  poster?: string;
  /**
   * Defer loading until the player nears the viewport (IntersectionObserver),
   * then attach the source. Default false.
   */
  lazy?: boolean;
  className?: string;
  "aria-label"?: string;
}

function formatTime(s: number): string {
  if (!Number.isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

// ============================================================================
// Video
// ============================================================================

/**
 * A `<video>` with a custom Geist control bar (play/pause, scrubber, time) and
 * optional lazy loading. Autoplay is muted by default so browsers allow it.
 *
 * @example
 * <Video src="/videos/sample.mp4" />
 */
export function Video({
  src,
  width = 600,
  height = 400,
  maxWidth = 600,
  loop = true,
  controls = true,
  autoPlay = true,
  muted = true,
  playsInline = true,
  poster,
  lazy = false,
  className = "",
  "aria-label": ariaLabel = "Video player",
}: VideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  // When lazy, hold the src back until the player nears the viewport.
  const [shouldLoad, setShouldLoad] = useState(!lazy);

  useEffect(() => {
    if (shouldLoad) return;
    const el = figureRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldLoad(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [shouldLoad]);

  const aspectPct = (height / width) * 100;
  const progress = duration ? (current / duration) * 100 : 0;

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
    } else {
      v.pause();
    }
  }, []);

  const seekToClientX = useCallback(
    (clientX: number) => {
      const v = videoRef.current;
      const track = trackRef.current;
      if (!v || !track || !duration) return;
      const rect = track.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      v.currentTime = ratio * duration;
      setCurrent(v.currentTime);
    },
    [duration],
  );

  // Pointer drag to scrub.
  const onTrackPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      seekToClientX(e.clientX);
      const move = (ev: PointerEvent) => seekToClientX(ev.clientX);
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    },
    [seekToClientX],
  );

  return (
    <figure
      ref={figureRef}
      role="region"
      aria-label={ariaLabel}
      className={`ds-video block text-center ${className}`}
      style={{ margin: "40px 0" }}
    >
      <div
        className="relative mx-auto w-full"
        style={{ maxWidth }}
      >
        {/* Aspect-ratio box (padding-bottom = height/width). The control bar
            reveals on hover/focus of this stage — see globals .ds-video-stage. */}
        <div
          className="ds-video-stage relative flex justify-center"
          style={{ paddingBottom: `${aspectPct}%` }}
        >
          <video
            ref={videoRef}
            className="ds-video-el absolute inset-0 h-full w-full cursor-pointer object-cover"
            width={width}
            height={height}
            src={shouldLoad ? src : undefined}
            poster={poster}
            autoPlay={autoPlay}
            muted={muted}
            loop={loop}
            playsInline={playsInline}
            preload={lazy ? "none" : "auto"}
            onClick={togglePlay}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          />

          {controls && (
            <div
              className="ds-video-controls absolute bottom-[5%] left-1/2 flex h-12 w-[85%] -translate-x-1/2 items-center rounded-md bg-surface px-2 shadow-[var(--ds-shadow-tooltip)] transition-opacity duration-200"
            >
              <button
                type="button"
                onClick={togglePlay}
                aria-label={playing ? "Pause" : "Play"}
                className="flex size-10 shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-[var(--ds-gray-1000)] outline-none focus-visible:rounded-sm focus-visible:shadow-[var(--ds-focus-ring)]"
              >
                {playing ? <PauseGlyph /> : <PlayGlyph />}
              </button>

              <div className="w-[60px] shrink-0 px-3 text-center text-[13px] tabular-nums text-[var(--ds-gray-1000)]">
                {formatTime(current)}
              </div>

              {/* Scrubber: track + filled progress + draggable thumb. */}
              <div
                ref={trackRef}
                onPointerDown={onTrackPointerDown}
                className="relative flex flex-1 cursor-pointer items-center py-2"
              >
                <div className="relative h-1 w-full overflow-hidden rounded-[5px] bg-[var(--ds-gray-200)]">
                  <div
                    className="h-full rounded-[5px] bg-[var(--ds-gray-1000)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div
                  className="pointer-events-none absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--ds-gray-1000)]"
                  style={{ left: `${progress}%` }}
                />
              </div>

              <div className="w-[60px] shrink-0 px-3 text-center text-[13px] tabular-nums text-[var(--ds-gray-1000)]">
                {formatTime(duration)}
              </div>
            </div>
          )}
        </div>
      </div>
    </figure>
  );
}

export default Video;
