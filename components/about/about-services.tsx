import { PartyPopper, Store, Truck } from "lucide-react";
import Container from "@/components/layout/container";

const services = [
  {
    icon: Truck,
    title: "Home delivery",
    text: "Pure cow and buffalo milk, paneer, curd, butter and ghee, delivered to your doorstep in Sanganer, Pratap Nagar and Mansarovar.",
  },
  {
    icon: Store,
    title: "Sweet shop supply",
    text: "Pure, fresh milk for sweet shops across Pratap Nagar, Sanganer and Mansarovar, with timely delivery.",
  },
  {
    icon: PartyPopper,
    title: "Events and bookings",
    text: "Fresh and hygienic dairy in bulk for weddings, parties and special events.",
  },
];

export default function AboutServices() {
  return (
    <section className="bg-secondary py-20">
      <Container className="space-y-12">
        <div className="max-w-2xl space-y-3">
          <h2 className="font-display text-4xl font-semibold sm:text-5xl">What we supply</h2>
          <p className="text-lg text-muted-foreground">
            Bilona ghee, desi cow ghee, lassi and chaach, pasteurized milk, shrikhand and more.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {services.map(({ icon: Icon, title, text }) => (
            <div key={title} className="space-y-5 rounded-3xl bg-card p-8">
              <Icon className="size-8 text-primary" />
              <h3 className="font-display text-xl font-semibold">{title}</h3>
              <p className="text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}