import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./component/Layout/Layout";
import Home from "./pages/Home";
import SponsorshipForm from "./component/SponsorshipForm";
import FoodStallForm from "./component/FoodStallForm";
import AboutSection from "./pages/AboutSection";


import LoginPage from "./component/Auth/LoginPage";
import RegistrationPage from "./component/Auth/RegistrationPage";

import AdminLogin from "./admin/pages/AdminLogin";
import AdminRegister from "./admin/pages/AdminRegister";
import AdminRoutes from "./admin/routes/AdminRoutes";

import ProfileDashboard from "./pages/ProfileDashboard";
import EventsPage from "./website/EventsPage/EventsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Home />} />
           <Route path="about" element={<AboutSection />} />
          <Route path="profile" element={<ProfileDashboard />} />
          <Route path="sponsorship_form" element={<SponsorshipForm />} />
          <Route path="food_stall_form" element={<FoodStallForm />} />
           <Route path="events/category/:categoryId" element={<EventsPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />

        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        {/* admin routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
