import Login from "./component/login/Login";
import Register from "./component/register/Register";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicAdminRoute from "./routes/PublicAdminRoutes";
import AdminRoute from "./routes/AdminRoutes";
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import AdminLogin from "./AdminDashboard/adminLogin/AdminLogin";
import AdminRegister from "./AdminDashboard/adminLogin/AdminRegister";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<Home />} />

          {/* Admin Login */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
        {/* <Register /> */}
      </BrowserRouter>
    </>
  );
}

export default App;
