import { NavLink, Outlet } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FaBuilding } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useEffect, useState } from "react";
import type { User } from "../types/type";

const SuperAdminLayout = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
  }, []);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-lg transition flex items-center gap-2 ${
      isActive
        ? "bg-yellow-500 text-black"
        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/admin/login";
  };

  return (
    <section className="min-h-screen bg-black text-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex md:w-[20%] h-screen p-6">
          <div className="w-full rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-sm flex flex-col p-4">
            <div className="mb-10">
              <h2 className="text-xl font-bold text-yellow-500">Super Admin</h2>
              <p className="text-xs text-zinc-400">{currentUser?.name}</p>
            </div>

            <nav className="flex flex-col gap-2 text-sm">
              <NavLink to="/super" end className={linkClass}>
                <MdDashboard className="text-lg" />
                Dashboard
              </NavLink>

              <NavLink to="/super/companies" className={linkClass}>
                <FaBuilding className="text-lg" />
                Companies
              </NavLink>
            </nav>

            <div className="mt-auto">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 border border-red-500/30 px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10"
              >
                <FiLogOut />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full md:ml-[20%] p-6">
          <Outlet />
        </main>
      </div>
    </section>
  );
};

export default SuperAdminLayout;
