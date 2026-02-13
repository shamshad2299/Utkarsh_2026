import { useState, useEffect } from "react";
import { Plus, Menu, X, ChevronRight } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const Section = ({ title, children }) => (
  <div className="mt-4">
    <div className="bg-blue-500 text-white text-xs font-bold px-3 py-2 uppercase">
      {title}
    </div>
    <div className="bg-white text-gray-800 border border-gray-200 flex flex-col gap-3">
      {children}
    </div>
  </div>
);

const Item = ({ label, to, addTo }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center px-3 py-2 border-b last:border-b-0 text-sm font-medium cursor-pointer hover:underline hover:bg-yellow-50">
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex-1 ${isActive ? "text-blue-700 font-semibold" : "text-gray-800"}`
        }
      >
        {label}
      </NavLink>

      {addTo && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(addTo);
          }}
          className="hover:text-green-800 cursor-pointer bg-teal-700 z-10 text-white rounded-full p-1"
          title={`Add ${label}`}
        >
          <Plus size={16} />
        </button>
      )}
    </div>
  );
};

const AdminSidebar = () => {
  const [open, setOpen] = useState(false);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return (
    <>
      {/* Mobile Header with Menu Button */}
      <div className="md:hidden flex items-center justify-between bg-gradient-to-r from-teal-700 to-teal-800 text-white px-4 py-3 fixed top-0 left-0 right-0 z-30 shadow-lg">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setOpen(true)}
            className="p-2 hover:bg-teal-600 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <span className="font-bold text-lg">UTKARSH Admin</span>
        </div>
        <div className="text-sm bg-teal-600 px-3 py-1 rounded-full">
          v1.0
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed z-50 top-0 left-0 h-screen w-80 bg-gradient-to-b from-gray-50 to-white shadow-2xl
          transform transition-transform duration-300 ease-in-out
          overflow-y-auto overflow-x-hidden
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:shadow-none md:w-72
        `}
      >
        {/* Sidebar Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-teal-700 to-teal-800 text-white px-4 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1 rounded-lg">
              <ChevronRight className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">UTKARSH Admin</span>
          </div>
          <button 
            className="md:hidden p-2 hover:bg-teal-600 rounded-lg transition-colors"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search menu items..."
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50"
          />
        </div>

        {/* Navigation Sections */}
        <div className="p-3 pb-8">
          <Section title="Authentication and Authorization">
            <Item label="Groups" to="/admin/dashboard/groups" />
          </Section>

          <Section title="Website">
            <Item
              label="Accommodation details"
              to="/admin/dashboard/accommodation"
              addTo="/admin/dashboard/accommodation/add"
            />

            <Item
              label="Configurations"
              to="/admin/dashboard/configurations"
              addTo="/admin/dashboard/configurations/add"
            />

            <Item
              label="Event categories"
              to="/admin/dashboard/events"
              addTo="/admin/dashboard/event-category/add"
            />

            <Item
              label="Events"
              to="/admin/dashboard/events-list"
              addTo="/admin/dashboard/events/add"
            />

            <Item
              label="Solo event registrations"
              to="/admin/dashboard/solo-registrations"
              addTo="/admin/dashboard/solo-registrations/add"
            />

            <Item
              label="Sub events categories"
              to="/admin/dashboard/sub-events"
              addTo="/admin/dashboard/sub-events/add"
            />

            <Item
              label="Team event registrations"
              to="/admin/dashboard/team-registrations"
              addTo="/admin/dashboard/team-registrations/add"
            />

            <Item
              label="Team members"
              to="/admin/dashboard/team-members"
              addTo="/admin/dashboard/team-members/add"
            />

            <Item label="Users" to="/admin/dashboard/users" />

            <Item
              label="Website teams"
              to="/admin/dashboard/website-team"
              addTo="/admin/dashboard/website-team/add"
            />

            <Item
              label="Sponsorship Requests"
              to="/admin/dashboard/sponsorship-requests"
            />

            <Item
              label="Food Stall Requests"
              to="/admin/dashboard/foodstall-requests"
            />
          </Section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 text-center text-xs text-gray-500">
          © 2026 UTKARSH Admin Panel
        </div>
      </aside>

      {/* Main Content Spacer for Mobile */}
      <div className="md:hidden h-16" />
    </>
  );
};

export default AdminSidebar;