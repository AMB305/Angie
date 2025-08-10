"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [canPlay, setCanPlay] = useState(false);

  // Try to autoplay on mount (muted + playsInline improves success)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = async () => {
      try {
        await v.play();
        setIsPlaying(true);
      } catch {
        // Autoplay blocked; show controls state
        setIsPlaying(false);
      }
    };
    tryPlay();
  }, []);

  // Keep UI state in sync when user interacts with native controls
  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  const togglePlay = async () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      await v.play().catch(() => {});
      setIsPlaying(!v.paused);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  const restart = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {});
    setIsPlaying(true);
  };

  const fullscreen = async () => {
    const v = videoRef.current;
    if (!v) return;
    // request fullscreen on the container for bezel/overlay included
    const container = v.parentElement?.parentElement; // .tv-plane wrapper
    const el = container ?? v;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        // @ts-ignore
        await (el.requestFullscreen?.() || el.webkitRequestFullscreen?.());
      }
    } catch {}
  };

  const scrollToTV = () => {
    document.getElementById("tv-stage")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* BACKGROUND: little girl looking down */}
      <div className="absolute inset-0">
        <Image
          src="/girl.jpg"
          alt="Child looking down at a TV"
          fill
          priority
          className="object-cover"
        />
        {/* Privacy-preserving shadow across face area */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/85 via-black/60 to-black/0" />
        {/* Optional film grain (remove if you don’t add /public/noise.png) */}
        <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-[url('/noise.png')] bg-[length:300px_300px]" />
      </div>

      {/* HEADER / HERO */}
      <header className="relative z-10 px-4 pt-8 sm:pt-10">
        <div className="mx-auto max-w-6xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium tracking-wide text-white/80 ring-1 ring-white/10 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-white/80 animate-pulse" />
            Invitation Premiere
          </div>
          <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
            Stories on Screen
          </h1>
          <p className="mt-2 max-w-xl text-white/70">
            A little girl gazes at the glow of a TV. The invitation plays inside the screen.
            Face stays private by default.
          </p>

          <div className="mt-6">
            <button
              onClick={scrollToTV}
              className="group inline-flex items-center gap-2 rounded-2xl bg-white text-black px-4 py-2 text-sm font-semibold shadow-md transition hover:shadow-lg active:scale-[0.99]"
            >
              Watch invitation
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M13 5l7 7-7 7M5 12h14" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* TV STAGE */}
      <section id="tv-stage" className="relative z-10 flex min-h-[80vh] items-center justify-center px-4 py-16 sm:py-20">
        <div
          className="relative w-full max-w-5xl aspect-[16/9]"
          style={
            {
              // ---- ALIGN THE TV over your background photo ----
              "--tv-left": "50%",        // horizontal anchor (% of container)
              "--tv-top": "72%",         // vertical anchor
              "--tv-width": "72%",       // TV width (relative to container)
              "--tv-perspective": "1200px",

              // 3D angle (tweak these to match your photo’s tilt)
              "--tv-rotX": "12deg",
              "--tv-rotY": "0deg",
              "--tv-rotZ": "-4deg",
              "--tv-skewX": "0deg",
              "--tv-skewY": "0.5deg",
              "--tv-origin": "50% 50%",
              "--tv-radius": "18px",
            } as React.CSSProperties
          }
        >
          {/* Positioned TV block */}
          <div className="tv-anchor">
            <div className="tv-perspective">
              <div className="tv-plane group">
                {/* The video */}
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  preload="metadata"
                  poster="/poster.jpg" // optional: add poster.jpg to public
                  onPlay={handlePlay}
                  onPause={handlePause}
                  className="tv-video"
                >
                  {/* Multiple sources for wider codec support */}
                  <source src="/invitation.mp4" type="video/mp4" />
                  <source src="/invitation.webm" type="video/webm" />
                </video>

                {/* Subtle CRT overlay */}
                <div className="tv-overlay" aria-hidden />

                {/* Optional bezel image overlay (transparent PNG) */}
                {/* <img src="/tv-frame.png" alt="" className="tv-bezel" /> */}

                {/* FLOATING CONTROLS (top-right) */}
                <div className="pointer-events-none absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 sm:right-3 sm:top-3">
                  <IconButton label={isPlaying ? "Pause" : "Play"} onClick={togglePlay}>
                    {isPlaying ? (
                      <PauseIcon />
                    ) : (
                      <PlayIcon />
                    )}
                  </IconButton>
                  <IconButton label={isMuted ? "Unmute" : "Mute"} onClick={toggleMute}>
                    {isMuted ? <MuteIcon /> : <VolumeIcon />}
                  </IconButton>
                  <IconButton label="Restart" onClick={restart}>
                    <RestartIcon />
                  </IconButton>
                  <IconButton label="Fullscreen" onClick={fullscreen}>
                    <FullscreenIcon />
                  </IconButton>
                </div>

                {/* Autoplay hint if blocked */}
                {!isPlaying && !canPlay && (
                  <div className="absolute inset-0 grid place-items-center bg-black/20 backdrop-blur-[1px]">
                    <button
                      onClick={async () => {
                        setCanPlay(true);
                        await togglePlay();
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-white/90 px-5 py-2 text-sm font-semibold text-black shadow hover:bg-white"
                    >
                      <PlayIcon />
                      Tap to play
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER NOTE */}
      <div className="relative z-10 pb-10 text-center text-xs text-white/60 px-4">
        By default, the face is shadowed. Only use media you’re authorized to use.
      </div>
    </main>
  );
}

/* ---------------- small, dependency-free icon/button helpers ---------------- */

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void | Promise<void>;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white/90 ring-1 ring-white/15 backdrop-blur transition hover:bg-black/70 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
    >
      <span className="sr-only">{label}</span>
      {children}
    </button>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M8 5v14l11-7-11-7z" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
    </svg>
  );
}
function VolumeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M5 10v4h3l4 4V6L8 10H5zm9.5-4.5v13a7.5 7.5 0 000-13z" />
    </svg>
  );
}
function MuteIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M5 10v4h3l4 4V6L8 10H5zm9 2l3 3 1.5-1.5L15.5 12l3-3L17 7.5l-3 3-3-3L9.5 9l3 3-3 3L11 16.5l3-3z" />
    </svg>
  );
}
function RestartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M12 5V1L7 6l5 5V7a5 5 0 11-5 5H5a7 7 0 107-7z" />
    </svg>
  );
}
function FullscreenIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M7 7h4V5H5v6h2V7zm10 10h-4v2h6v-6h-2v4zM7 17v-4H5v6h6v-2H7zm10-6h2V5h-6v2h4v4z" />
    </svg>
  );
}
