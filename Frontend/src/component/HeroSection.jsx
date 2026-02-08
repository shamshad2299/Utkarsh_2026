import HeroTitle from "./HeroTitle";
import CountdownTimer from "./CountdownTimer";
import RegisterButton from "./RegisterButton";

const HeroSection = ({ onRegister }) => {
  const token = localStorage.getItem("accessToken");

  return (
    <main className="flex-1 flex flex-col justify-center relative z-10 px-4 sm:px-8 lg:px-12 pt-32 sm:pt-36 pb-36 sm:pb-56">
      <div className="w-full flex flex-col md:flex-row justify-between items-center md:items-center gap-10 md:gap-0">
        <div className="w-full md:w-auto text-center md:text-left">
          <HeroTitle />
        </div>

        {/* ✅ height fixed */}
        <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-8 sm:gap-12 min-h-[220px] sm:min-h-[260px]">
          <CountdownTimer />

          {!token ? (
            <RegisterButton onClick={onRegister} />
          ) : (
            <div className="min-w-[320px] h-[80px]" />
          )}
        </div>
      </div>
    </main>
  );
};

export default HeroSection;
