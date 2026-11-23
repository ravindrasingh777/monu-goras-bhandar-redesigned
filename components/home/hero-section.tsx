import Image from "next/image";
import Link from "next/link";
import { Milk, Truck } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import Container from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/data/site";

const ticker = [
  "Daily milk delivery in Sanganer",
  "Daily milk delivery in Pratap Nagar",
  "Daily milk delivery in Mansarovar",
  "Delivery across all over India",
];

export default function HeroSection() {
  return (
    <section className="overflow-hidden">
      <Container className="grid items-center gap-14 py-8 md:py-16 lg:grid-cols-2 ">
        <div className="animate-fade-up space-y-8 motion-reduce:animate-none">
          <p className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground">
            <Milk className="size-4" /> Milk delivered within hours of milking
          </p>
          <h1 className="font-display text-5xl leading-[1.05] font-semibold text-balance sm:text-6xl lg:text-7xl">
            Fresh milk at your door, every morning.
          </h1>
           <div className="relative md:hidden w-full h-[350px] md:h-[530px] overflow-hidden rounded-4xl">
            <Image
              src="/herosectionImage.png"
              alt="Fresh Goras milk and dairy products"
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="absolute md:hidden bottom-32 left-4 flex items-center gap-3 rounded-2xl bg-card p-4 shadow-xl">
            <span className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground">
              <Truck className="size-5" />
            </span>
            <div className="text-sm">
              <p className="font-semibold">Delivered daily</p>
              <p className="text-muted-foreground">
                Sanganer, Pratap Nagar, Mansarovar
              </p>
            </div>
          </div>
          <p className="max-w-xl text-lg text-muted-foreground">
            Daily milk delivery in Sanganer, Pratap Nagar and Mansarovar. Goras
            dairy products shipped across India.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg">
              <Link
                className="inline-flex items-center justify-center gap-2"
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp /> Connect on WhatsApp
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              <Link href="/our-products">Browse products</Link>
            </Button>
          </div>
        </div>

        <div className="relative animate-fade-up [animation-delay:200ms] motion-reduce:animate-none">
          <div className="relative hidden md:block w-full h-[350px] md:h-[530px] overflow-hidden rounded-4xl">
            <Image
              src="/herosectionImage.png"
              alt="Fresh Goras milk and dairy products"
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="absolute hidden md:flex -bottom-6 left-4  items-center gap-3 rounded-2xl bg-card p-4 shadow-xl">
            <span className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground">
              <Truck className="size-5" />
            </span>
            <div className="text-sm">
              <p className="font-semibold">Delivered daily</p>
              <p className="text-muted-foreground">
                Sanganer, Pratap Nagar, Mansarovar
              </p>
            </div>
          </div>
        </div>
      </Container>

      <div className="overflow-hidden border-y border-border bg-primary py-4 text-primary-foreground">
        <div className="flex w-max animate-marquee motion-reduce:animate-none">
          {[...ticker, ...ticker].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-3 whitespace-nowrap pr-12 font-display text-lg"
            >
              <Milk className="size-5 text-gold" /> {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
