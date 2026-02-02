import { useEffect, useState } from "react";
import { 
  Users, 
  Settings, 
  Calendar, 
  Home, 
  FileText, 
  BarChart3,
  Bell,
  Search,
  ChevronDown,
  Menu,
  X
} from "lucide-react";
import Navbar from "./Header/Navbar";
import { useAdmin } from "../store/AdminContext";
import StatsCard from "./components/StatsCard";
import RecentActions from "./components/RecentActions";
import QuickActions from "./components/QuickActions";
import DataTable from "./components/DataTable";
import axios from "axios";

export default function AdminDashboard() {
  const { admin } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  
  // Users state with pagination
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    role: "",
    city: "",
    search: ""
  });

  // Sample data
  const statsData = [
    { title: "Total Users", value: "1,245", change: "+12%", icon: <Users className="h-5 w-5" />, color: "bg-blue-500" },
    { title: "Events", value: "56", change: "+5%", icon: <Calendar className="h-5 w-5" />, color: "bg-green-500" },
    { title: "Registrations", value: "2,345", change: "+23%", icon: <FileText className="h-5 w-5" />, color: "bg-purple-500" },
    { title: "Teams", value: "189", change: "+8%", icon: <Users className="h-5 w-5" />, color: "bg-orange-500" },
  ];

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { id: "users", label: "Users", icon: <Users size={20} /> },
    { id: "category", label: "Event category", icon: <Calendar size={20} /> },
    { id: "subCategory", label: "Sub Event category", icon: <Calendar size={20} /> },
    { id: "events", label: "Events", icon: <Calendar size={20} /> },
    { id: "registrations", label: "Registrations", icon: <FileText size={20} /> },
    { id: "teams", label: "Teams", icon: <Users size={20} /> },
    { id: "team_member", label: "Team Members", icon: <Users size={20} /> },
    { id: "accommodation", label: "Accommodation", icon: <Home size={20} /> },
    { id: "reports", label: "Reports", icon: <BarChart3 size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  // Fetch users with pagination
  const getAllUsers = async (page = 1, limit = 10, role = "", city = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      if (role) params.append("role", role);
      if (city) params.append("city", city);

      const res = await axios.get(`http://localhost:7000/api/v1/auth/users?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data.success) {
        setUsers(res.data.data);
        setPagination({
          page: res.data.meta.page,
          limit: res.data.meta.limit,
          total: res.data.meta.total,
          totalPages: res.data.meta.totalPages
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (activeSection === "users") {
      getAllUsers();
    }
  }, [activeSection]);

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Apply filters
  const applyFilters = () => {
    getAllUsers(1, pagination.limit, filters.role, filters.city);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      role: "",
      city: "",
      search: ""
    });
    getAllUsers(1, pagination.limit);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    getAllUsers(newPage, pagination.limit, filters.role, filters.city);
  };

  // Handle refresh
  const handleRefresh = () => {
    getAllUsers(pagination.page, pagination.limit, filters.role, filters.city);
  };

  // Handle user actions
  const handleUserAction = async (action, userIds) => {
    try {
      const token = localStorage.getItem("adminToken");
      
      switch(action) {
        case 'block':
          // API call to block users
          await Promise.all(
            userIds.map(id => 
              axios.put(`http://localhost:7000/api/v1/auth/users/${id}/block`, {}, {
                headers: { Authorization: `Bearer ${token}` }
              })
            )
          );
          break;
          
        case 'unblock':
          // API call to unblock users
          await Promise.all(
            userIds.map(id => 
              axios.put(`http://localhost:7000/api/v1/auth/users/${id}/unblock`, {}, {
                headers: { Authorization: `Bearer ${token}` }
              })
            )
          );
          break;
          
        case 'delete':
          // API call to delete users
          await Promise.all(
            userIds.map(id => 
              axios.delete(`http://localhost:7000/api/v1/auth/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
              })
            )
          );
          break;
      }
      
      // Refresh user list
      getAllUsers(pagination.page, pagination.limit, filters.role, filters.city);
      
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsData.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Registration Trends</h3>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                  <p className="text-gray-500">Chart will be displayed here</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pending Approvals</span>
                    <span className="font-semibold text-yellow-600">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Events</span>
                    <span className="font-semibold text-green-600">18</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Team Registrations</span>
                    <span className="font-semibold text-blue-600">156</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Actions and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RecentActions />
              </div>
              <div>
                <QuickActions />
              </div>
            </div>
          </>
        );
      
      case "users":
        return (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={filters.role}
                    onChange={(e) => handleFilterChange("role", e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="">All Roles</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="volunteer">Volunteer</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <select
                    value={filters.city}
                    onChange={(e) => handleFilterChange("city", e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="">All Cities</option>
                    <option value="Lucknow">Lucknow</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Mumbai">Mumbai</option>
                    {/* Add more cities as needed */}
                  </select>
                </div>
                
                <div className="flex gap-2 items-end">
                  <button
                    onClick={applyFilters}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Apply
                  </button>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* DataTable with pagination props */}
            <DataTable 
              type="users" 
              users={users}
              loading={loading}
              pagination={pagination}
              onPageChange={handlePageChange}
              onRefresh={handleRefresh}
              onBulkAction={handleUserAction}
              onAddNew={() => console.log("Add new user")}
            />
            
            {/* Server-side Pagination Controls */}
            {users.length > 0 && (
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1 rounded ${pagination.page === pageNum ? 'bg-blue-500 text-white' : 'border'}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      
      case "events":
        return <DataTable type="events" />;
      
      default:
        return (
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1).replace(/_/g, ' ')}
            </h2>
            <p className="text-gray-600">Content for {activeSection.replace(/_/g, ' ')} section will be displayed here.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <Navbar admin={admin} />

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 fixed h-[calc(100vh-64px)] z-40`}>
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              {sidebarOpen && <h2 className="text-xl font-bold text-gray-800">UTKARSH 2025</h2>}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
          
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'} gap-3 px-4 py-3 rounded-lg transition-colors ${activeSection === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    {item.icon}
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {sidebarOpen && (
            <div className="absolute bottom-0 w-full p-4 border-t">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  {admin?.name?.charAt(0) || "A"}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{admin?.name || "Admin"}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <ChevronDown size={16} className="text-gray-500" />
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300 p-6`}>
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 capitalize">
                {activeSection === "dashboard" ? "Dashboard Overview" : activeSection.replace(/_/g, ' ')}
              </h1>
              <p className="text-gray-600 mt-1">
                {activeSection === "dashboard" 
                  ? "Welcome back! Here's what's happening with UTKARSH 2025." 
                  : `Manage all ${activeSection.replace(/_/g, ' ')} related activities`
                }
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>

          {/* Content Area */}
          {renderContent()}
        </main>
      </div>
    </div>
  );
}