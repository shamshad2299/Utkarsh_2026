import { Navigate } from "react-router-dom";
import { useAuth } from "../store/ContextStore";

const PublicAdminRoute = ({ children }) => {
  const { user } = useAuth();

  // admin already logged in → dashboard
  if (user?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // logged-in but not admin → home
  if (user && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // user nahi hai → admin login allowed
  return children;
};

export default PublicAdminRoute;
