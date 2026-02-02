import Navbar from "../component/Navbar";
import HeroSection from "../component/HeroSection";
import MonumentBottom from "../component/MonumentBottom";
import BackgroundGlow from "../component/BackgroundGlow";
import EventsSection from "../component/EventsSection";
import EventGallerySection from "../component/EventGallerySection";

const Home = () => {
  return (
    <div className="bg-[#050214] text-white relative overflow-x-hidden">
      <div className="relative min-h-screen flex flex-col">
        <Navbar
    
        />
        <HeroSection />
        <MonumentBottom />
        <BackgroundGlow />
      </div>

      <EventsSection />
      <EventGallerySection />
    </div>
  );
};

export default Home;
