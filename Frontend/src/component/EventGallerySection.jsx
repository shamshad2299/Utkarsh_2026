import { useQuery } from "@tanstack/react-query";
import GalleryGrid from "../component/GalleryGrid";
import { api } from "../api/axios";

const EventGallerySection = () => {
  // React Query hook with caching
  const { 
    data: images = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['throwbackImages'],
    queryFn: async () => {
      const response = await api.get('/throwbacks');
      return response.data.data.map(item => item.imageUrl);
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 48 * 60 * 60 * 1000, // 48 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // Loading state
  if (isLoading) {
    return (
      <section className="relative bg-[#080131] text-white px-6 md:px-16 pt-2 pb-24 overflow-hidden min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 border-4 border-[#7070DE] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white/80">Loading throwback images...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="relative bg-[#080131] text-white px-6 md:px-16 pt-2 pb-24 overflow-hidden min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-2">Error: {error.message}</p>
          <button 
            onClick={() => refetch()} 
            className="px-4 py-2 bg-[#7070DE] text-white rounded-lg hover:bg-[#5a5ab0] transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

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
        
        <h2
          className="
            text-5xl md:text-6xl font-semibold mb-6
            bg-gradient-to-r
            from-[#7070DE] via-[#FFFEFF] to-[#C8ABFE]
            bg-clip-text text-transparent
          "
          style={{ fontFamily: "Poppins" }}
        >
          Throwback
        </h2>

        <p className="text-white max-w-3xl text-sm md:text-[20px] leading-relaxed">
          Experience a thrilling array of events, from mind-bending coding
          competitions to electrifying dance performances, and showcase your
          talents on a stage that embraces innovation.
        </p>
      </div>

      {/* GALLERY */}
      <div className="relative z-10 flex justify-center">
        {images.length > 0 ? (
          <GalleryGrid images={images} />
        ) : (
          <div className="text-center py-12">
            <p className="text-white/60">No throwback images available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventGallerySection;