import { useState } from "react";
import { Plus, Menu, X } from "lucide-react";
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

  return (
    <>
      <div className="md:hidden flex items-center justify-between bg-teal-700 text-yellow-300 px-4 py-3">
        <button onClick={() => setOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed z-50 top-0 left-0 h-screen w-72 bg-gray-100 border-r
          transform transition-transform duration-300
          overflow-y-auto overflow-x-hidden
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static
        `}
      >
        <div className="flex items-center justify-between bg-teal-700 text-yellow-300 text-lg font-bold px-4 py-3">
          UTKARSH Administration
          <button className="md:hidden" onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="p-3">
          <input
            type="text"
            placeholder="Start typing to filter..."
            className="w-full px-3 py-2 text-sm rounded focus:outline-none focus:ring border-2 border-gray-600 text-blue-900"
          />
        </div>

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
            to="/admin/dashboard/teams"
            addTo="/admin/dashboard/teams/add"
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
      </aside>
    </>
  );
};

export default AdminSidebar;
