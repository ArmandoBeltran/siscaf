import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "./userContext";

function ProtectedRoute() {
    const { user, loading } = useContext(UserContext);

    if (loading) {
        return <div>Cargando sesión...</div>; // o un spinner
    }

    if (!user) {
        return <Navigate to="/404" />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
