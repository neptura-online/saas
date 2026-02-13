import { useEffect, useState } from "react";
import api from "../utils/api";
import { useParams } from "react-router-dom";

type Overview = {
  company: {
    _id: string;
    name: string;
    slug: string;
    isActive: boolean;
  };
  totalUsers: number;
  totalLeads: number;
  todayLeads: number;
};

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

type Lead = {
  _id: string;
  name: string;
  phone: string;
  createdAt: string;
};

const SuperAdminCompanyView = () => {
  const { id } = useParams();

  const [overview, setOverview] = useState<Overview | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, usersRes, leadsRes] = await Promise.all([
          api.get(`/superadmin/company/${id}/overview`),
          api.get(`/superadmin/company/${id}/users`),
          api.get(`/superadmin/company/${id}/leads`),
        ]);

        setOverview(overviewRes.data);
        setUsers(usersRes.data);
        setLeads(leadsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!overview) return <div className="p-6">Company not found</div>;

  return (
    <div className="space-y-8 p-6 text-white">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">{overview.company.name}</h1>
        <p className="text-sm text-zinc-400">
          Status:{" "}
          {overview.company.isActive ? (
            <span className="text-green-400">Active</span>
          ) : (
            <span className="text-red-400">Inactive</span>
          )}
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Users" value={overview.totalUsers} />
        <StatCard title="Total Leads" value={overview.totalLeads} />
        <StatCard title="Today Leads" value={overview.todayLeads} />
      </div>

      {/* USERS TABLE */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Users</h2>
        <div className="rounded-xl border border-white/10 bg-zinc-900/40">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 text-zinc-400">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t border-white/5">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 capitalize">{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* LEADS TABLE */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Leads</h2>
          <button
            onClick={() =>
              window.open(
                `${
                  import.meta.env.VITE_API_URL
                }/superadmin/company/${id}/leads/export`
              )
            }
            className="px-4 py-2 text-sm bg-indigo-600 rounded hover:bg-indigo-700"
          >
            Export CSV
          </button>
        </div>

        <div className="rounded-xl border border-white/10 bg-zinc-900/40">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 text-zinc-400">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l._id} className="border-t border-white/5">
                  <td className="p-3">{l.name}</td>
                  <td className="p-3">{l.phone}</td>
                  <td className="p-3">
                    {new Date(l.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }: { title: string; value: number }) => (
  <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
    <p className="text-sm text-zinc-400">{title}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

export default SuperAdminCompanyView;
