import GalleryGrid from "./GalleryGrid";
import FloatingBadge from "./FloatingBadge";
import BgImage from "../assets/BG.png";

const EventGallerySection = () => {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center p-8 overflow-hidden"
      style={{
        backgroundImage: `url(${BgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* OPTIONAL DARK OVERLAY (readability ke liye) */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* CONTENT */}
      <div className="relative z-10 w-full flex justify-center">
        <GalleryGrid />
      </div>

      <FloatingBadge />
    </section>
  );
};

export default EventGallerySection;
