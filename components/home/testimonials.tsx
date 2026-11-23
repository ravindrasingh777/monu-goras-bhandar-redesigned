import { Quote } from "lucide-react";
import Container from "@/components/layout/container";
import { testimonials } from "@/data/site";

export default function Testimonials() {
  return (
    <section className="bg-secondary py-20">
      <Container className="space-y-12">
        <h2 className="font-display text-4xl font-semibold sm:text-5xl">What customers say</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="flex flex-col justify-between gap-8 rounded-3xl bg-card p-8">
              <Quote className="size-8 text-primary" />
              <blockquote className="text-lg leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="font-semibold">{t.name}</figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
