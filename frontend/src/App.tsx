import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import axios from "axios";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import type { Lead, User } from "./types/type";
import ScrollToTop from "./Components/ScrollToTop";
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

type CreateUserPayload = {
  name: string;
  email: string;
  phone: number;
  password: string;
  role: "admin" | "user" | "owner";
};

const getAuthHeader = () => ({
  "Content-Type": "application/json",
  token: localStorage.getItem("token"),
});

const App = () => {
  const [partialLeads, setPartialLeads] = useState<Lead[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const combinedArray = [...leads, ...partialLeads];

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user`, {
        headers: getAuthHeader(),
      });
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/lead`, {
        headers: getAuthHeader(),
      });
      setLeads(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lead?"
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/lead/${id}`, {
        headers: getAuthHeader(),
      });

      setLeads((prev) => prev.filter((lead) => lead._id !== id));
    } catch (error) {
      alert("Failed to delete lead");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    if (ids.length === 0) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${ids.length} leads?`
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/lead/bulk-delete`,
        { ids },
        { headers: getAuthHeader() }
      );

      setLeads((prev) => prev.filter((lead) => !ids.includes(lead._id)));
    } catch (error) {
      console.error(error);
      alert("Failed to delete selected leads");
    } finally {
      setLoading(false);
    }
  };

  const fetchPartialData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/partiallead`,
        {
          headers: getAuthHeader(),
        }
      );
      setPartialLeads(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePartial = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lead?"
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/partiallead/${id}`,
        {
          headers: getAuthHeader(),
        }
      );

      setPartialLeads((prev) => prev.filter((lead) => lead._id !== id));
    } catch (error) {
      alert("Failed to delete lead");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDeletePartial = async (ids: string[]) => {
    if (ids.length === 0) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${ids.length} leads?`
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/partiallead/bulk-delete`,
        { ids },
        { headers: getAuthHeader() }
      );

      setPartialLeads((prev) => prev.filter((lead) => !ids.includes(lead._id)));
    } catch (error) {
      console.error(error);
      alert("Failed to delete selected leads");
    } finally {
      setLoading(false);
    }
  };

  const userDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/user/${id}`, {
        headers: getAuthHeader(),
      });

      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      alert("Failed to delete lead");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleCreate = async (data: CreateUserPayload) => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/signup`,
        data,
        { headers: getAuthHeader() }
      );

      setUsers((prev) => [res.data.user, ...prev]);
    } catch (error) {
      console.error(error);
      alert("Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id: string, role: "admin" | "user") => {
    try {
      setLoading(true);

      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/user/${id}/role`,
        { role },
        { headers: getAuthHeader() }
      );

      setUsers((prev) => prev.map((u) => (u._id === id ? res.data.user : u)));
    } catch (error) {
      console.error(error);
      alert("Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = localStorage.getItem("id");
    if (!id || users.length === 0) return;

    const foundUser = users.find((user) => user._id === id);
    if (foundUser) {
      setUser(foundUser);
    }

    if (foundUser?.role === "admin" || foundUser?.role === "owner") {
      setIsAdmin(true);
    }
  }, [users]);

  useEffect(() => {
    if (window.location.pathname.startsWith("/admin")) {
      fetchData();
      fetchUserData();
      fetchPartialData();
    }
  }, []);

  return (
    <div className="bg-zinc-950 max-w-screen main-scroll-container">
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route
            path="/admin"
            element={
              <Suspense fallback={null}>
                <AdminAuthProvider>
                  <AdminProtectedRoute>
                    <AdminLayout isAdmin={isAdmin} />
                  </AdminProtectedRoute>
                </AdminAuthProvider>
              </Suspense>
            }
          >
            <Route path="users/:id" element={<UserPage />} />
            <Route
              index
              element={
                <AdminDasBoard
                  users={users}
                  loading={loading}
                  leads={leads}
                  partialLeads={partialLeads}
                />
              }
            />

            <Route
              path="leads"
              element={
                <LeadDashboard
                  isAdmin={isAdmin}
                  loading={loading}
                  leads={leads}
                  handleDelete={handleDelete}
                  handleBulkDelete={handleBulkDelete}
                />
              }
            />

            <Route
              path="partialleads"
              element={
                <PartialLeadDashboard
                  isAdmin={isAdmin}
                  loading={loading}
                  leads={partialLeads}
                  handleDelete={handleDeletePartial}
                  handleBulkDelete={handleBulkDeletePartial}
                />
              }
            />

            <Route
              path="export"
              element={<ExportLeads leads={combinedArray} />}
            />

            {isAdmin && (
              <Route
                path="users"
                element={
                  <UsersDashboard
                    users={users}
                    loading={loading}
                    handleDelete={userDelete}
                    handleCreate={handleCreate}
                    handleRoleChange={handleRoleChange}
                  />
                }
              />
            )}

            <Route
              path="lead/:id"
              element={<LeadDetails leads={combinedArray} />}
            />

            <Route
              path="profile"
              element={user && <ProfilePage user={user} />}
            />
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
