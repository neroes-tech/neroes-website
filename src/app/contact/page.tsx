import type { Metadata } from "next";

import { getMailConfig } from "@/lib/mail";
import { getSchedulerStore } from "@/lib/scheduling/store";

import { ContactPageContent } from "./ContactPageContent";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Marca uma conversa com a Neroes sobre a plataforma.",
};

export default function ContactPage() {
  // Read on the server (at build time on Vercel): whether the built-in agenda
  // is on (somewhere to save bookings, and email in production), and whether
  // the visitor gets a confirmation email.
  return <ContactPageContent scheduler={getSchedulerStore() !== null} emailConfirm={getMailConfig().configured} />;
}
