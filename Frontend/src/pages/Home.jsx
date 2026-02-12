import HeroSection from "../component/HeroSection";
import MonumentBottom from "../component/MonumentBottom";
import BackgroundGlow from "../component/BackgroundGlow";
import EventsSection from "../component/EventsSection";
import EventGallerySection from "../component/EventGallerySection";
import AboutUs from "../component/AboutUs";
import EDM from "../component/EDM";
import TeamSection from "../component/TeamSectionFolder/TeamSection";
import Footer from "../component/Footer";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Line from "../assets/Vector_63.png";

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

      {/* ================= HERO ================= */}
      <section id="hero" className="relative overflow-hidden">

        {/* Background Glow */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <BackgroundGlow />
        </div>

        {/* Hero Content */}
        <div className="relative z-10">
          <HeroSection />
        </div>

        {/* Monument Bottom - Always bottom 0 */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-20">
          <MonumentBottom />
        </div>

      </section>

      {/* ================= EVENTS ================= */}
      <section id="events" className="relative scroll-mt-28 py-20">
        
        {/* Decorative Line */}
        <div className="hidden lg:block absolute right-8 bottom-0 pointer-events-none">
          <img src={Line} alt="" className="w-72 xl:w-96" />
        </div>

        <EventsSection />
      </section>

      {/* ================= ABOUT ================= */}
      <section id="about" className="scroll-mt-28 py-20">
        <AboutUs />
      </section>

      {/* ================= GALLERY ================= */}
      <section id="schedule" className="scroll-mt-28 py-20">
        <EventGallerySection />
      </section>

      {/* ================= EDM ================= */}
      <section className="scroll-mt-28 py-20">
        <EDM />
      </section>

      {/* ================= TEAM ================= */}
      <section id="team" className="scroll-mt-28 py-20">
        <TeamSection />
      </section>

      {/* ================= FOOTER ================= */}
      <Footer />

    </div>
  );
};

export default Home;
