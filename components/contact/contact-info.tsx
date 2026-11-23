import type React from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { site, telLink, whatsappLink } from "@/data/site";

const items: { icon: React.ElementType; label: string; value: string; href?: string }[] = [
  { icon: MapPin, label: "Visit us", value: site.address },
  { icon: Phone, label: "Call us", value: "9252139481 , 9887700428", href: telLink },
  { icon: FaWhatsapp, label: "WhatsApp", value: "+91 98877 00428", href: whatsappLink() },
  { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
];

export default function ContactInfo() {
  return (
    <div className="space-y-10">
      <ul className="space-y-6">
        {items.map(({ icon: Icon, label, value, href }) => (
          <li key={label} className="flex gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
              <Icon className="size-5" />
            </span>
            <div>
              <p className="font-semibold">{label}</p>
              {href ? (
                <a href={href} className="text-muted-foreground transition-colors hover:text-primary">
                  {value}
                </a>
              ) : (
                <p className="text-muted-foreground">{value}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="hidden sm:block">
        <iframe
        title="Monu Goras Bhandar on Google Maps"
        src={`https://www.google.com/maps?q=${encodeURIComponent(site.address)}&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-72 w-full rounded-3xl border-0 lg:h-80"
      />
      </div>
    </div>
  );
}