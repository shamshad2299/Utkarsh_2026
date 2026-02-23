import HeroSection from "../component/HeroSection";
import EventsSection from "../component/EventsSection";
import EventGallerySection from "../component/EventGallerySection";
import AboutUs from "../component/AboutUs";
import EDM from "../component/EDM";
import TeamSection from "../component/TeamSectionFolder/TeamSection";
import Footer from "../component/Footer";
import ContactPopup from "../pages/ShowContactPopup";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle, Phone, Mail } from "lucide-react";

const Home = () => {
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(true);

  // Scroll functionality
  useEffect(() => {
    if (location.state?.scrollTo) {
      document
        .getElementById(location.state.scrollTo)
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  // NO AUTO POPUP - Removed the auto-show useEffect

  // Hide floating button when popup is open
  useEffect(() => {
    if (showPopup) {
      setShowFloatingButton(false);
    } else {
      // Show button again after popup closes with a small delay
      const timer = setTimeout(() => {
        setShowFloatingButton(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  return (
    <div className="w-full overflow-x-hidden">
      {/* Contact Popup - Only opens on button click */}
      <ContactPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />

      {/* Floating Contact Button - Left Bottom */}
      {showFloatingButton && (
        <div className="fixed left-4 md:left-6 bottom-4 md:bottom-6 z-50">
          {/* Main Button */}
          <button
            onClick={() => setShowPopup(true)}
            className="group relative flex items-center gap-2 md:gap-3 bg-[#6c63ff] hover:bg-[#5b54e6] text-white rounded-full pl-3 md:pl-4 pr-4 md:pr-6 py-2 md:py-3 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            {/* Icon */}
            <div className="relative">
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
              <span className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 bg-green-400 rounded-full animate-pulse"></span>
            </div>
            
            {/* Text - Hidden on mobile, shown on desktop */}
            <span className="hidden md:inline font-medium">Contact Us</span>

            {/* Hover Tooltip - Only on desktop */}
            <div className="hidden md:block absolute left-0 -top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none">
              Get in touch with our team
              <div className="absolute left-4 -bottom-1 w-3 h-3 bg-gray-900 rotate-45"></div>
            </div>
          </button>

          {/* Mini Contact Cards - Appear on Hover (Desktop only) */}
          <div className="hidden md:block absolute left-0 bottom-20 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
            <div className="bg-[#241f4a] border border-white/20 rounded-lg p-3 shadow-xl">
              <div className="flex items-center gap-3 mb-2">
                <Phone className="w-4 h-4 text-[#6c63ff]" />
                <span className="text-white text-sm">+91 7392975951</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#6c63ff]" />
                <span className="text-white text-sm">utkarsh.dbm@bbdu.ac.in</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= HERO ================= */}
      <section id="hero" className="relative overflow-hidden">
        <div className="relative z-10">
          <HeroSection />
        </div>
      </section>

      {/* EVENTS */}
      <section id="events" className="scroll-mt-28 relative">
        <EventsSection />
      </section>

      {/* ABOUT */}
      <section id="about" className="scroll-mt-28 mt-10">
        <AboutUs />
      </section>

      {/* ================= GALLERY ================= */}
      <section id="schedule" className="scroll-mt-28">
        <EventGallerySection />
      </section>

      {/* ================= EDM ================= */}
      <section className="scroll-mt-28">
        <EDM />
      </section>

      {/* ================= TEAM ================= */}
      <section id="team" className="scroll-mt-20 pb-5">
        <TeamSection />
      </section>

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
};

export default Home;