import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import type { JSX } from "react";
import AdminAuthLoader from "./AdminAuthLoader";

const AdminProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { status } = useAdminAuth();

  if (status === "loading") {
    return <AdminAuthLoader />;
  }

  if (status === "unauthorized") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
