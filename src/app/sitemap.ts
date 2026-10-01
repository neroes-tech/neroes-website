import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/constants";

// The legacy English /sport pages are left out (and set to noindex in
// src/app/sport/layout.tsx): their figures predate the Home's evidence and
// would contradict it in search results.
const ROUTES = [
  "",
  "/contact",
  "/privacy-policy",
  "/terms-conditions",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
  }));
}
