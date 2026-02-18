import HeroSection from "../component/HeroSection";
import EventsSection from "../component/EventsSection";
import EventGallerySection from "../component/EventGallerySection";
import AboutUs from "../component/AboutUs";
import EDM from "../component/EDM";
import TeamSection from "../component/TeamSectionFolder/TeamSection";
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

      {/* ================= HERO ================= */}
      <section id="hero" className="relative overflow-hidden ">


        {/* Hero Content */}
        <div className="relative z-10 ">
          <HeroSection />
        </div>

      </section>

      {/* EVENTS */}
      <section id="events" className="scroll-mt-28 relative">
        <EventsSection />
      </section>

      {/* ABOUT */}
      <section id="about" className="scroll-mt-28 mt-10 ">
        <AboutUs />
      </section>

      {/* ================= GALLERY ================= */}
      <section id="schedule" className="scroll-mt-28 pt-20">
        <EventGallerySection />
      </section>

      {/* ================= EDM ================= */}
      <section className="scroll-mt-28 pb-10">
        <EDM />
      </section>

      {/* ================= TEAM ================= */}
      <section id="team" className="scroll-mt-20 py-10">
        <TeamSection />
      </section>

      {/* ================= FOOTER ================= */}
      <Footer />

    </div>
  );
};

export default Home;
