import { useState } from "react";
import Home from "./pages/Home";
import RegistrationPage from "./component/RegistrationPage";
import LoginPage from "./component/LoginPage";
import FoodStallForm from "./component/FoodStallForm";
import SponsorshipForm from "./component/SponsorshipForm";

function App() {
  const [page, setPage] = useState("home");

  if (page === "login") return <LoginPage />;
  if (page === "register") return <RegistrationPage />;
  if (page === "foodstall") return <FoodStallForm />;
  if (page === "sponsorship") return <SponsorshipForm />;

  return (
    <Home
      onRegister={() => setPage("register")}
      onLogin={() => setPage("login")}
      onFoodStall={() => setPage("foodstall")}
      onSponsership={() => setPage("sponsorship")}
    />
  );
}

export default App;
