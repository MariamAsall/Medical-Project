import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles, children }) => {

    const { role } = useSelector((state) => state.auth);

    const token = localStorage.getItem("access_token");
    const roleFromStorage = localStorage.getItem("role");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(roleFromStorage)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;