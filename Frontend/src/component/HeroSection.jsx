import HeroTitle from "./HeroTitle";
import CountdownTimer from "./CountdownTimer";
import RegisterButton from "./RegisterButton";

const HeroSection = ({ onRegister }) => {
  return (
    <main className="flex-1 flex flex-col justify-center px-12 relative z-10 pb-56">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <HeroTitle />

        <div className="flex flex-col items-end gap-12 mt-12 md:mt-0">
          <CountdownTimer />
          <RegisterButton onClick={onRegister} />
        </div>
      </div>
    </main>
  );
};

export default HeroSection;
