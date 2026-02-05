import { Link, useNavigate } from "react-router-dom";
import { 
  LogOut, 
  Home, 
  LayoutDashboard,
  User,
  Bell,
  Settings,
  ChevronDown,
  Search,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  // Mock notifications
  const notifications = [
    { id: 1, title: "New user registered", time: "5 min ago", read: false },
    { id: 2, title: "Payment received", time: "1 hour ago", read: true },
    { id: 3, title: "System update", time: "2 hours ago", read: true },
  ];

  return (
    <>
      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 h-16 bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 shadow-sm">
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

            {/* Search Bar - Desktop */}
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-48 lg:w-64 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Right Section */}
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

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1.5 sm:p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 bg-red-500 text-[10px] sm:text-xs text-white rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-40 overflow-hidden">
                    <div className="p-3 sm:p-4 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Notifications</h3>
                      <p className="text-xs text-gray-500 mt-1">{notifications.length} new alerts</p>
                    </div>
                    <div className="max-h-80 sm:max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 sm:p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 ${
                            !notification.read ? "bg-amber-50" : ""
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <p className="text-sm font-medium text-gray-800">
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="h-2 w-2 bg-amber-500 rounded-full flex-shrink-0 mt-1"></span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-gray-50 border-t border-gray-100">
                      <button className="w-full text-center text-sm font-medium text-amber-600 hover:text-amber-700">
                        View all notifications
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 sm:space-x-3 p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="h-7 w-7 sm:h-8 sm:w-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                  <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate max-w-[80px] lg:max-w-none">Admin User</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 truncate max-w-[80px] lg:max-w-none">Super Admin</p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500 hidden sm:block" />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-xl shadow-2xl border border-gray-200 z-40 overflow-hidden">
                    <div className="p-3 sm:p-4 border-b border-gray-100">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">Admin User</p>
                          <p className="text-xs text-gray-500 truncate">admin@utkarsh.com</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <Link
                        to="/admin/profile"
                        className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span className="text-sm">My Profile</span>
                      </Link>
                      
                      <Link
                        to="/admin/settings"
                        className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span className="text-sm">Settings</span>
                      </Link>
                    </div>
                    
                    <div className="border-t border-gray-100 p-2">
                      <button
                        onClick={logout}
                        className="flex items-center justify-center space-x-2 w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-600 rounded-lg hover:from-red-100 hover:to-red-200 transition-all duration-200 group"
                      >
                        <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:rotate-12 transition-transform" />
                        <span className="font-medium text-sm sm:text-base">Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden px-4 sm:px-6 py-2 border-t border-gray-100 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search dashboard..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm"
            />
          </div>
        </div>
      </nav>

      {/* Mobile Side Menu */}
      {showMobileMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
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
              
              <Link
                to="/admin/profile"
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                onClick={() => setShowMobileMenu(false)}
              >
                <User className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-800">My Profile</span>
              </Link>
              
              <Link
                to="/admin/settings"
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                onClick={() => setShowMobileMenu(false)}
              >
                <Settings className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-800">Settings</span>
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
            
            {/* Quick Stats for Mobile */}
            <div className="px-4 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Quick Stats</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-amber-50 rounded-lg p-2">
                  <p className="text-xs text-amber-700">Notifications</p>
                  <p className="text-lg font-bold text-amber-800">3</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-2">
                  <p className="text-xs text-blue-700">Online</p>
                  <p className="text-lg font-bold text-blue-800">24</p>
                </div>
              </div>
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