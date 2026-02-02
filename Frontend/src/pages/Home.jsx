import Navbar from "../component/Navbar";
import HeroSection from "../component/HeroSection";
import MonumentBottom from "../component/MonumentBottom";
import BackgroundGlow from "../component/BackgroundGlow";
import EventsSection from "../component/EventsSection";
import EventGallerySection from "../component/EventGallerySection";



const Home = () => {
  return (
    <div className="text-white text-shadow-2xs relative overflow-x-hidden">
      
      {/* HERO AREA */}
      <div className="relative min-h-screen flex flex-col">
        <Navbar />
        <HeroSection />
        <MonumentBottom />
        <BackgroundGlow />
      </div>

     
   
      <EventsSection />

      {/* EVENT GALLERY */}
     

    </div>
  );
};

export default Home;
