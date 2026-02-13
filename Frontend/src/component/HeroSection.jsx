import HeroTitle from "./HeroTitle";
import CountdownTimer from "./CountdownTimer";
import RegisterButton from "./RegisterButton";
import LogoutButton from "./Logout";

const HeroSection = ({ onRegister }) => {
  const token = localStorage.getItem("accessToken");

  return (
    <section className="relative z-10 md:min-h-[calc(100vh-145px)] sm:min-h-[calc(100vh-105px)] max-sm:min-h-[calc(100vh-100px)] md:mt-12 sm:mt-5">
      
      <div className=" px-12 mx-auto flex flex-col md:flex-row items-center justify-between md:gap-12 sm:gap-4 gap-3">
        
        {/* Left Content */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-start">
          <HeroTitle />
        </div>

        {/* Right Content */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-end md:gap-10 sm:gap-4 gap-8">
          
          <CountdownTimer />

          {!token ? (
            <RegisterButton onClick={onRegister} />
          ) : (
            <LogoutButton />
          )}

        </div>
      </div>

    </section>
  );
};

export default HeroSection;
