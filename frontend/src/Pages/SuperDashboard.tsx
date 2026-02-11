import { useMemo } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { StatCard } from "../Components/Helper/StatCard";

type Company = {
  _id: string;
  name: string;
  totalLeads: number;
  todayLeads: number;
};

type Overview = {
  totalCompanies: number;
  totalUsers: number;
  totalLeads: number;
  todayLeads: number;
  companies: Company[];
};

type SuperContext = {
  overview: Overview | null;
  companies: Company[];
  loading: boolean;
};

const SuperDashboard = () => {
  const { overview, companies, loading } = useOutletContext<SuperContext>();
  console.log(overview, companies, loading);

  const topCompanies = useMemo(() => {
    return [...companies]
      .sort((a, b) => b.totalLeads - a.totalLeads)
      .slice(0, 5);
  }, [companies]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <header className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-semibold">Super Admin Dashboard 🚀</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Complete system overview & company performance
        </p>
      </header>

      {/* STAT CARDS */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Companies"
          value={overview?.totalCompanies || 0}
          color="from-indigo-500 to-blue-600"
        />
        <StatCard
          title="Total Users"
          value={overview?.totalUsers || 0}
          color="from-purple-500 to-indigo-600"
        />
        <StatCard
          title="Total Leads"
          value={overview?.totalLeads || 0}
          color="from-pink-500 to-rose-600"
        />
        <StatCard
          title="Today Leads"
          value={overview?.todayLeads || 0}
          color="from-emerald-500 to-green-600"
        />
      </div>

      {/* TOP COMPANIES */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">🔥 Top Performing Companies</h2>
          <Link
            to="/super-admin/companies"
            className="text-sm text-indigo-400 hover:text-indigo-300"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <p className="text-zinc-400">Loading...</p>
        ) : topCompanies.length === 0 ? (
          <p className="text-zinc-400">No company data found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-zinc-400 border-b border-white/10">
                <tr>
                  <th className="text-left py-3">Company</th>
                  <th className="text-left py-3">Total Leads</th>
                  <th className="text-left py-3">Today Leads</th>
                </tr>
              </thead>
              <tbody>
                {topCompanies.map((company) => (
                  <tr
                    key={company._id}
                    className="border-b border-white/5 hover:bg-zinc-800/40 transition"
                  >
                    <td className="py-3">{company.name}</td>
                    <td className="py-3 font-medium">{company.totalLeads}</td>
                    <td className="py-3 text-emerald-400">
                      {company.todayLeads}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SYSTEM STATUS */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-400">System Status</p>
          <p className="text-sm text-emerald-400">
            {loading ? "Loading..." : "Operational"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuperDashboard;
