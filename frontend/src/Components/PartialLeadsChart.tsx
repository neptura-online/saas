import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useMemo, useState } from "react";

type Lead = {
  createdAt: string;
};

const ranges = [
  { label: "7 Days", value: 7 },
  { label: "14 Days", value: 14 },
  { label: "30 Days", value: 30 },
];

const PartialLeadsChart = ({ leads }: { leads: Lead[] }) => {
  const [days, setDays] = useState(7);

  const chartData = useMemo(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const startDate = new Date();
    startDate.setDate(today.getDate() - days + 1);
    startDate.setHours(0, 0, 0, 0);

    const map: Record<string, number> = {};

    leads.forEach((lead) => {
      const raw = new Date(lead.createdAt);
      const date = new Date(raw.getFullYear(), raw.getMonth(), raw.getDate());

      if (date >= startDate && date <= today) {
        const key = date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        });
        map[key] = (map[key] || 0) + 1;
      }
    });
    console.log(leads);

    return Array.from({ length: days }).map((_, i) => {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);

      const key = d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });

      return {
        date: key,
        leads: map[key] || 0,
      };
    });
  }, [leads, days]);

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-zinc-400">Partial Leads</p>

        <div className="flex gap-2">
          {ranges.map((r) => (
            <button
              key={r.value}
              onClick={() => setDays(r.value)}
              className={`px-3 py-1 text-xs rounded-md border ${
                days === r.value
                  ? "bg-yellow-500 text-black"
                  : "border-white/10 text-zinc-400 hover:bg-zinc-800"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="date" stroke="#a1a1aa" />
            <YAxis stroke="#a1a1aa" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#09090b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
              }}
              cursor={{ fill: "rgba(250,204,21,0.08)" }}
            />
            <Bar
              dataKey="leads"
              fill="#facc15"
              radius={[6, 6, 0, 0]}
              barSize={18}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PartialLeadsChart;
