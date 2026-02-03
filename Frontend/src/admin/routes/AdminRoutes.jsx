import { Routes, Route } from "react-router-dom";
import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard";
import AdminProtectedRoute from "../middlewares/AdminProtectedRoute";

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
      />
    </Routes>
  );
};

export default AdminRoutes;
