import type { Metadata } from "next";

import { SciencePageContent } from "./SciencePageContent";

export const metadata: Metadata = {
  title: "Ciência",
  description:
    "A neurociência por detrás da plataforma Neroes: neurofeedback por EEG, os resultados medidos até agora e como foram obtidos.",
};

export default function SciencePage() {
  return <SciencePageContent />;
}
