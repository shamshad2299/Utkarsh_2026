import { Routes, Route } from "react-router-dom";
import WebsiteTeamList from "../components/WebsiteTeam/WebsiteTeamList";
import WebsiteTeamForm from "../components/WebsiteTeam/WebsiteTeamForm";

const WebsiteTeamPage = () => {
  return (
    <Routes>
      <Route index element={<WebsiteTeamList />} />
      <Route path="add" element={<WebsiteTeamForm />} />
    </Routes>
  );
};

export default WebsiteTeamPage;
