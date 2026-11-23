import { Clock, Leaf, PartyPopper, ShieldCheck } from "lucide-react";
import Container from "@/components/layout/container";

const reasons = [
  { icon: Clock, title: "Milk within hours of milking", text: "Delivered to your door fast, so every glass keeps its natural taste." },
  { icon: Leaf, title: "Traditional Goras products", text: "Pure cow milk and traditional dairy made by Goras Bhandar." },
  { icon: ShieldCheck, title: "Hygienic, on-time delivery", text: "Clean handling and punctual delivery, every single day." },
  { icon: PartyPopper, title: "Supplying sweet shops and events", text: "Bulk milk for sweet shops, weddings, parties and special occasions." },
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="scroll-mt-20 py-20">
      <Container className="grid gap-14 lg:grid-cols-12">
        <div className="max-w-xl space-y-5 lg:col-span-5">
          <h2 className="font-display text-4xl font-semibold text-balance sm:text-5xl">Why choose us</h2>
          <p className="text-lg text-muted-foreground">
            Monu Goras Bhandar is an agency of Goras Bhandar, established in 1954. We bring fresh, hygienic dairy to homes, shops and events.
          </p>
        </div>
        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:col-span-7">
          {reasons.map(({ icon: Icon, title, text }) => (
            <div key={title} className="space-y-3 border-t border-border pt-6">
              <Icon className="size-6 text-primary" />
              <h3 className="font-display text-xl font-semibold">{title}</h3>
              <p className="text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
