import aboutImage from "../assets/about2.webp";

const AboutUs = () => {
  return (
    <section className="relative w-full py-6 sm:py-20 flex items-center justify-center overflow-hidden text-white px-10 ">
      {/* Background Color Only */}
      <div className="absolute inset-0 bg-[#080131]" />

      <div className="relative z-10 flex items-center justify-center w-auto">
        <img src={aboutImage} alt="About-Us-image" className="" />
      </div>
      
    </section>
  );
};

export default AboutUs;
