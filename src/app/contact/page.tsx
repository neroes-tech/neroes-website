import type { Metadata } from "next";

import { ContactPageContent } from "./ContactPageContent";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Neroes. We are happy to hear from you.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
