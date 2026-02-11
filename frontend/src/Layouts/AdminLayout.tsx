import { NavLink, Outlet } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { TiExport } from "react-icons/ti";
import { FaUsers } from "react-icons/fa";
import { AiFillFileAdd } from "react-icons/ai";
import { GrTableAdd } from "react-icons/gr";
import { FiLogOut } from "react-icons/fi";
import { useEffect, useState } from "react";
import api from "../utils/api";
import type { Lead, User } from "../types/type";

const AdminLayout = () => {
  const [leads, setLeads] = useState<Lead[]>([]);

  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [partialLeads, setPartialLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
  }, []);

  const isAdmin =
    currentUser?.role === "admin" ||
    currentUser?.role === "owner" ||
    currentUser?.role === "SUPER_ADMIN";

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [leadRes, userRes, partialRes] = await Promise.all([
          api.get("/lead"),
          api.get("/user"),
          api.get("/partiallead"),
        ]);

        setLeads(leadRes.data);
        setUsers(userRes.data);
        setPartialLeads(partialRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleCreateUser = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: "admin" | "user";
  }) => {
    try {
      const res = await api.post("/user/signup", data);

      setUsers((prev) => [res.data.user, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await api.delete(`/user/${id}`);

      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRoleChange = async (id: string, role: "admin" | "user") => {
    try {
      const res = await api.patch(`/user/${id}/role`, { role });

      setUsers((prev) => prev.map((u) => (u._id === id ? res.data.user : u)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/lead/${id}`);

      setLeads((prev) => prev.filter((lead: any) => lead._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    try {
      await api.post("/lead/bulk-delete", { ids });

      setLeads((prev) => prev.filter((lead: any) => !ids.includes(lead._id)));
    } catch (err) {
      console.error(err);
    }
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-lg transition flex items-center gap-1.5 ${
      isActive
        ? "bg-zinc-800 text-white"
        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
    }`;

  const handleClick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/admin/login";
  };

  return (
    <section className="min-h-screen bg-zinc-950 text-white">
      <div className="flex">
        <aside className="hidden md:fixed md:flex md:w-[20%] h-screen p-6">
          <div className="w-full pt-4 rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-sm flex flex-col">
            <div className="flex-col items-center gap-3 mb-10 px-2">
              <img src="/assets/logowhite.webp" alt="logo" className="h-20" />
              <div>
                <p className="pl-2 pt-2 text-sm text-zinc-400">Admin Panel</p>
              </div>
            </div>

            <nav className="flex flex-col gap-2 text-sm p-1">
              <NavLink to="/admin" end className={linkClass}>
                <MdDashboard className="text-xl" /> Dashboard
              </NavLink>
              <NavLink to="/admin/leads" className={linkClass}>
                <AiFillFileAdd className="text-xl" /> Leads
              </NavLink>
              <NavLink to="/admin/partialleads" className={linkClass}>
                <GrTableAdd className="text-xl" /> Partial Leads
              </NavLink>
              <NavLink to="/admin/export" className={linkClass}>
                <TiExport className="text-xl" /> Export Leads
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin/users" className={linkClass}>
                  <FaUsers className="text-xl" /> Users
                </NavLink>
              )}
            </nav>

            <div className="mt-auto px-2 pb-2">
              <button
                onClick={handleClick}
                className="flex w-full items-center gap-2 border mb-4 border-white/10 px-4 py-2 text-sm rounded-lg text-red-400 hover:bg-red-500/10 cursor-pointer"
              >
                <FiLogOut />
                Log out
              </button>
              <div className="text-xs text-zinc-500 ">
                © {new Date().getFullYear()} e-Marketing
              </div>
            </div>
          </div>
        </aside>

        <main className="w-full md:ml-[18%] p-6">
          <div className="mx-auto max-w-300">
            <Outlet
              context={{
                currentUser,
                isAdmin,
                leads,
                users,
                partialLeads,
                loading,
                handleDelete,
                handleBulkDelete,
                handleCreateUser,
                handleDeleteUser,
                handleRoleChange,
              }}
            />
          </div>
        </main>
      </div>
    </section>
  );
};

export default AdminLayout;
