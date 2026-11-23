import type { Metadata } from "next";
import ContactInfo from "@/components/contact/contact-info";
import EnquiryForm from "@/components/contact/enquiry-form";
import Container from "@/components/layout/container";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Contact us | Monu Goras Bhandar" };

export default function ContactPage() {
  return (
    <section className="py-8 lg:py-16">
      <Container className="space-y-16">
        <div className="max-w-2xl animate-fade-up space-y-4 motion-reduce:animate-none">
          <h1 className="font-display text-5xl font-semibold sm:text-6xl">Contact us</h1>
          <p className="text-lg text-muted-foreground">
            Call us, message us on WhatsApp, or send an enquiry below.
          </p>
          <div className="block sm:hidden">
            <iframe
                    title="Monu Goras Bhandar on Google Maps"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(site.address)}&output=embed`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-72 w-full rounded-3xl border-0 lg:h-80"
                  />
          </div>
        </div>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <ContactInfo />
          </div>
          <div className="lg:col-span-7">
            <EnquiryForm />
          </div>
        </div>
      </Container>
    </section>
  );
}