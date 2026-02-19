import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const LogoutButton = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleClick = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <button
      onClick={handleClick}
      className="flex  items-center justify-between bg-white rounded-2xl shadow-xl hover:scale-105 transition-transform active:scale-95 cursor-pointer"
      style={{
        paddingLeft: "clamp(18px, 3vw, 40px)",
        paddingRight: "clamp(12px, 1.6vw, 16px)",
        paddingTop: "clamp(12px, 1.8vw, 16px)",
        paddingBottom: "clamp(12px, 1.8vw, 16px)",
        minWidth: "clamp(200px, 28vw, 340px)",
      }}
    >
      <span
        className="text-red-600 text-lg sm:text-xl md:text-2xl font-semibold"
        style={{ fontFamily: "Milonga" }}
      >
        Logout
      </span>

      <div
        className="bg-red-600 hover:bg-red-700 text-white 
                   rounded-full flex items-center justify-center
                   w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
                   transition-colors duration-300"
      >
        <LogOut className="w-3/5 h-3/5" strokeWidth={2.5} />
      </div>
    </button>
  );
};

export default LogoutButton;
