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
import Line from "../assets/Vector_63.png"

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
      <section id="events" className="scroll-mt-28 relative">
        <div className="absolute xl:-bottom-65 z-1 right-8 lg:right-5 lg:-bottom-50 md:-bottom-20 max-md:hidden">
          <img 
          src={Line} alt="" className="xl:w-350 lg:w-282 md:w-230" />
        </div>
        <EventsSection />
      </section>

 {/* ABOUT */}
      <section id="about" className="scroll-mt-28 lg:-mt-20 md:-mt-40">
        <AboutUs />
      </section>
      {/* GALLERY */}
      <section id="schedule" className="scroll-mt-28 ">
        <EventGallerySection />
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
