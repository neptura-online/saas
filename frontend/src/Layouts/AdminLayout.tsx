import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { TiExport } from "react-icons/ti";
import { FaUsers } from "react-icons/fa";
import { AiFillFileAdd } from "react-icons/ai";
import { GrTableAdd } from "react-icons/gr";
import { FiLogOut } from "react-icons/fi";
import { useEffect, useState } from "react";
import api from "../utils/api";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [partialLeads, setPartialLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  const isAdmin = parsedUser?.role === "admin" || parsedUser?.role === "owner";

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
      } catch (err: any) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/admin/login");
        } else {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

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
    navigate("/admin/login");
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
                leads,
                users,
                partialLeads,
                loading,
                handleDelete,
                handleBulkDelete,
              }}
            />
          </div>
        </main>
      </div>
    </section>
  );
};

export default AdminLayout;
