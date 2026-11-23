import CtaBanner from "@/components/home/cta-banner";
import DeliveryAreas from "@/components/home/delivery-areas";
import FeaturedCategories from "@/components/home/featured-categories";
import FeaturedProducts from "@/components/home/featured-products";
import HeroSection from "@/components/home/hero-section";
import Testimonials from "@/components/home/testimonials";
import WhyChooseUs from "@/components/home/why-choose-us";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedCategories/>
      <FeaturedProducts />
      <DeliveryAreas />
      <WhyChooseUs />
      <Testimonials />
      <CtaBanner />
    </>
  );
}
