import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/constants";

const ROUTES = [
  "",
  "/science",
  "/sport",
  "/sport/science",
  "/sport/services",
  "/sport/about",
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms-conditions",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
  }));
}
