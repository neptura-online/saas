import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import type { JSX } from "react";
import AdminAuthLoader from "./AdminAuthLoader";

const SuperAdminProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { status, user } = useAdminAuth();

  if (status === "loading") {
    return <AdminAuthLoader />;
  }

  if (status === "unauthorized") {
    return <Navigate to="/admin/login" replace />;
  }

  if (user?.role !== "super_admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default SuperAdminProtectedRoute;
