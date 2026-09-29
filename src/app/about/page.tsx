import type { Metadata } from "next";

import { AboutPageContent } from "./AboutPageContent";

export const metadata: Metadata = {
  title: "Sobre nós",
  description:
    "A Neroes nasceu de uma ideia de Pedro Pestana e Hugo Ferreira na Faculdade de Ciências da Universidade de Lisboa. Conhece a equipa por detrás da plataforma de treino mental Neroes.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
