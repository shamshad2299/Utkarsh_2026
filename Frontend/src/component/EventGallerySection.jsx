import GalleryGrid from "../component/GalleryGrid";

const EventGallerySection = () => {
  return (
    <section className="relative bg-[#080131] text-white px-6 md:px-16 pt-2 pb-24 overflow-hidden">
      
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
      <div className="max-w-7xl mx-auto relative z-10 mb-8">
        
        {/* THROWBACK HEADING */}
        <h2
          className="
            text-5xl md:text-6xl font-semibold mb-6
            bg-linear-to-r
            from-[#7070DE] via-[#FFFEFF] to-[#C8ABFE]
            bg-clip-text text-transparent
          "
          style={{ fontFamily: "Poppins" }}
        >
          Throwback
        </h2>

        <p className="text-gray-400 max-w-3xl text-sm md:text-base leading-relaxed">
          Experience a thrilling array of events, from mind-bending coding
          competitions to electrifying dance performances, and showcase your
          talents on a stage that embraces innovation.
        </p>
      </div>

      {/* GALLERY */}
      <div className="relative z-10 flex justify-center">
        <GalleryGrid />
      </div>
    </section>
  );
};

export default EventGallerySection;
