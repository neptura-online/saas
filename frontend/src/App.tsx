import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import ScrollToTop from "./Components/ScrollToTop";
import SuperAdminLayout from "./Layouts/SuperAdminLayout";
import SuperAdminProtectedRoute from "./Components/Helper/SuperAdminProtectedRoute";
import SuperDashboard from "./Pages/SuperDashboard";
import CompaniesPage from "./Pages/CompaniesPage";
import AllUsersPage from "./Pages/AllUsersPage";

const NotFound = lazy(() => import("./Pages/NotFound"));
const UserPage = lazy(() => import("./Pages/UserPage"));
const AdminLayout = lazy(() => import("./Layouts/AdminLayout"));
const AdminProtectedRoute = lazy(
  () => import("./Components/Helper/AdminProtectedRoute")
);
const AdminLogin = lazy(() => import("./Pages/AdminLogin"));
const AdminDasBoard = lazy(() => import("./Pages/AdminDasBoard"));
const LeadDashboard = lazy(() => import("./Pages/LeadDashBoard"));
const PartialLeadDashboard = lazy(() => import("./Pages/PartialLeadDashBoard"));
const UsersDashboard = lazy(() => import("./Pages/UsersDashboard"));
const ExportLeads = lazy(() => import("./Pages/ExportLeads"));
const LeadDetails = lazy(() => import("./Pages/LeadDetails"));
const ProfilePage = lazy(() => import("./Pages/ProfilePage"));

const App = () => {
  return (
    <div className="bg-zinc-950 max-w-screen main-scroll-container">
      <BrowserRouter>
        <ScrollToTop />

        <Routes>
          <Route
            path="/super-admin"
            element={
              <Suspense fallback={null}>
                <AdminAuthProvider>
                  <SuperAdminProtectedRoute>
                    <SuperAdminLayout />
                  </SuperAdminProtectedRoute>
                </AdminAuthProvider>
              </Suspense>
            }
          >
            <Route index element={<SuperDashboard />} />
            <Route path="companies" element={<CompaniesPage />} />
            <Route path="users" element={<AllUsersPage />} />
          </Route>

          <Route
            path="/admin"
            element={
              <Suspense fallback={null}>
                <AdminAuthProvider>
                  <AdminProtectedRoute>
                    <AdminLayout />
                  </AdminProtectedRoute>
                </AdminAuthProvider>
              </Suspense>
            }
          >
            <Route index element={<AdminDasBoard />} />
            <Route path="leads" element={<LeadDashboard />} />
            <Route path="partialleads" element={<PartialLeadDashboard />} />
            <Route path="users" element={<UsersDashboard />} />
            <Route path="users/:id" element={<UserPage />} />
            <Route path="export" element={<ExportLeads />} />
            <Route path="lead/:id" element={<LeadDetails />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          <Route
            path="/admin/login"
            element={
              <Suspense fallback={null}>
                <AdminLogin />
              </Suspense>
            }
          />

          <Route
            path="*"
            element={
              <Suspense fallback={null}>
                <NotFound />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
