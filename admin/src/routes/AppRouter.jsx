import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "../pages/AdminLogin";
import AdminRegister from "../pages/AdminRegister";
import AdminDashboard from "../pages/AdminDashboard";
import AdminProtectedRoute from "../middleware/AdminProtectedRoute";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* public */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />

        {/* protected */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
