import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    dirs: ["src"],
  },
  async redirects() {
    // Pages removed from this site (Sept 2026 — Ciência and Sobre at Pedro's
    // request on 30 Sept): send old links/bookmarks home instead of a 404.
    // Temporary (307) in case any of them comes back.
    const removed = ["/services", "/brain-experience", "/mental-health-calculator", "/science", "/about"].map(
      (source) => ({ source, destination: "/", permanent: false }),
    );

    // URLs of the WordPress site this build replaces on neroes.tech (see
    // _referencia/wordpress/), so links in emails, posts and search results
    // keep working after the switch. Gone for good, so permanent (308).
    // Specific rules come before the wildcards; trailing-slash variants are
    // normalised by Next before this list is matched.
    const wordpress = [
      // The old contact/scheduling pages → the new scheduling page.
      ["/schedule-a-meeting", "/contact"],
      ["/corporate/contact-us", "/contact"],
      ["/neroes-home/contact-us", "/contact"],
      ["/sport/contacts", "/contact"],
      ["/sport/aboutus", "/sport/about"],
      // Everything else of the old site → the home.
      ["/team", "/"],
      ["/solution", "/"],
      ["/mhc", "/"],
      ["/web-summit", "/"],
      ["/forms-websummit2024-pt", "/"],
      ["/neroes-home/:path*", "/"],
      ["/corporate/:path*", "/"],
      ["/elementor-hf/:path*", "/"],
      ["/2019/:path*", "/"],
      // TranslatePress language prefix.
      ["/pt/:path*", "/:path*"],
    ].map(([source, destination]) => ({ source: source!, destination: destination!, permanent: true }));

    return [...removed, ...wordpress];
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
