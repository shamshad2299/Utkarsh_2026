import AdminSidebar from "../component/AdminSidebar";
import AdminNavbar from "../component/AdminNavbar";
import DashboardCard from "../component/DashboardCard";

const AdminDashboard = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />

      <div className="flex-1">
        <AdminNavbar />

        <main className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard title="Total Events" value="0" />
            <DashboardCard title="Total Registrations" value="0" />
            <DashboardCard title="Results Published" value="0" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
