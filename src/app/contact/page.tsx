import type { Metadata } from "next";

import { ContactPageContent } from "./ContactPageContent";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Fala com a Neroes: email, telefone e formulário de contacto.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
