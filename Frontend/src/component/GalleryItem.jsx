const GalleryItem = ({ src, className = "" }) => {
  return (
    <div className={`relative group overflow-hidden rounded-lg border border-purple-500/30 ${className}`}>
      <img
        src={src}
        alt="Event"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-linear-to-t from-purple-900/40 to-transparent pointer-events-none" />
    </div>
  );
};

export default GalleryItem;
