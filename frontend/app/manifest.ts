import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MainFrame CTF - Capture The Flag Platform",
    short_name: "MainFrame CTF",
    description:
      "University of Wolverhampton mainframe technology CTF competition platform",
    start_url: "/",
    display: "standalone",
    background_color: "#020817",
    theme_color: "#0ea5e9",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    orientation: "portrait-primary",
    categories: ["education", "technology"],
    scope: "/",
  };
}
