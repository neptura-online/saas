import { useEffect, useMemo, useState } from "react";
import { StatCard } from "../Components/Helper/StatCard";
import LeadsChart from "../Components/LeadsChart";
import RecentLeads from "../Components/RecentLeads";
import { Link, NavLink, useOutletContext } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import AdminProfileDropdown from "../Components/Helper/AdminProfileDropdown";
import PartialLeadsChart from "../Components/PartialLeadsChart";
import type { LayoutContextType, User } from "../types/type";

const AdminDasBoard = () => {
  const { leads, partialLeads, loading } =
    useOutletContext<LayoutContextType>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const today = new Date().toDateString();
  const oneWeekAgo = new Date(Date.now() - 7 * 86400000);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    try {
      setUser(JSON.parse(storedUser));
    } catch {
      setUser(null);
    }
  }, []);

  const todayLeads = useMemo(
    () =>
      leads.filter((l) => new Date(l.createdAt).toDateString() === today)
        .length,
    [leads, today]
  );

  const weeklyLeads = useMemo(
    () => leads.filter((l) => new Date(l.createdAt) >= oneWeekAgo).length,
    [leads]
  );

  const topSourceToday = useMemo(() => {
    const map: Record<string, number> = {};
    leads.forEach((l) => {
      if (new Date(l.createdAt).toDateString() === today) {
        const s = l.utm_source || "Direct";
        map[s] = (map[s] || 0) + 1;
      }
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
  }, [leads, today]);

  return (
    <div className="space-y-6 relative">
      <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur border-b border-white/10 px-4 py-4 flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-semibold font-serif">
          Welcome back{user?.name ? `, ${user.name}` : ""} 👋
        </h2>

        <div className="flex items-center gap-3">
          {user && <AdminProfileDropdown currentUser={user} />}
          <button onClick={() => setMenuOpen((v) => !v)} className="md:hidden">
            {menuOpen ? (
              <IoMdClose className="h-7 w-7" />
            ) : (
              <FiMenu className="h-7 w-7" />
            )}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="md:hidden absolute right-4 top-20 z-40 w-56 rounded-2xl bg-zinc-900 border border-white/10 p-2">
          <nav className="flex flex-col gap-2 text-sm">
            <NavLink to="/admin" className="px-4 py-2 rounded-lg bg-zinc-800">
              Dashboard
            </NavLink>
            <NavLink
              to="/admin/leads"
              className="px-4 py-2 rounded-lg bg-zinc-800"
            >
              Leads
            </NavLink>
            <NavLink
              to="/admin/partialleads"
              className="px-4 py-2 rounded-lg bg-zinc-800"
            >
              Partial Leads
            </NavLink>
            <NavLink
              to="/admin/export"
              className="px-4 py-2 rounded-lg bg-zinc-800"
            >
              Export Leads
            </NavLink>
          </nav>
        </div>
      )}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today Leads"
          value={todayLeads}
          color="from-yellow-500 to-orange-500"
        />
        <StatCard
          title="Weekly Leads"
          value={weeklyLeads}
          color="from-purple-500 to-indigo-600"
        />
        <StatCard
          title="Total Leads"
          value={leads.length}
          color="from-pink-500 to-rose-600"
        />
        <StatCard
          title="Top Source Today"
          value={topSourceToday}
          color="from-emerald-500 to-green-600"
        />
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <LeadsChart leads={leads} />
          <PartialLeadsChart leads={partialLeads} />
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-zinc-400">System Status</p>
              <p className="text-sm text-emerald-400">
                {loading ? "Loading..." : "Operational"}
              </p>
            </div>
            <RecentLeads leads={leads} />
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
            <p className="text-sm text-zinc-400 mb-4">
              Total Partial : {partialLeads.length}
            </p>
            <Link
              to="/admin/partialleads"
              className="block rounded-lg bg-yellow-500 py-2 text-center font-semibold text-black hover:bg-yellow-400"
            >
              View All Partial Leads
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDasBoard;
