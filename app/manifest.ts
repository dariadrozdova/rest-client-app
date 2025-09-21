import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MyWebSite",
    short_name: "MySite",
    description: "An application built with Next.js",
    start_url: "/",
    background_color: "hsla(0, 0%, 100%, 1)",
    theme_color: "hsla(0, 0%, 100%, 1)",
    display: "standalone",
    icons: [
      {
        src: "/images/icons/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/images/icons/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
