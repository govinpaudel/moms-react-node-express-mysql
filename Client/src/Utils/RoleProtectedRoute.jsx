import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const RoleProtectedRoute = ({ allowedRoles, children }) => {
    const { loggedUser, loading } = useAuth();

    if (loading) return null; // or loading spinner

    if (!loggedUser) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(loggedUser.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default RoleProtectedRoute;
