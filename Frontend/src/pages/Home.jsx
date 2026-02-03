import HeroSection from "../component/HeroSection";
import MonumentBottom from "../component/MonumentBottom";
import BackgroundGlow from "../component/BackgroundGlow";
import EventsSection from "../component/EventsSection";
import EventGallerySection from "../component/EventGallerySection";
import AboutUs from "../component/AboutUs";
import EDM from "../component/edm";
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
    <>
      {/* HERO */}
      <HeroSection />

      <div className="relative">
        <MonumentBottom />
      </div>

      <BackgroundGlow />


      {/* EVENTS */}
      <section id="events" className="scroll-mt-28">
        <EventsSection />
      </section>

      {/* GALLERY / SCHEDULE */}
      <section id="schedule" className="scroll-mt-28">
        <EventGallerySection />
      </section>

        {/* ABOUT US SECTION */}
      <section id="about" className="scroll-mt-28">
        <AboutUs />
      </section>

      <section className="scroll-mt-28">
  <EDM />
</section>
<Footer />

    </>
  );
};

export default Home;
