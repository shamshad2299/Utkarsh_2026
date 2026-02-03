import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./component/Layout/Layout";
import Home from "./pages/Home";
import "./app.css"
import SponsorshipForm from "./component/SponsorshipForm";
import FoodStallForm from "./component/FoodStallForm";
import LoginPage from "./component/Auth/LoginPage";
import RegistrationPage from "./component/Auth/RegistrationPage";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminRegister from "./admin/pages/AdminRegister";
import AdminRoutes from "./admin/routes/AdminRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout with Navbar */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="sponsorship_form" element={<SponsorshipForm />} />
          <Route path="food_stall_form" element={<FoodStallForm />} />
        </Route>
        <Route path="/admin" element={<AdminLogin/>}></Route>
        <Route path="/admin/register" element={<AdminRegister/>}></Route>

        {/* Auth pages (no navbar if you want) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />


        {/* Admin Routes (Isolated) */}
         <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
