import type { Metadata } from "next";

import { CalculatorPageContent } from "./CalculatorPageContent";

export const metadata: Metadata = {
  title: "Mental Health Economy Calculator",
  description:
    "Discover the hidden costs of poor mental health in your company. Uncover the annual financial impact of low performance.",
};

export default function CalculatorPage() {
  return <CalculatorPageContent />;
}
