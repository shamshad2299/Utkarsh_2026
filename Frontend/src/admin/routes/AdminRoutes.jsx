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
        <Route path="users" element={<Alluser />} />
        <Route path="users/update/:id" element={<EditUser />} />

        <Route path="events" element={<AllEventCategory />} />
        <Route path="event-category/add" element={<AddEventCategory />} />
        <Route path="sub-events" element={<SubCategoryList />} />

        <Route
          path="sub-events/add"
          element={<AddSubcategoryPage />}
      />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
