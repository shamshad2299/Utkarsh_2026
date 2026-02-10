import HeroTitle from "./HeroTitle";
import CountdownTimer from "./CountdownTimer";
import RegisterButton from "./RegisterButton";

const HeroSection = ({ onRegister }) => {
  const token = localStorage.getItem("accessToken");

  return (
    <main
      className="flex-1 flex flex-col justify-center relative z-10 px-4 sm:px-8 lg:px-12"
      style={{
        paddingTop: "clamp(120px, 9vw, 170px)",
        paddingBottom: "clamp(170px, 16vw, 230px)",
      }}
    >
      <div
        className="w-full flex flex-col md:flex-row justify-between items-center md:items-center"
        style={{ gap: "clamp(22px, 4vw, 40px)" }}
      >
        <div className="w-full md:w-auto text-center md:text-left">
          <HeroTitle />
        </div>

        <div
          className="w-full md:w-auto flex flex-col items-center md:items-end min-h-[220px] sm:min-h-[260px]"
          style={{ gap: "clamp(18px, 3vw, 48px)" }}
        >
          <CountdownTimer />

          {!token ? (
            <RegisterButton onClick={onRegister} />
          ) : (
            <div style={{ width: "clamp(240px, 28vw, 340px)", height: "80px" }} />
          )}
        </div>
      </div>
    </main>
  );
};

export default HeroSection;
