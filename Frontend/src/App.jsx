import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect, Suspense, lazy } from "react";
import "./App.css";

import Layout from "./component/Layout/Layout";
import Loader from "./component/Loader/Loader";
import FooterSection from "./component/Footer";

// Lazy load components for better performance
const Home = lazy(() => import("./pages/Home"));
const SponsorshipForm = lazy(() => import("./component/SponsorshipForm"));
const FoodStallForm = lazy(() => import("./component/FoodStallForm"));
const AboutSection = lazy(() => import("./pages/AboutSection"));
const LoginPage = lazy(() => import("./component/Auth/LoginPage"));
const RegistrationPage = lazy(() => import("./component/Auth/RegistrationPage"));
const AdminLogin = lazy(() => import("./admin/pages/AdminLogin"));
const AdminRegister = lazy(() => import("./admin/pages/AdminRegister"));
const AdminRoutes = lazy(() => import("./admin/routes/AdminRoutes"));
const ProfileDashboard = lazy(() => import("./pages/ProfileDashboard"));
const AllEvents = lazy(() => import("./website/AllEvent/AllEvents"));
const EventsLayout = lazy(() => import("./website/EventLayout/EventLayout"));
const UserRegisteredEvents = lazy(() => import("./website/AllEvent/components/UserEventPage"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const EventDetailModal = lazy(() => import("./website/AllEvent/components/EventDetailModal"));

function App() {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Check if it's first visit or page reload
    const isFirstVisit = !sessionStorage.getItem('hasVisited');
    
    if (isFirstVisit) {
      // Show loader for first visit
      const timer = setTimeout(() => {
        setInitialLoading(false);
        sessionStorage.setItem('hasVisited', 'true');
      }, 2000);
      
      return () => clearTimeout(timer);
    } else {
      // Don't show loader on subsequent navigations
      setInitialLoading(false);
    }
  }, []);

  if (initialLoading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="dashboard" element={<Home />} />
            <Route path="about" element={<AboutSection />} />
            <Route path="profile" element={<ProfileDashboard />} />
            <Route path="sponsorship_form" element={<SponsorshipForm />} />
            <Route path="food_stall_form" element={<FoodStallForm />} />
            <Route path="my-registrations" element={<UserRegisteredEvents/>}/>
            <Route path="/:eventId" element={<EventDetail/>}/>

            {/* event filter routing  */}
            <Route path="events" element={<EventsLayout />}>
              <Route index element={<AllEvents />} />
              <Route path="view/:id" element={<EventDetailModal/>}/>
            </Route>
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />

          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          {/* admin routes */}
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;