import HeroSection from "../component/HeroSection";
import MonumentBottom from "../component/MonumentBottom";
import BackgroundGlow from "../component/BackgroundGlow";
import EventsSection from "../component/EventsSection";
import EventGallerySection from "../component/EventGallerySection";
import AboutUs from "../component/AboutUs";
import EDM from "../component/EDM";
import TeamSection from "../component/TeamSection";
import Footer from "../component/Footer";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      document
        .getElementById(location.state.scrollTo)
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return (
    <div className="w-full overflow-x-hidden">
      {/* HERO */}
      <div className="relative w-full overflow-hidden">
        <section id="hero">
          <HeroSection />
        </section>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <BackgroundGlow />
        </div>

        <MonumentBottom />
      </div>

      {/* EVENTS */}
      <section id="events" className="scroll-mt-28">
        <EventsSection />
      </section>

      {/* GALLERY */}
      <section id="schedule" className="scroll-mt-28 -mt-12">
        <EventGallerySection />
      </section>

      {/* ABOUT */}
      <section id="about" className="scroll-mt-28">
        <AboutUs />
      </section>

      {/* EDM (GAP FIX) */}
      <section className="scroll-mt-28 -mt-12">
        <EDM />
      </section>

      {/* TEAM */}
      <section id="team" className="scroll-mt-28">
        <TeamSection />
      </section>

      <Footer />
    </div>
  );
};

export default Home;
