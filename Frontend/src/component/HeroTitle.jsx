const HeroTitle = () => {
  return (
    <div className="w-full max-w-5xl flex flex-col  md:items-start ">
      <div className="max-w-xl lg:max-w-2xl text-center md:text-left">
        
        {/* Tagline */}
        <p
          className="text-purple-200 tracking-wide leading-none mb-2 
                     text-2xl sm:text-3xl md:text-4xl"
          style={{ fontFamily: "Milonga" }}
        >
          Virasat se vikas tak
        </p>

        {/* UTKARSH */}
        <h1
          className="text-white font-black leading-none tracking-tight
                     text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
          style={{ fontFamily: "Poppins" }}
        >
          UTKARSH
        </h1>

        {/* fest'26 */}
        <h2
          className="text-white font-black leading-none mt-2
                     text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ fontFamily: "Poppins" }}
        >
          fest&apos;26
        </h2>

        {/* Date */}
        <p
          className="mt-4 text-white/90 font-medium
                     text-base sm:text-lg md:text-xl lg:text-2xl"
          style={{ fontFamily: "Milonga" }}
        >
          26–28 February 2026
        </p>
      </div>
    </div>
  );
};

export default HeroTitle;
