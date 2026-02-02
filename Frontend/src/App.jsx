import { useState } from "react";
import Home from "./pages/Home";
import RegistrationPage from "./component/Auth/RegistrationPage";
import LoginPage from "./component/Auth/LoginPage";
import FoodStallForm from "./component/FoodStallForm";
import SponsorshipForm from "./component/SponsorshipForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [page, setPage] = useState("home");

  return (
    <>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
