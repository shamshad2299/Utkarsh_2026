const GalleryItem = ({ src, alt = "Gallery image", className = "" }) => {
  return (
    <div
      className={`relative group overflow-hidden rounded-lg border border-purple-500/20 cursor-zoom-in ${className}`}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent pointer-events-none" />
    </div>
  );
};

export default GalleryItem;
