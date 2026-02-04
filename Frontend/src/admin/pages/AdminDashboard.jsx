import AdminSidebar from "../../component/AdminSidebar";
import AdminNavbar from "../../component/AdminNavbar";
import DashboardCard from "../../component/DashboardCard";

const AdminDashboard = () => {
  return (
    <div className="flex bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main area */}
      <div className="flex-1 min-h-screen">
        <AdminNavbar />

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard title="Total Events" value="12" />
          <DashboardCard title="Total Registrations" value="340" />
          <DashboardCard title="Results Published" value="8" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
