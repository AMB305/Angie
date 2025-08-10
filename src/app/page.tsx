"use client";

import { useEffect, useRef } from "react";

export default function Home() {
  const vRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Nudge autoplay on some browsers
    vRef.current?.play().catch(() => {});
  }, []);

  return (
    <main
      style={{
        minHeight: "100dvh",
        backgroundColor: "#000",
        display: "grid",
        placeItems: "center",
        padding: "16px",
      }}
    >
      <video
        ref={vRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/poster.jpg"     // optional (add to /public if you have it)
        style={{
          width: "100%",
          maxWidth: 900,
          height: "auto",
          display: "block",
          borderRadius: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Use whichever sources you have; keep both if possible */}
        <source src="/invitation.webm" type="video/webm" />
        <source src="/invitation.mp4"  type="video/mp4" />
        {/* Fallback image if video can’t play at all */}
        <img
          src="/poster.jpg"
          alt="Watch the invitation"
          style={{ width: "100%", maxWidth: 900, display: "block" }}
        />
      </video>
    </main>
  );
}
