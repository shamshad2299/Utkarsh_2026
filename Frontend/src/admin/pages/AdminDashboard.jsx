import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <div className="hidden md:block md:fixed md:top-0 md:left-0 md:h-screen md:w-72">
        <AdminSidebar />
      </div>

      <div className="md:hidden absolute top-0 left-2">
        <AdminSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-72 min-w-0">
        <AdminNavbar />

        {/* 🔥 FIXED SCROLL CONTAINER */}
        <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
