const HeroTitle = () => {
  return (
    <div className="w-full max-w-5xl flex flex-col  md:items-start ">
      <div className="max-w-xl lg:max-w-2xl text-center md:text-left">
        
        {/* Tagline */}
        <p
          className="text-[#e7e7fb] font-regular tracking-wide leading-none mb-2 text-[36px]"
          style={{ fontFamily: "Milonga" }}
        >
          Virasat se vikas tak
        </p>

        {/* UTKARSH */}
        <h1
          className="text-[#e0c3f2] font-black leading-[1] tracking-normal text-[clamp(3.5rem,8vw,120px)]"
          style={{ fontFamily: "Poppins" }}
        >
          UTKARSH
        </h1>

        {/* fest'26 */}
        <h2
          className="text-[#e0c3f2] font-black leading-[1] mt-2 text-[clamp(2.8rem,7vw,6rem)]"
          style={{ fontFamily: "Poppins" }}
        >
          Fest&apos;26
        </h2>

        {/* Date */}
        <p
          className="mt-4 text-[#e7e7fb] font-regular text-[36px] sm:text-xl md:text-2xl"
          style={{ fontFamily: "Milonga" }}
        >
          26–28 February 2026
        </p>
      </div>
    </div>
  );
};

export default HeroTitle;
