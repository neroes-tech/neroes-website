import type { Metadata } from "next";

import { BrainExperienceContent } from "./BrainExperienceContent";

export const metadata: Metadata = {
  title: "Brain Experience",
  description:
    "The Brain Experience — a 1-day mental health event for corporate teams. Individual 30-minute experiences for up to 20 employees.",
};

export default function BrainExperience() {
  return <BrainExperienceContent />;
}
