import { useState } from "react";
import GalleryItem from "./GalleryItem";

import ukr1 from "../assets/ukr1.jpg";
import ukr2 from "../assets/ukr2.jpg";
import ukr3 from "../assets/ukr3.jpg";
import ukr4 from "../assets/ukr4.jpg";
import ukr5 from "../assets/ukr5.jpg";
import ukr6 from "../assets/ukr6.jpg";
import ukr7 from "../assets/ukr7.jpg";
import ukr8 from "../assets/ukr8.jpg";
import ukr9 from "../assets/ukr9.jpg";

const GalleryGrid = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <>
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-5
          gap-6
          max-w-7xl
          w-full
          relative
          z-10
        "
      >
        <div className="flex flex-col gap-6 lg:mt-20">
          <div onClick={() => setSelectedImage(ukr1)} className="cursor-pointer">
            <GalleryItem
              src={ukr1}
              className="h-80 sm:h-72 md:h-80 lg:h-96 rounded-tr-[40px]"
            />
          </div>

          <div onClick={() => setSelectedImage(ukr2)} className="cursor-pointer">
            <GalleryItem
              src={ukr2}
              className="h-56 sm:h-52 md:h-56 lg:h-64 rounded-tl-[40px]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div onClick={() => setSelectedImage(ukr3)} className="cursor-pointer">
            <GalleryItem
              src={ukr3}
              className="h-96 sm:h-80 md:h-96 lg:h-112 rounded-tl-[40px]"
            />
          </div>

          <div onClick={() => setSelectedImage(ukr4)} className="cursor-pointer">
            <GalleryItem
              src={ukr4}
              className="h-72 sm:h-64 md:h-72 lg:h-80 rounded-br-[40px]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:mt-32">
          <div onClick={() => setSelectedImage(ukr5)} className="cursor-pointer">
            <GalleryItem
              src={ukr5}
              className="h-56 sm:h-48 md:h-56 lg:h-64 rounded-xl"
            />
          </div>

          <div onClick={() => setSelectedImage(ukr6)} className="cursor-pointer">
            <GalleryItem
              src={ukr6}
              className="h-96 sm:h-80 md:h-96 lg:h-112 rounded-xl"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:mt-4">
          <div onClick={() => setSelectedImage(ukr7)} className="cursor-pointer">
            <GalleryItem
              src={ukr7}
              className="h-96 sm:h-80 md:h-96 lg:h-112 rounded-tr-[40px]"
            />
          </div>

          <div onClick={() => setSelectedImage(ukr8)} className="cursor-pointer">
            <GalleryItem
              src={ukr8}
              className="h-96 sm:h-80 md:h-96 lg:h-112 rounded-xl"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:mt-24">
          <div onClick={() => setSelectedImage(ukr9)} className="cursor-pointer">
            <GalleryItem
              src={ukr9}
              className="h-96 sm:h-80 md:h-96 lg:h-112 rounded-tl-[40px]"
            />
          </div>
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-999 bg-black/80 flex items-center justify-center px-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white text-3xl font-bold"
            >
              ✕
            </button>

            <img
              src={selectedImage}
              alt="Preview"
              className="w-full max-h-[85vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryGrid;
