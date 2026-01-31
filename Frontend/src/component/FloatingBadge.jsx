import imgBadge from "../assets/img1.svg"; // ✅ wahi svg jo assets me hai

const FloatingBadge = () => {
  return (
    <div className="relative w-full h-32 flex items-end justify-center">
      <img
        src={imgBadge}
        alt="Event Badge"
        className="w-44 rotate-12 floating-badge"
      />
    </div>
  );
};

export default FloatingBadge;
