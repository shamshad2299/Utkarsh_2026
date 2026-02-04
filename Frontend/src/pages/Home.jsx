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
<<<<<<< HEAD

      <div className="relative">
        <MonumentBottom />
      </div>

      <BackgroundGlow />
=======
      <div className="relative ">
        <MonumentBottom />
      </div>

      <div className="relative overflow-x-hidden">
        <BackgroundGlow />
      </div>
>>>>>>> 208c8c2baf1f7e3041b7f543e8574d6426dd93d7


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
