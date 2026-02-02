import { Navigate } from "react-router-dom";
import { useAdmin } from "../store/AdminContext";

const AdminRoute = ({ children }) => {
  const { admin } = useAdmin();

  if (!admin) return <Navigate to="/admin" replace />;

  if (admin.adminStatus !== "active")
    return <Navigate to="/admin" replace />;

  return children;
};

export default AdminRoute;
