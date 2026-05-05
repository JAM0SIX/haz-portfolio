import Hero from "@/components/sections/Hero/Hero";
import DialSection from "@/components/sections/DialSection/DialSection";
import BookLogSection from "@/components/sections/BookLogSection/BookLogSection";
import CapabilitiesSection from "@/components/sections/CapabilitiesSection/CapabilitiesSection";
import AboutSection from "@/components/sections/AboutSection/AboutSection";
import Footer from "@/components/sections/Footer/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <DialSection />
      <BookLogSection />
      <CapabilitiesSection />
      <AboutSection />
      <Footer />
    </>
  );
}
