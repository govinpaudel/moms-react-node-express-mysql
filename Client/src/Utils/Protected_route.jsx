import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const Protected_route = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default Protected_route;
