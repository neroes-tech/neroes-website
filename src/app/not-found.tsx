import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-background py-24">
      <div className="container mx-auto max-w-xl px-4 text-center md:px-6">
        <h1 className="mb-4 font-exo text-4xl font-bold text-primary md:text-5xl">Page not found</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Button asChild size="lg" className="bg-secondary font-semibold text-white hover:bg-secondary/90">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </section>
  );
}
