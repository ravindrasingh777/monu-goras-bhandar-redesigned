import { Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import Container from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { site, telLink, whatsappLink } from "@/data/site";
import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="py-20">
      <Container>
        <div className="flex flex-col gap-8 rounded-[2.5rem] bg-accent p-8 text-accent-foreground sm:p-12 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-3">
            <h2 className="font-display text-4xl font-semibold text-balance">Start your daily milk delivery</h2>
            <p className="text-lg opacity-85">
              Message us on WhatsApp to start daily delivery, or ask about bulk orders for sweet shops and events.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg">
              <Link className="inline-flex items-center justify-center gap-2" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                <FaWhatsapp /> Order on WhatsApp
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              <Link className="inline-flex items-center justify-center gap-2" href={telLink}>
                <Phone /> {site.phone}
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
