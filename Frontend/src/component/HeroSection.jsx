import HeroTitle from "./HeroTitle";
import CountdownTimer from "./CountdownTimer";
import RegisterButton from "./RegisterButton";
import LogoutButton from "./Logout";
import MonumentBottom from "../component/MonumentBottom";
import BackgroundGlow from "../component/BackgroundGlow";

const HeroSection = ({ onRegister }) => {
  const token = localStorage.getItem("accessToken");

  return (
    <section className="relative z-10 ">

        {/* Background Glow */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <BackgroundGlow />
        </div>

      <div className="px-4 sm:px-12 py-6 md:mt-[42px] lg:-mt-[0px] flex flex-col md:flex-row items-center justify-between md:gap-12 sm:gap-6 gap-6">

        {/* Left Content */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-start">
          <HeroTitle />
        </div>

        {/* Right Content */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-end md:gap-8 sm:gap-4 gap-6">

          <CountdownTimer />

          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-4 items-center">
            {!token ? (
              <RegisterButton onClick={onRegister} />
            ) : (
              <LogoutButton />
            )}
          </div>

          

        </div>
      </div>

      {/* Monument Bottom - Always bottom 0 */}
      <div className=" bottom-0 left-0 right-0 pointer-events-none z-20 ">
        <MonumentBottom />
      </div>


    </section>
  );
};

export default HeroSection;
