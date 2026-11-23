import Link from "next/link";
import { Mail, MapPin, Milk, Phone } from "lucide-react";
import Container from "@/components/layout/container";
import { navLinks, site, telLink } from "@/data/site";

export default function Footer() {
  return (
    <footer id="contact" className="scroll-mt-20 bg-primary text-primary-foreground">
      <Container className="grid gap-12 py-16 md:grid-cols-3">
        <div className="space-y-4">
          <p className="flex items-center gap-2 font-display text-2xl font-semibold">
            <Milk /> {site.name}
          </p>
          <p className="max-w-xs text-sm/6 opacity-80">
            Fresh cow milk and Goras dairy products, delivered daily in Jaipur and shipped across India.
          </p>
        </div>

        <div className="space-y-4 text-sm">
          <h2 className="font-display text-lg font-semibold">Contact</h2>
          <p className="flex gap-3 opacity-90">
            <MapPin className="mt-0.5 size-4 shrink-0" />
            {site.address}
          </p>
          <a href={telLink} className="flex items-center gap-3 hover:underline">
            <Phone className="size-4" /> {site.phone}
          </a>
          <a href={`mailto:${site.email}`} className="flex items-center gap-3 hover:underline">
            <Mail className="size-4" /> {site.email}
          </a>
        </div>

        <div className="space-y-4 text-sm">
          <h2 className="font-display text-lg font-semibold">Explore</h2>
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:underline">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </Container>

      <div className="border-t border-primary-foreground/15">
        <Container className="py-5 text-sm opacity-75">
          © 2026 {site.name}. All rights reserved.
        </Container>
      </div>
    </footer>
  );
}
