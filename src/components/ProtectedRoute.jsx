import cookies from 'js-cookie';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoutes() {
const token = cookies.get("AUTH_TOKEN");

    if (!token) return <Navigate to="/login" replace />;
    return <Outlet />;

}


