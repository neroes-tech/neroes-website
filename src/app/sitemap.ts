import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/constants";

const ROUTES = [
  "",
  "/brain-experience",
  "/science",
  "/sport",
  "/sport/science",
  "/sport/services",
  "/sport/about",
  "/team",
  "/about",
  "/contact",
  "/mental-health-calculator",
  "/privacy-policy",
  "/terms-conditions",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
  }));
}
