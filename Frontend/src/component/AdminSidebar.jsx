const AdminSidebar = () => {
  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-5 text-xl font-bold border-b border-gray-700">
        Fest Admin
      </div>

      <nav className="flex-1 p-4 space-y-3">
        <div className="cursor-pointer hover:text-blue-400">
          Dashboard
        </div>
        <div className="cursor-pointer hover:text-blue-400">
          Events
        </div>
        <div className="cursor-pointer hover:text-blue-400">
          Registrations
        </div>
        <div className="cursor-pointer hover:text-blue-400">
          Results
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;
