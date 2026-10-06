"use client";

import { useEffect, useState } from "react";

import { bookingEmbedSrc, type Booking } from "@/lib/booking";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

// Frame heights per provider: Google's booking page stacks the week and the
// form on phones; Calendly's month view needs the extra height there too.
const FRAME_HEIGHT = {
  google: "h-[900px] sm:h-[760px]",
  calendly: "h-[1080px] sm:h-[760px]",
} as const;

/**
 * The booking page (Google Calendar appointment schedule or Calendly) embedded
 * inline as a plain iframe — no third-party script on our origin. It shows the
 * free days and times from the team's calendar; the provider takes the booking
 * and sends the emails. Rendered after mount (Calendly's embed_domain needs
 * the real host) and in the page language (Google's hl).
 */
export function BookingEmbed({ booking, title }: { booking: Booking; title: string }) {
  const { locale } = useLanguage();
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    setSrc(bookingEmbedSrc(booking, { locale, host: window.location.hostname }));
  }, [booking, locale]);

  const height = FRAME_HEIGHT[booking.provider];
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card">
      {src ? (
        <iframe src={src} title={title} loading="lazy" className={cn("block w-full", height)} />
      ) : (
        // Space held while the frame is prepared, so the page doesn't jump.
        <div aria-hidden="true" className={cn("w-full bg-muted", height)} />
      )}
    </div>
  );
}
