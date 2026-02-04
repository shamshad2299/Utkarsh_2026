import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./component/Layout/Layout";
import Home from "./pages/Home";
import AboutUs from "./component/AboutUs";
import SponsorshipForm from "./component/SponsorshipForm";
import FoodStallForm from "./component/FoodStallForm";

import LoginPage from "./component/Auth/LoginPage";
import RegistrationPage from "./component/Auth/RegistrationPage";
import AdminDashboard from "./pages/AdminDashboard";

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

        {/* Auth pages (no Navbar) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
