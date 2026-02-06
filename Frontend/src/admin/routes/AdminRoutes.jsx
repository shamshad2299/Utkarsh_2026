import { Routes, Route } from "react-router-dom";
import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard";
import AdminProtectedRoute from "../middlewares/AdminProtectedRoute";
import DashboardCard from "../components/DashboardCard";
import Alluser from "../components/Alluser";
import EditUser from "../components/UserDetail/EditUser";
import AddEventCategory from "../components/Event/Category/AddEventCategory";
import AllEventCategory from "../components/Event/Category/AllEventCategory";
import SubCategoryList from "../components/Event/SubCategory/SubCategoryList";
import AddSubcategoryPage from "../components/Event/SubCategory/AddSubcategory";
import Accommodation from "../components/Accommodation/Accommodation";
import AddUser from "../components/UserDetail/AddUser";
import AddTeam from "../components/Team_Management/AddTeam";
import Team_Register from "../components/Team_Management/Team_Register";
import Solo_Registration from "../components/Solo_Registartion/Add_Solo_Registration";
import AddEvent from "../components/Event/AddEvent";
import Add from "../components/Configuration/Add";
import Add_Accommodation from "../components/Accommodation/Add";
import Configuration from "../components/Configuration/Configuration";
import Event_List from "../components/Event/Event_List";
import SoloRegistrion from "../components/Solo_Registartion/SoloRegistrion";
import Add_Solo_Registration from "../components/Solo_Registartion/Add_Solo_Registration";
import EditEvent from "../components/Event/EditEvent";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />

      <Route
        path="dashboard"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      >
        <Route
          index
          element={<DashboardCard title="Total Events" value="12" />}
        />
         {/* User Routes */}
        <Route path="users" element={<Alluser />} />
        <Route path="users/update/:id" element={<EditUser />} />
        <Route path="users/add" element={<AddUser />} />

        {/* event Category  Routes*/}
        <Route path="events" element={<AllEventCategory />} />
        <Route path="event-category/add" element={<AddEventCategory />} />

         {/* event subCategory  Routes*/}
        <Route path="sub-events" element={<SubCategoryList />} />
        <Route path="sub-events/add" element={<AddSubcategoryPage />} />

        <Route path="accommodation" element={<Accommodation />} />
        <Route path="accommodation/add" element={<Add_Accommodation />} />
        
        <Route path="configurations" element={<Configuration />} />
        <Route path="configurations/add" element={<Add />} />
       
        <Route path="events-list" element={<Event_List />} />
        <Route path="events/add" element={<AddEvent />} />
        <Route path="edit-event/:id" element={<EditEvent />} />

        <Route path="solo-registrations" element={<Add_Solo_Registration />} />
        <Route path="solo-registrations/add" element={<Solo_Registration />} />

        <Route path="team-registrations" element={<Accommodation />} />
        <Route path="team-registrations/add" element={<Team_Register />} />
        
        {/* team management route */}
        <Route path="team-members" element={<Accommodation />} />
        <Route path="team-members/add" element={<AddTeam />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
