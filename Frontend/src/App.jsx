import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./component/Layout/Layout";
import Home from "./pages/Home";
<<<<<<< HEAD
import AboutUs from "./component/AboutUs";
=======
import "./app.css"
>>>>>>> 208c8c2baf1f7e3041b7f543e8574d6426dd93d7
import SponsorshipForm from "./component/SponsorshipForm";
import FoodStallForm from "./component/FoodStallForm";

import LoginPage from "./component/Auth/LoginPage";
import RegistrationPage from "./component/Auth/RegistrationPage";
<<<<<<< HEAD
import AdminDashboard from "./pages/AdminDashboard";
=======
import AdminLogin from "./admin/pages/AdminLogin";
import AdminRegister from "./admin/pages/AdminRegister";
import AdminRoutes from "./admin/routes/AdminRoutes";
>>>>>>> 208c8c2baf1f7e3041b7f543e8574d6426dd93d7

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Website pages with Navbar */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="sponsorship_form" element={<SponsorshipForm />} />
          <Route path="food_stall_form" element={<FoodStallForm />} />
        </Route>
        <Route path="/admin" element={<AdminLogin/>}></Route>
        <Route path="/admin/register" element={<AdminRegister/>}></Route>

        {/* Auth pages (no Navbar) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />

<<<<<<< HEAD
        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
=======

        {/* Admin Routes (Isolated) */}
         <Route path="/admin/*" element={<AdminRoutes />} />
>>>>>>> 208c8c2baf1f7e3041b7f543e8574d6426dd93d7
      </Routes>
    </BrowserRouter>
  );
}

export default App;
