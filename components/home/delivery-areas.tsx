import { MapPin, Truck } from "lucide-react";
import Container from "@/components/layout/container";
import { deliveryAreas } from "@/data/site";

export default function DeliveryAreas() {
  return (
    <section id="delivery" className="scroll-mt-20 bg-secondary py-20">
      <Container className="space-y-12">
        <div className="max-w-2xl space-y-3">
          <h2 className="font-display text-4xl font-semibold sm:text-5xl">Daily milk delivery in Jaipur</h2>
          <p className="text-lg text-muted-foreground">
            We bring fresh milk to homes every day in Sanganer, Pratap Nagar and Mansarovar. Our other Goras products ship across India.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {deliveryAreas.map((area) => (
            <div key={area} className="space-y-6 rounded-3xl bg-card p-6">
              <MapPin className="size-7 text-primary" />
              <div className="space-y-1">
                <h3 className="font-display text-xl font-semibold">{area}</h3>
                <p className="text-sm text-muted-foreground">Fresh milk, delivered daily</p>
              </div>
            </div>
          ))}
          <div className="space-y-6 rounded-3xl bg-primary p-6 text-primary-foreground">
            <Truck className="size-7 text-gold" />
            <div className="space-y-1">
              <h3 className="font-display text-xl font-semibold">All over India</h3>
              <p className="text-sm opacity-80">Dairy products delivered nationwide.</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
