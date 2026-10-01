import type { Metadata } from "next";

import { ContactPageContent } from "./ContactPageContent";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Marca uma conversa com a Neroes sobre a plataforma.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
