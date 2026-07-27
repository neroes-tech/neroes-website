import type { Metadata } from "next";

import { SciencePageContent } from "./SciencePageContent";

export const metadata: Metadata = {
  title: "Science",
  description:
    "The neuroscience behind the Neroes Mental Training Platform: EEG-based neurofeedback for measurable improvements in emotional control and decision-making.",
};

export default function SciencePage() {
  return <SciencePageContent />;
}
