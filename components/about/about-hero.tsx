import Image from "next/image";
import Container from "@/components/layout/container";

const stats = [
  { value: "20+ years", label: "Serving Jaipur" },
  { value: "3 areas", label: "Sanganer, Pratap Nagar, Mansarovar" },
  { value: "1954", label: "Goras Bhandar established" },
  { value: "India", label: "Products delivered nationwide" },
];

export default function AboutHero() {
  return (
    <section className="py-8 lg:py-16 ">
      <Container className="grid items-center gap-14 lg:grid-cols-2">
        <div className="animate-fade-up space-y-8 motion-reduce:animate-none">
          <div className="space-y-6">
            <h1 className="font-display text-5xl font-semibold sm:text-6xl">
              About us
            </h1>
            <p className="text-lg text-muted-foreground">
              Monu Goras Bhandar is a trusted agency of Goras Bhandar, proudly
              serving Sanganer, Pratap Nagar and Mansarovar for over 20 years.
              We deliver fresh, pure Goras milk and dairy products to your
              doorstep.
              <div className="relative block md:hidden my-4 md:my-0 aspect-[5/5] animate-fade-up overflow-hidden rounded-3xl [animation-delay:200ms] motion-reduce:animate-none lg:aspect-auto lg:h-[560px]">
                <Image
                  src="/contactUsBanner.webp"
                  alt="Fresh Goras milk and dairy products"
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <ul className="mt-2 list-disc ml-4">
                <li>20+ years of trust and experience.</li>
                <li>
                  Daily doorstep delivery in Sanganer, Pratap Nagar, and
                  Mansarovar
                </li>
                <li>Delivery of products across India.</li>
              </ul>
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-6 border-t border-border pt-8">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <dt className="text-sm text-muted-foreground">{stat.label}</dt>
                <dd className="font-display text-3xl font-semibold text-primary">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative hidden md:block aspect-[5/5] animate-fade-up overflow-hidden rounded-[2rem] [animation-delay:200ms] motion-reduce:animate-none lg:aspect-auto lg:h-[560px]">
          <Image
            src="/contactUsBanner.webp"
            alt="Fresh Goras milk and dairy products"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </Container>
    </section>
  );
}
