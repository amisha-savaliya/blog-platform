import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectActiveUser } from "../features/auth/authSlice";

export default function ProtectedRoute() {
  const activeUser = useSelector(selectActiveUser);
  const { token, impersonateToken, loading } = useSelector(
    (state) => state.auth
  );

  const hasToken = token || impersonateToken;

  if (loading) return null;

  if (!hasToken) {
    return <Navigate to="/login" replace />;
  }

  if (!activeUser) {
    return null;
  }

  return <Outlet />;
}