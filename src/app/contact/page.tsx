import type { Metadata } from "next";

import { ContactPageContent } from "./ContactPageContent";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Marca uma conversa com a Neroes: escolhe o dia e a hora que te dão mais jeito.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
