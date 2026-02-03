import HeroSection from "../component/HeroSection";
import MonumentBottom from "../component/MonumentBottom";
import BackgroundGlow from "../component/BackgroundGlow";
import EventsSection from "../component/EventsSection";
import EventGallerySection from "../component/EventGallerySection";
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
      <HeroSection />
     <div className="relative ">
  <MonumentBottom />
</div>


      <BackgroundGlow />

      <section id="events" className="scroll-mt-28">
        <EventsSection />
      </section>

      <section id="schedule">
        <EventGallerySection />
      </section>
    </>
  );
};

export default Home;
