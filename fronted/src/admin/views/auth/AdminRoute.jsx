import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const adminToken = localStorage.getItem("admintoken");

  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
