import type { Metadata } from "next";

import { AboutPageContent } from "./AboutPageContent";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Neroes started as an idea developed by Pedro Pestana and Hugo Ferreira at the Faculty of Sciences of the University of Lisbon. Meet the team behind the Neroes Mental Training Platform.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
