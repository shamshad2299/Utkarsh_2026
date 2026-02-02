import { useState } from "react";
import Home from "./pages/Home";
import RegistrationPage from "./component/RegistrationPage";
import LoginPage from "./component/LoginPage";
import FoodStallForm from "./component/FoodStallForm";
import SponsorshipForm from "./component/SponsorshipForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [page, setPage] = useState("home");

  // if (page === "login") return <LoginPage />;
  // if (page === "register") return <RegistrationPage />;
  // if (page === "foodstall") return <FoodStallForm />;
  // if (page === "sponsorship") return <SponsorshipForm />;

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
