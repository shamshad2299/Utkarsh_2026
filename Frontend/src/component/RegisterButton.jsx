import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RegisterButton = ({ onClick }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/register")}
      className="flex items-center justify-between bg-white rounded-full shadow-xl hover:scale-105 transition-transform active:scale-95 cursor-pointer"
      style={{
        paddingLeft: "clamp(18px, 3vw, 40px)",
        paddingRight: "clamp(12px, 1.6vw, 16px)",
        paddingTop: "clamp(12px, 1.8vw, 16px)",
        paddingBottom: "clamp(12px, 1.8vw, 16px)",
        minWidth: "clamp(240px, 28vw, 340px)",
      }}
    >
      <span
        className="text-[#5a2d82]"
        style={{
          fontFamily: "Milonga",
          fontSize: "clamp(18px, 2.6vw, 32px)",
        }}
      >
        Register Now
      </span>

      <div
        className="bg-[#5a2d82] text-white rounded-full flex items-center justify-center"
        style={{
          width: "clamp(44px, 5.2vw, 64px)",
          height: "clamp(44px, 5.2vw, 64px)",
        }}
      >
        <ArrowUpRight
          size={Math.min(30, Math.max(20, window.innerWidth * 0.018))}
          strokeWidth={2.5}
        />
      </div>
    </button>
  );
};

export default RegisterButton;
