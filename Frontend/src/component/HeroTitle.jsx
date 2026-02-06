const HeroTitle = () => {
  return (
    <div className="w-full max-w-5xl flex flex-col px-4 sm:px-6 lg:px-8 overflow-visible">
      <p
        className="text-base sm:text-lg md:text-xl text-purple-200 tracking-wide leading-none mb-1"
        style={{ fontFamily: "Milonga" }}
      >
        Virasat se vikas tak
      </p>

      <h1
        className="text-white font-extrabold leading-[0.98]
                   text-[18vw] sm:text-[11vw] md:text-[8.5vw] lg:text-[7.2vw]"
        style={{ fontFamily: "Poppins" }}
      >
        <span className="inline-block scale-x-[1.0] sm:scale-x-[1.05]">
          UTKARSH
        </span>
      </h1>

      <h2
        className="text-white font-extrabold leading-[0.98] mt-2
                   text-[19vw] sm:text-[10.5vw] md:text-[8vw] lg:text-[6.8vw]"
        style={{ fontFamily: "Poppins" }}
      >
        <span className="inline-block scale-x-[1.04] sm:scale-x-[1.08]">
          fest&apos;26
        </span>
      </h2>

      <p
        className="mt-3 text-white/90 font-medium text-lg sm:text-xl md:text-2xl"
        style={{ fontFamily: "Milonga" }}
      >
        26-28 February 2026
      </p>
    </div>
  );
};

export default HeroTitle;
