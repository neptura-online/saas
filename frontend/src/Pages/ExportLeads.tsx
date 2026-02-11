import { useMemo, useState } from "react";
import { exportToExcel } from "../utils/exportLeads";
import type { LayoutContextType } from "../types/type";
import { useOutletContext } from "react-router-dom";

const ExportLeads = () => {
  const { leads } = useOutletContext<LayoutContextType>();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [source, setSource] = useState("all");
  const [leadType, setLeadType] = useState("all");

  const sources = useMemo(() => {
    const set = new Set<string>();
    leads.forEach((l) => {
      set.add(l.utm_source || "Direct");
    });
    return Array.from(set);
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const created = new Date(lead.createdAt);

      const matchDate =
        (!startDate || created >= new Date(startDate)) &&
        (!endDate || created <= new Date(endDate + "T23:59:59"));

      const matchSource =
        source === "all" || (lead.utm_source || "Direct") === source;

      const matchLeadType = leadType === "all" || lead.leadType === leadType;

      return matchDate && matchSource && matchLeadType;
    });
  }, [leads, startDate, endDate, source, leadType]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-serif">Export Leads</h1>

      <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 space-y-4">
        <p className="text-sm text-zinc-400">Filter Options</p>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-xs text-zinc-400">From Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm focus:ring-1 focus:ring-yellow-500 outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-zinc-400">To Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm focus:ring-1 focus:ring-yellow-500 outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-zinc-400">Source</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm"
            >
              <option value="all">All Sources</option>
              {sources.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-zinc-400">Source</label>
            <select
              value={leadType}
              onChange={(e) => setLeadType(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm"
            >
              <option value="all">All Leads</option>
              <option value="MainLead">Lead</option>
              <option value="PartialLead">Partial Lead</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-zinc-400">
            Matching Leads:{" "}
            <span className="text-white font-semibold">
              {filteredLeads.length}
            </span>
          </p>

          <button
            disabled={filteredLeads.length === 0}
            onClick={() => exportToExcel(filteredLeads)}
            className="rounded-lg bg-yellow-500 px-6 py-2 text-black font-semibold hover:bg-yellow-400 disabled:opacity-40 cursor-pointer"
          >
            Export Excel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportLeads;
