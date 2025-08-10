import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Mind of Angelica — Invitation",
  description: "Watch Angelica’s invitation.",
  openGraph: {
    title: "The Mind of Angelica — Invitation",
    description: "Watch Angelica’s invitation.",
    url: "https://themindofangelica.com",
    images: [{ url: "/poster.jpg" }], // add poster.jpg to /public for rich previews
  },
  twitter: {
    card: "summary_large_image",
    title: "The Mind of Angelica — Invitation",
    description: "Watch Angelica’s invitation.",
    images: ["/poster.jpg"],
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: "#000", color: "#fff" }}>{children}</body>
    </html>
  );
}
