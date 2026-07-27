import type { Metadata } from "next";

import { HomeContent } from "./HomeContent";

export const metadata: Metadata = {
  title: "Neroes — Treino mental com neurofeedback",
  description:
    "Treino mental baseado em neurociência: um headset EEG e um jogo de neurofeedback treinam foco, controlo emocional e resiliência.",
};

export default function Home() {
  return <HomeContent />;
}
