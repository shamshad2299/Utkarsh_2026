import GalleryGrid from "./GalleryGrid";
import FloatingBadge from "./FloatingBadge";

const EventGallerySection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center p-8 overflow-hidden text-white">
      
      {/* BASE DARK BACKGROUND */}
      <div className="absolute inset-0 bg-[#050214]" />

      {/* GRID BACKGROUND */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#4c1d95 1px, transparent 1px), linear-gradient(90deg, #4c1d95 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* CONTENT */}
      <div className="relative z-10 w-full flex justify-center">
        <GalleryGrid />
      </div>

      <FloatingBadge />
    </section>
  );
};

export default EventGallerySection;
