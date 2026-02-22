import { useState, useMemo, memo } from "react";
import GalleryItem from "./GalleryItem";

const GalleryGrid = ({ images = [], loading = "lazy" }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Use useMemo to prevent unnecessary recalculations
  const columnConfigs = useMemo(() => [
    { 
      items: [
        { height: "h-64 sm:h-72 md:h-80 lg:h-96", style: "rounded-tl-[40px]" },
        { height: "h-56 sm:h-64 md:h-72 lg:h-80", style: "rounded-tr-[40px]" },
        { height: "h-48 sm:h-56 md:h-64 lg:h-72", style: "rounded-bl-[40px]" },
        { height: "h-40 sm:h-48 md:h-56 lg:h-64", style: "rounded-br-[40px]" }
      ],
      marginTop: "lg:mt-4"
    },
    { 
      items: [
        { height: "h-72 sm:h-80 md:h-88 lg:h-96", style: "rounded-tr-[40px]" },
        { height: "h-56 sm:h-64 md:h-72 lg:h-80", style: "rounded-tl-[40px]" },
        { height: "h-48 sm:h-56 md:h-64 lg:h-72", style: "rounded-br-[40px]" },
        { height: "h-40 sm:h-48 md:h-56 lg:h-64", style: "rounded-bl-[40px]" }
      ],
      marginTop: "lg:mt-8"
    },
    { 
      items: [
        { height: "h-68 sm:h-76 md:h-84 lg:h-96", style: "rounded-xl" },
        { height: "h-56 sm:h-64 md:h-72 lg:h-80", style: "rounded-xl" },
        { height: "h-48 sm:h-56 md:h-64 lg:h-72", style: "rounded-xl" },
        { height: "h-40 sm:h-48 md:h-56 lg:h-64", style: "rounded-xl" }
      ],
      marginTop: "lg:mt-12"
    },
    { 
      items: [
        { height: "h-64 sm:h-72 md:h-80 lg:h-96", style: "rounded-bl-[40px]" },
        { height: "h-56 sm:h-64 md:h-72 lg:h-80", style: "rounded-br-[40px]" },
        { height: "h-48 sm:h-56 md:h-64 lg:h-72", style: "rounded-tl-[40px]" },
        { height: "h-40 sm:h-48 md:h-56 lg:h-64", style: "rounded-tr-[40px]" }
      ],
      marginTop: "lg:mt-0"
    },
    { 
      items: [
        { height: "h-72 sm:h-80 md:h-88 lg:h-96", style: "rounded-br-[40px]" },
        { height: "h-56 sm:h-64 md:h-72 lg:h-80", style: "rounded-bl-[40px]" },
        { height: "h-48 sm:h-56 md:h-64 lg:h-72", style: "rounded-tr-[40px]" },
        { height: "h-40 sm:h-48 md:h-56 lg:h-64", style: "rounded-tl-[40px]" }
      ],
      marginTop: "lg:mt-16"
    }
  ], []); // Empty dependency array since config is static

  // Memoize getImg function
  const getImg = useMemo(() => {
    return (index) => {
      if (images.length === 0) return null;
      return images[index % images.length];
    };
  }, [images]);

  // Keyboard event for modal close
  useState(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Don't render if no images
  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12 text-white/60">
        No images to display
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex gap-2 md:gap-3"
        style={{
          width: "max-content",
          animation: "scrollGrid 50s linear infinite",
        }}
      >
        {/* Loop twice for seamless infinite scroll */}
        {[0, 1].map((loop) => (
          <div key={loop} className="flex gap-2 md:gap-3">
            {columnConfigs.map((column, colIndex) => (
              <div 
                key={colIndex} 
                className={`flex flex-col gap-2 md:gap-3 ${column.marginTop} min-w-[100px] sm:min-w-[110px] md:min-w-[120px]`}
              >
                {column.items.map((item, itemIndex) => {
                  const imageIndex = (colIndex * 4 + itemIndex) + (loop * 20);
                  const imageSrc = getImg(imageIndex);
                  
                  // Don't render if image source is null
                  if (!imageSrc) return null;
                  
                  return (
                    <div 
                      key={itemIndex} 
                      onClick={() => setSelectedImage(imageSrc)}
                      className="cursor-pointer transition-transform duration-300 hover:scale-105"
                    >
                      <div className={`${item.height} w-full relative`}>
                        <GalleryItem 
                          src={imageSrc} 
                          className={`w-full h-full object-cover ${item.style} border-[#6760DF] shadow-2xs`}
                          loading={loading}
                          // Add width and height attributes for better CLS
                          width="400"
                          height="400"
                          decoding="async"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes scrollGrid {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Image Preview Modal - Optimized */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[999999] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <img
              src={selectedImage}
              alt="Preview"
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
              loading="lazy"
              // Add fetchpriority for modal images
              fetchPriority="high"
            />
            
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors duration-200 z-[1000000]"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Image counter */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-xs">
              {images.findIndex(img => img === selectedImage) + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Export as memoized component to prevent unnecessary re-renders
export default memo(GalleryGrid);