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

const images = [ukr1, ukr2, ukr3, ukr4, ukr5, ukr6, ukr7, ukr8, ukr9];

const GalleryGrid = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const getImg = (i) => images[i % images.length];

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="relative w-full overflow-hidden">

      <div
        className="flex gap-6"
        style={{
          width: "max-content",
          animation: "scrollGrid 45s linear infinite",
        }}
      >

        {[0, 1].map((loop) => (
          <div key={loop} className="flex gap-6">

            {/* COLUMN 1 */}
            <div className="flex flex-col gap-6 lg:mt-20 min-w-[200px] sm:min-w-[220px]">
              <div onClick={() => setSelectedImage(getImg(0))}>
                <GalleryItem src={getImg(0)} className="h-56 sm:h-64 md:h-72 lg:h-96 rounded-tr-[40px] border-2 border-[#6760DF] outline-2 outline-teal-800"/>
              </div>
              <div onClick={() => setSelectedImage(getImg(1))}>
                <GalleryItem src={getImg(1)} className="h-40 sm:h-48 md:h-56 lg:h-64 rounded-tl-[40px] border-2 border-[#6760DF] outline-2 outline-teal-800"/>
              </div>
            </div>

            {/* COLUMN 2 */}
            <div className="flex flex-col gap-6 min-w-[200px] sm:min-w-[220px]">
              <div onClick={() => setSelectedImage(getImg(2))}>
                <GalleryItem src={getImg(2)} className="h-64 sm:h-72 md:h-80 lg:h-[28rem] rounded-tl-[40px] border-2 border-[#6760DF] outline-2 outline-teal-800"/>
              </div>
              <div onClick={() => setSelectedImage(getImg(3))}>
                <GalleryItem src={getImg(3)} className="h-48 sm:h-56 md:h-64 lg:h-80 rounded-br-[40px] border-2 border-[#6760DF] outline-2 outline-teal-800"/>
              </div>
            </div>

            {/* COLUMN 3 */}
            <div className="flex flex-col gap-6 lg:mt-24 min-w-[200px] sm:min-w-[220px]">
              <div onClick={() => setSelectedImage(getImg(4))}>
                <GalleryItem src={getImg(4)} className="h-40 sm:h-48 md:h-56 lg:h-64 rounded-xl border-2 border-[#6760DF] outline-2 outline-teal-800"/>
              </div>
              <div onClick={() => setSelectedImage(getImg(5))}>
                <GalleryItem src={getImg(5)} className="h-64 sm:h-72 md:h-80 lg:h-[28rem] rounded-xl border-2 border-[#6760DF] outline-2 outline-teal-800"/>
              </div>
            </div>

            {/* COLUMN 4 */}
            <div className="flex flex-col gap-6 lg:mt-4 min-w-[200px] sm:min-w-[220px]">
              <div onClick={() => setSelectedImage(getImg(6))}>
                <GalleryItem src={getImg(6)} className="h-64 sm:h-72 md:h-80 lg:h-[28rem] rounded-tr-[40px] border-2 border-[#6760DF] outline-2 outline-teal-800"/>
              </div>
              <div onClick={() => setSelectedImage(getImg(7))}>
                <GalleryItem src={getImg(7)} className="h-56 sm:h-64 md:h-72 lg:h-72 rounded-xl border-2 border-[#6760DF] outline-2 outline-teal-800"/>
              </div>
            </div>

            {/* COLUMN 5 */}
            <div className="flex flex-col gap-6 lg:mt-20 min-w-[200px] sm:min-w-[220px]">
              <div onClick={() => setSelectedImage(getImg(8))}>
                <GalleryItem src={getImg(8)} className="h-64 sm:h-72 md:h-80 lg:h-[28rem] rounded-tl-[40px] border-2 border-[#6760DF] outline-2 outline-teal-800"/>
              </div>
              <div onClick={() => setSelectedImage(getImg(9))}>
                <GalleryItem src={getImg(9)} className="h-48 sm:h-56 md:h-64 lg:h-72 rounded-tl-[40px] border-2 border-[#6760DF] outline-2 outline-teal-800"/>
              </div>
            </div>

          </div>
        ))}

      </div>

      <style>{`
        @keyframes scrollGrid {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {selectedImage && (
        <div
          className="fixed inset-0 z-999999 bg-black/85 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Preview"
            className="max-h-[80vh] max-w-[90vw] rounded-2xl"
          />
        </div>
      )}
    </div>
  );
};

export default GalleryGrid;
