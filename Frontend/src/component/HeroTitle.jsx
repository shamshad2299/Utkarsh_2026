const HeroTitle = () => {
  return (
    <div className="w-full max-w-5xl flex flex-col items-center md:items-start">
      <div className="max-w-xl lg:max-w-2xl text-center md:text-left">
        {/* Tagline */}
        <p
          className="text-purple-200 tracking-wide leading-none mb-2 text-[32px]"
          style={{ fontFamily: "Milonga" }}
        >
          Virasat se vikas tak
        </p>

        <h1
          className="text-white font-black leading-[1] tracking-normal text-[clamp(3.5rem,8vw,120px)]"
          style={{ fontFamily: "Poppins" }}
        >
          UTKARSH
        </h1>

        {/* fest'26 */}
        <h2
          className="text-white font-black leading-[1] mt-2 text-[clamp(2.8rem,7vw,6rem)]"
          style={{ fontFamily: "Poppins" }}
        >
          fest&apos;26
        </h2>

        {/* Date */}
        <p
          className="mt-4 text-white/90 font-medium text-lg sm:text-xl md:text-2xl"
          style={{ fontFamily: "Milonga" }}
        >
          26–28 February 2026
        </p>
      </div>
    </div>
  );
};

export default HeroTitle;
