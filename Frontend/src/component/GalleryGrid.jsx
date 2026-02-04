import GalleryItem from "./GalleryItem";
import FloatingBadge from "./FloatingBadge";

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
  return (
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
        <GalleryItem
          src={ukr1}
          className="h-80 sm:h-72 md:h-80 lg:h-96 rounded-tr-[40px]"
        />
        <GalleryItem
          src={ukr2}
          className="h-56 sm:h-52 md:h-56 lg:h-64 rounded-tl-[40px]"
        />
      </div>

      
      <div className="flex flex-col gap-6">
        <GalleryItem
          src={ukr3}
          className="h-96 sm:h-80 md:h-96 lg:h-112 rounded-tl-[40px]"
        />
        <GalleryItem
          src={ukr4}
          className="h-72 sm:h-64 md:h-72 lg:h-80 rounded-br-[40px]"
        />
      </div>

    
      <div className="flex flex-col gap-6 lg:mt-32">
        <GalleryItem
          src={ukr5}
          className="h-56 sm:h-48 md:h-56 lg:h-64 rounded-xl"
        />
        <GalleryItem
          src={ukr6}
          className="h-96 sm:h-80 md:h-96 lg:h-112 rounded-xl"
        />
      </div>

      
      <div className="flex flex-col gap-6 lg:mt-4">
        <GalleryItem
          src={ukr7}
          className="h-96 sm:h-80 md:h-96 lg:h-112 rounded-tr-[40px]"
        />
        <GalleryItem
          src={ukr8}
          className="h-96 sm:h-80 md:h-96 lg:h-112 rounded-xl"
        />
      </div>

    
      <div className="flex flex-col gap-6 lg:mt-24">
        <GalleryItem
          src={ukr9}
          className="h-96 sm:h-80 md:h-96 lg:h-112 rounded-tl-[40px]"
        />

        <FloatingBadge />
      </div>
    </div>
  );
};

export default GalleryGrid;
