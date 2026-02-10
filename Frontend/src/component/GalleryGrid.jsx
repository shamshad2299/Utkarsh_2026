import { useEffect, useState } from "react";
import GalleryItem from "./GalleryItem";

import ukr1 from "../assets/ukr1.webp";
import ukr2 from "../assets/ukr2.webp";
import ukr3 from "../assets/ukr3.webp";
import ukr4 from "../assets/ukr4.webp";
import ukr5 from "../assets/ukr5.webp";
import ukr6 from "../assets/ukr6.webp";
import ukr7 from "../assets/ukr7.webp";
import ukr8 from "../assets/ukr8.webp";
import ukr9 from "../assets/ukr9.webp";

const GalleryGrid = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (selectedImage) {
      const scrollBarWidth = window.innerWidth - html.clientWidth;

      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
      body.style.paddingRight = `${scrollBarWidth}px`;
      body.style.touchAction = "none";
    } else {
      html.style.overflow = "";
      body.style.overflow = "";
      body.style.paddingRight = "";
      body.style.touchAction = "";
    }

    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
      body.style.paddingRight = "";
      body.style.touchAction = "";
    };
  }, [selectedImage]);

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
              className="h-80 sm:h-72 md:h-80 lg:h-96 rounded-tr-[40px] border-2 border-[#6760DF] outline-2 outline-teal-800"
            />
          </div>

          <div
            onClick={() => setSelectedImage(ukr2)}
            className="cursor-pointer inverted-radius"
          >
            <GalleryItem
              src={ukr2}
              className="h-56 sm:h-52 md:h-56 lg:h-64 rounded-tl-[40px] border-2 border-[#6760DF] outline-2 outline-teal-800"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 inverted-radius">
          <div onClick={() => setSelectedImage(ukr3)} className="cursor-pointer">
            <GalleryItem
              src={ukr3}
              className="h-96 sm:h-80 md:h-96 lg:h-112 rounded-tl-[40px] border-2 border-[#6760DF] outline-2 outline-teal-800"
            />
          </div>

          <div onClick={() => setSelectedImage(ukr4)} className="cursor-pointer">
            <GalleryItem
              src={ukr4}
              className="h-72 sm:h-64 md:h-72 lg:h-80 rounded-br-[40px] border-2 border-[#6760DF] outline-2 outline-teal-800"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:mt-32">
          <div onClick={() => setSelectedImage(ukr5)} className="cursor-pointer">
            <GalleryItem
              src={ukr5}
              className="h-56 sm:h-48 md:h-56 lg:h-64 rounded-xl border-2 border-[#6760DF] outline-2 outline-teal-800"
            />
          </div>

          <div onClick={() => setSelectedImage(ukr6)} className="cursor-pointer">
            <GalleryItem
              src={ukr6}
              className="h-96 sm:h-80 md:h-96 lg:h-112 rounded-xl border-2 border-[#6760DF] outline-2 outline-teal-800"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:mt-4">
          <div
            onClick={() => setSelectedImage(ukr7)}
            className="cursor-pointer inverted-radius"
          >
            <GalleryItem
              src={ukr7}
              className="h-96 sm:h-80 md:h-96 lg:h-112 rounded-tr-[40px] border-2 border-[#6760DF] outline-2 outline-teal-800"
            />
          </div>

          <div onClick={() => setSelectedImage(ukr8)} className="cursor-pointer">
            <GalleryItem
              src={ukr8}
              className="h-96 sm:h-80 md:h-96 lg:h-112 rounded-xl border-2 border-[#6760DF] outline-2 outline-teal-800"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:mt-24">
          <div
            onClick={() => setSelectedImage(ukr9)}
            className="cursor-pointer inverted-radius"
          >
            <GalleryItem
              src={ukr9}
              className="h-96 sm:h-80 md:h-96 lg:h-112 rounded-tl-[40px] border-2 border-[#6760DF] outline-2 outline-teal-800"
            />
          </div>
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-[999999] bg-black/85 flex items-center justify-center px-4 pt-24 pb-8"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative w-full max-w-6xl flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-4 -right-4 z-[9999999] w-12 h-12 rounded-full bg-white text-black text-2xl font-bold flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition"
              >
                ✕
              </button>

              <img
                src={selectedImage}
                alt="Preview"
                className="rounded-2xl object-contain"
                style={{
                  maxHeight: "clamp(55vh, 70vh, 72vh)",
                  maxWidth: "min(92vw, 1100px)",
                }}
                draggable={false}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryGrid;
