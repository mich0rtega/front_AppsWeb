import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext"; 

export default function AuthRoutes({ children }: { children: JSX.Element }) {
    const { token } = useAuth();
    return token ? children : <Navigate to="/login" replace />;
}
