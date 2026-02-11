import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import type { LeadDashboardProps } from "../types/type";
import { exportToExcel } from "../utils/exportLeads";
import { formatDate } from "../utils/formateDate";

type SortKey = "date" | "name" | null;
type SortOrder = "asc" | "desc";

const PAGE_SIZE = 8;

const LeadDashboard = ({
  isAdmin,
  loading,
  handleDelete,
  leads,
  handleBulkDelete,
}: LeadDashboardProps) => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [page, setPage] = useState(1);

  const handleSort = (key: SortKey) => {
    setPage(1);
    if (sortKey === key) {
      setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  useEffect(() => {
    setSelectedIds([]);
  }, [loading]);

  const filteredLeads = useMemo(() => {
    if (!Array.isArray(leads)) return [];

    let data = [...leads].filter((lead) => {
      const text = `${lead.name} ${lead.email} ${String(lead.phone)} ${
        lead.utm_source ?? ""
      }`.toLowerCase();

      return text.includes(search.toLowerCase());
    });

    if (sortKey === "name") {
      data.sort((a, b) =>
        sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
    }

    if (sortKey === "date") {
      data.sort((a, b) => {
        const d1 = new Date(a.createdAt ?? 0).getTime();
        const d2 = new Date(b.createdAt ?? 0).getTime();
        return sortOrder === "asc" ? d1 - d2 : d2 - d1;
      });
    }

    return data;
  }, [leads, search, sortKey, sortOrder]);

  useEffect(() => {
    setPage(1);
  }, [search, sortKey, sortOrder]);

  const totalPages = Math.ceil(filteredLeads.length / PAGE_SIZE);

  const paginatedLeads = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredLeads.slice(start, start + PAGE_SIZE);
  }, [filteredLeads, page]);

  const Arrow = ({ active }: { active: boolean }) => (
    <span className="ml-1 text-xs">
      {active ? (sortOrder === "asc" ? "▲" : "▼") : "⇅"}
    </span>
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAllCurrent = () => {
    if (paginatedLeads.length === 0) return;
    const currentIds = paginatedLeads.map((l) => l._id);

    const allSelected = currentIds.every((id) => selectedIds.includes(id));

    setSelectedIds((prev) =>
      allSelected
        ? prev.filter((id) => !currentIds.includes(id))
        : [...new Set([...prev, ...currentIds])]
    );
  };

  const selectedLeads = useMemo(() => {
    if (selectedIds.length === 0) return [];
    return leads.filter((lead) => selectedIds.includes(lead._id));
  }, [selectedIds, leads]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages || 1);
    }
  }, [totalPages, page]);

  return (
    <div className="space-y-6">
      <div className="w-full flex justify-center">
        <div className="w-full">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold font-serif">
              Leads Dashboard
            </h1>

            <div className="flex items-center gap-4">
              <p className="text-sm sm:text-lg text-zinc-300">
                Total Leads: {loading ? "—" : filteredLeads.length}
              </p>

              <button
                onClick={() =>
                  exportToExcel(selectedIds.length > 0 ? selectedLeads : leads)
                }
                disabled={
                  loading || (selectedIds.length === 0 && leads.length === 0)
                }
                className="rounded-lg border border-white/10 bg-zinc-900 px-4 py-2 text-sm hover:bg-zinc-800 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                Export ({selectedIds.length})
              </button>

              <button
                disabled={selectedIds.length === 0 || loading}
                onClick={() => handleBulkDelete?.(selectedIds)}
                className={`rounded-lg px-4 py-2 text-sm text-white transition
                        ${
                          selectedIds.length === 0 || loading
                            ? "bg-red-500/30 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-500 cursor-pointer"
                        }`}
              >
                Delete ({selectedIds.length})
              </button>
            </div>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search name, email, phone or source"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
            />
          </div>
          <div className="flex justify-end mb-3 md:hidden">
            <button
              onClick={() => handleSort("date")}
              className="text-xs text-zinc-400 border border-white/10 px-3 py-2 rounded-md hover:bg-zinc-800"
            >
              Sort by Date{" "}
              {sortKey === "date" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
            </button>
          </div>

          <div className="grid gap-4 xl:hidden">
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/10 bg-zinc-900 p-4 space-y-3 animate-pulse"
                >
                  <div className="h-4 w-1/2 bg-zinc-800 rounded" />
                  <div className="h-3 w-full bg-zinc-800 rounded" />
                  <div className="h-3 w-3/4 bg-zinc-800 rounded" />
                </div>
              ))}

            {!loading && paginatedLeads.length === 0 && (
              <p className="text-center text-zinc-400 py-10">No leads found</p>
            )}

            {!loading &&
              paginatedLeads.map((lead, index) => (
                <motion.div
                  key={lead._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-xl border border-white/10 bg-zinc-900 p-4 space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-zinc-400">
                      Lead #{(page - 1) * PAGE_SIZE + index + 1}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {formatDate(new Date(lead.createdAt))}
                    </p>
                    <input
                      type="checkbox"
                      className="h-4 w-4 cursor-pointer accent-yellow-400"
                      checked={selectedIds.includes(lead._id)}
                      onChange={() => toggleSelect(lead._id)}
                    />
                  </div>

                  <div>
                    <p className="text-lg font-semibold">{lead.name}</p>
                    <p className="text-sm text-zinc-300">{lead.email}</p>
                    <p className="text-sm">{String(lead.phone)}</p>
                  </div>

                  <p className="text-xs text-zinc-400">
                    Source: {lead.utm_source ?? "-"}
                  </p>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() =>
                        navigate(`/admin/lead/${lead._id}`, { state: lead })
                      }
                      className="flex-1 rounded-lg bg-yellow-500 py-2 text-black font-semibold hover:bg-yellow-400 cursor-pointer"
                    >
                      View
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(lead._id)}
                        className="flex-1 rounded-lg border border-red-500/40 py-2 text-red-400 hover:bg-red-500/10 cursor-pointer"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
          </div>

          <div
            style={{ scrollbarWidth: "none" }}
            className="hidden xl:block overflow-x-auto rounded-2xl border border-white/10 bg-zinc-900/30 backdrop-blur"
          >
            <table className="w-full text-sm lg:text-base">
              <thead className="bg-zinc-900 text-zinc-400">
                <tr>
                  <th className="p-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 cursor-pointer accent-yellow-400"
                      checked={
                        paginatedLeads.length > 0 &&
                        paginatedLeads.every((l) => selectedIds.includes(l._id))
                      }
                      onChange={selectAllCurrent}
                    />
                  </th>

                  <th className="p-4 text-left">Id</th>
                  <th
                    className="p-4 text-left cursor-pointer"
                    onClick={() => handleSort("date")}
                  >
                    Time <Arrow active={sortKey === "date"} />
                  </th>
                  <th
                    className="p-4 text-left cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    Name <Arrow active={sortKey === "name"} />
                  </th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Phone</th>
                  <th className="p-4 text-left">Source</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-t border-white/5">
                      {Array.from({ length: 8 }).map((__, j) => (
                        <td key={j} className="p-4">
                          <div className="h-4 w-full bg-zinc-800 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))}

                {!loading &&
                  paginatedLeads.map((lead, index) => (
                    <motion.tr
                      key={lead._id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border-t border-white/5 hover:bg-zinc-800/50"
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(lead._id)}
                          onChange={() => toggleSelect(lead._id)}
                          className="h-4 w-4 cursor-pointer accent-yellow-400"
                        />
                      </td>

                      <td className="p-4 font-medium">
                        {(page - 1) * PAGE_SIZE + index + 1}
                      </td>
                      <td className="p-4">
                        {formatDate(new Date(lead.createdAt))}
                      </td>
                      <td className="p-4 font-medium">{lead.name}</td>
                      <td className="p-4 text-zinc-300">{lead.email}</td>
                      <td className="p-4">{lead.phone}</td>
                      <td className="p-4">{lead.utm_source ?? "-"}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/lead/${lead._id}`, {
                                state: lead,
                              })
                            }
                            className="rounded-lg bg-yellow-500 px-4 py-1.5 text-black font-semibold hover:bg-yellow-300 hover:cursor-pointer"
                          >
                            View
                          </button>

                          {isAdmin && (
                            <button
                              onClick={() => handleDelete(lead._id)}
                              className="rounded-lg border border-red-500/40 bg-red-500 px-4 py-1.5 text-white hover:bg-red-500/10 hover:cursor-pointer"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center gap-4">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm disabled:opacity-40"
              >
                Prev
              </button>

              <span className="text-sm text-zinc-400">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadDashboard;
