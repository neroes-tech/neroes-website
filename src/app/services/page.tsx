import type { Metadata } from "next";

import { PageHero } from "@/components/ui/PageHero";
import { ServicesTabs } from "./ServicesTabs";

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Neroes MTP™ para desporto de alta competição e para empresas — treino mental com neurofeedback, para atletas e equipas.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Neroes"
        title="Serviços"
        subtitle="Uma plataforma de treino mental com neurofeedback — para atletas de alta competição e para equipas corporativas."
      />
      <ServicesTabs />
    </>
  );
}
