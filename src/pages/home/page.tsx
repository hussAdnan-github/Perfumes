import Navbar from "./components/Navbar";
import ServiceHero from "./components/ServiceHero";
import AboutSection from "./components/AboutSection";
import ServicesShowcase from "./components/ServicesShowcase";
import PortfolioSection from "./components/PortfolioSection";
import FAQSection from "./components/FAQSection";
import ContactSection from "./components/ContactSection";
import ArtisticCTA from "./components/ArtisticCTA";
import FooterSection from "./components/FooterSection";

const Home = () => {
  return (
    <div className="min-h-screen bg-stone-50" dir="rtl">
      <Navbar />
      <ServiceHero />
      <AboutSection />
      <ServicesShowcase />
      <PortfolioSection />
      <FAQSection />
      <ContactSection />
      <ArtisticCTA />
      <FooterSection />
    </div>
  );
};

export default Home;