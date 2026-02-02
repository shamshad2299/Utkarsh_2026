const HeroTitle = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8" style={{ fontFamily: "Poppins" }}>
      {/* Container for better control */}
      <div className="max-w-2xl mx-auto md:mx-0">
        {/* Subtitle */}
        <p className="text-base xs:text-lg sm:text-xl md:text-2xl font-light mb-3 sm:mb-4 tracking-wide">
          Virasat se vikas tak
        </p>

        {/* Main Title */}
        <h1 className="text-[56px] xs:text-[64px] sm:text-[80px] md:text-[100px] lg:text-[120px] xl:text-[140px] 2xl:text-[160px] font-black uppercase leading-[0.8] sm:leading-[0.85] tracking-tighter mb-6 sm:mb-8 md:mb-10">
          <span className="block">UTKARSH</span>
          <span className="lowercase block mt-2 sm:mt-4">fest'26</span>
        </h1>

        {/* Date */}
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight">
          26-28 February 2026
        </p>
      </div>
    </div>
  );
};

export default HeroTitle;