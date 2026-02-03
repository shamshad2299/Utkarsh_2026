import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";


const RegisterButton = ({ onClick }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={()=>navigate("/register")}
      className="
        flex items-center justify-between
        bg-white
        rounded-full
        pl-10 pr-4
        py-4
        min-w-[320px]
        shadow-xl
        hover:scale-105
        transition-transform
        active:scale-95
        cursor-pointer
      "
    >
      {/* Text */}
      <span
        className="text-[#5a2d82] text-3xl"
        style={{ fontFamily: "Milonga" }}
      >
        Register Now
      </span>

    
      <div className="bg-[#5a2d82] text-white p-4 rounded-full">
        <ArrowUpRight size={28} strokeWidth={2.5} />
      </div>
    </button>
  );
};

export default RegisterButton;
