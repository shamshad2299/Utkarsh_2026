const HeroTitle = () => {
  return (
    <div className="w-full flex flex-col md:items-start items-center">
      <div className="w-full text-center md:text-left">

        {/* Tagline */}
        <p
          className="text-[#E7E7FB] font-regular tracking-wide leading-none mb-2 text-[18px] sm:text-[20px] md:text-[26px]"
          style={{ fontFamily: "Milonga" }}
        >
          Virasat se vikas tak
        </p>

        {/* UTKARSH */}
        <h1
          className=" text-[#E0C3F2] font-[1000] leading-[0.95] tracking-tight text-[clamp(2.8rem,8vw,96px)]"
          style={{ fontFamily: "Poppins" }}
        >
          UTKARSH
        </h1>

        {/* Fest'26 */}
        <h2
          className="text-[#E0C3F2] font-[1000] leading-[0.95] tracking-tight text-[clamp(2.8rem,8vw,96px)]"
          style={{ fontFamily: "Poppins" }}
        >
          Fest&apos;26
        </h2>

        {/* Date */}
        <p
          className="mt-2 text-[#e7e7fb] font-medium text-[16px] sm:text-[18px] md:text-[22px]"
          style={{ fontFamily: "Milonga" }}
        >
          26–28 February 2026
        </p>
      </div>
    </div>
  );
};

export default HeroTitle;
