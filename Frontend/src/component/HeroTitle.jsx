const HeroTitle = () => {
  return (
    <div
      className="max-w-3xl flex flex-col gap-6 px-4 sm:px-6 lg:px-8"
      style={{ fontFamily: "Poppins" }}
    >
      {/* Tagline */}
      <p className="text-sm sm:text-base md:text-lg tracking-widest uppercase text-purple-300">
        Virasat Se Vikas Tak
      </p>

      {/* Main Heading */}
      <h1 className="text-[12vw] sm:text-[8vw] md:text-[6vw] lg:text-[5vw] font-extrabold leading-[0.95] tracking-tight">
        UTKARSH
        <br />
        <span className="text-purple-400 text-[8vw] sm:text-[5vw] md:text-[4vw] font-bold">
          FEST&apos;26
        </span>
      </h1>

      {/* Date */}
      <p className="text-base sm:text-lg md:text-xl font-medium tracking-wide text-gray-200">
        26 – 28 February 2026
      </p>
    </div>
  );
};

export default HeroTitle;
