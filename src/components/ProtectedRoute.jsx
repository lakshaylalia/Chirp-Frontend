import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../features/authenication/useUser";
import Spinner from "./Spinner"

function ProtectedRoute() {
    const { user, isLoading, isError } = useUser();

    if (isLoading) {
        return <Spinner/>;
    }

    if (isError || !user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
