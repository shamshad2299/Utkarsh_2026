import GalleryItem from "./GalleryItem";
import FloatingBadge from "./FloatingBadge";

const GalleryGrid = () => {
  return (
    <div className="grid grid-cols-5 gap-4 max-w-6xl w-full relative z-10">

      {/* Column 1 */}
      <div className="flex flex-col gap-4 mt-20">
        <GalleryItem
          src="https://csspicker.dev/api/image/?q=tech+conference+stage&image_type=photo"
          className="h-64 rounded-tr-[40px]"
        />
        <GalleryItem
          src="https://csspicker.dev/api/image/?q=audience+event&image_type=photo"
          className="h-40 rounded-tl-[40px]"
        />
      </div>

      {/* Column 2 */}
      <div className="flex flex-col gap-4">
        <GalleryItem
          src="https://csspicker.dev/api/image/?q=speaker+on+stage&image_type=photo"
          className="h-80 rounded-tl-[40px]"
        />
        <GalleryItem
          src="https://csspicker.dev/api/image/?q=concert+lighting&image_type=photo"
          className="h-64 rounded-br-[40px]"
        />
      </div>

      {/* Column 3 */}
      <div className="flex flex-col gap-4 mt-32">
        <GalleryItem
          src="https://csspicker.dev/api/image/?q=crowd+party&image_type=photo"
          className="h-32 rounded-xl"
        />
        <GalleryItem
          src="https://csspicker.dev/api/image/?q=event+badges+phone&image_type=photo"
          className="h-80 rounded-xl"
        />
      </div>

      {/* Column 4 */}
      <div className="flex flex-col gap-4 mt-4">
        <GalleryItem
          src="https://csspicker.dev/api/image/?q=modern+stage+design&image_type=photo"
          className="h-80 rounded-tr-[40px]"
        />
        <GalleryItem
          src="https://csspicker.dev/api/image/?q=gala+dinner&image_type=photo"
          className="h-80 rounded-xl"
        />
      </div>

      {/* Column 5 */}
      <div className="flex flex-col gap-4 mt-24">
        <GalleryItem
          src="https://csspicker.dev/api/image/?q=presentation+screen&image_type=photo"
          className="h-80 rounded-tl-[40px]"
        />

        <FloatingBadge />
      </div>

    </div>
  );
};

export default GalleryGrid;
