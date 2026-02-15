import { Link, useNavigate } from "react-router-dom";
import { 
  LogOut, 
  Home, 
  LayoutDashboard,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className="sticky top-0  h-16 bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 shadow-sm">
        <div className="h-full px-4 sm:px-6 flex items-center justify-between">
          
          {/* Left Section */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              {showMobileMenu ? (
                <X className="h-5 w-5 text-gray-600" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600" />
              )}
            </button>

            {/* Dashboard Title */}
            <div className="flex items-center space-x-2">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
                <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-amber-700 to-amber-800 bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>
          </div>

          {/* Right Section - Simplified */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Website Link - Desktop */}
            <Link
              to="/"
              className="hidden md:flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg hover:from-amber-100 hover:to-amber-200 transition-all duration-200 group"
            >
              <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600 group-hover:text-amber-700" />
              <span className="text-xs sm:text-sm font-medium text-amber-700 group-hover:text-amber-800 hidden lg:inline">
                View Website
              </span>
              <span className="text-xs sm:text-sm font-medium text-amber-700 group-hover:text-amber-800 lg:hidden">
                Website
              </span>
            </Link>

            {/* Logout Button - Desktop */}
            <button
              onClick={logout}
              className="hidden md:flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-600 rounded-lg hover:from-red-100 hover:to-red-200 transition-all duration-200 group"
            >
              <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:rotate-12 transition-transform" />
              <span className="font-medium text-xs sm:text-sm">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Side Menu */}
      {showMobileMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black/40  md:hidden"
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="fixed top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40 md:hidden animate-slideDown">
            <div className="px-4 py-3 space-y-1">
              <Link
                to="/"
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                onClick={() => setShowMobileMenu(false)}
              >
                <Home className="h-4 w-4 text-amber-600" />
                <span className="font-medium text-gray-800">View Website</span>
              </Link>
              
              <button
                onClick={() => {
                  logout();
                  setShowMobileMenu(false);
                }}
                className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors duration-150 text-left"
              >
                <LogOut className="h-4 w-4 text-red-600" />
                <span className="font-medium text-red-600">Logout</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default AdminNavbar;