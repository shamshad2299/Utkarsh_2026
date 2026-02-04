const HeroTitle = () => {
  return (
    <div
      className="max-w-2xl flex flex-col gap-4 px-4 sm:px-6 lg:px-8"
      style={{ fontFamily: "Poppins" }}
    >
      {/* Tagline */}
      <p className="text-base sm:text-lg md:text-xl font-light tracking-wide">
        Virasat se vikas tak
      </p>

      {/* Main Heading */}
      <h1 className="heading leading-tight">
        UTKARSH <br />
        <span className="lowercase">fest&apos;26</span>
      </h1>

      {/* Date */}
      <p className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight">
        26-28 February 2026
      </p>
    </div>
  );
};

export default HeroTitle;
