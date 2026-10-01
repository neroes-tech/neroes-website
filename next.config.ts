import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    dirs: ["src"],
  },
  // Pages removed from the site (Sept 2026 — Ciência and Sobre at Pedro's
  // request on 30 Sept): send old links/bookmarks home instead of a 404.
  // Temporary (307) in case any of them comes back.
  async redirects() {
    return ["/services", "/brain-experience", "/mental-health-calculator", "/science", "/about"].map((source) => ({
      source,
      destination: "/",
      permanent: false,
    }));
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
