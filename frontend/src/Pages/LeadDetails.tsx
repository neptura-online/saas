import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { LeadDetailsProps } from "../types/type";
import { formatDate } from "../utils/formateDate";

const LeadDetails = ({ leads }: LeadDetailsProps) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!leads || leads.length === 0) {
      setLoading(true);
      return;
    }
    const found = leads.find((item: any) => item._id === id);
    // @ts-expect-error
    const { updatedAt, createdAt, ...rest } = found;
    const filteredData = {
      ...rest,
      createdAt: formatDate(new Date(createdAt)),
    };
    setLead(filteredData || null);
    setLoading(false);
  }, [id, leads]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-300 hover:bg-yellow-500 hover:text-black transition"
        >
          ← Back
        </button>

        <h1 className="text-xl sm:text-3xl font-bold font-serif">
          Lead Details
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur p-6 sm:p-8"
      >
        {loading && <Skeleton />}
        {!loading && lead && (
          <>
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Highlight label="Name" value={lead.name} />
              <Highlight label="Email" value={lead.email} />
              <Highlight label="Mobile" value={lead.phone} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(lead).map(([key, value]) => (
                <DetailItem key={key} label={key} value={String(value)} />
              ))}
            </div>
          </>
        )}
        {!loading && !lead && (
          <p className="text-center text-zinc-400">Lead not found</p>
        )}
      </motion.div>
    </div>
  );
};

export default LeadDetails;

const Highlight = ({ label, value }: any) => (
  <div className="rounded-2xl bg-zinc-800/60 border border-white/5 p-4">
    <p className="text-sm uppercase tracking-wide text-zinc-400">{label}</p>
    <p className="mt-1 text-lg font-semibold break-all">{value || "-"}</p>
  </div>
);

const DetailItem = ({ label, value }: any) => (
  <div className="rounded-xl border border-white/5 bg-zinc-800/30 p-4 hover:bg-zinc-800/50 transition">
    <p className="text-sm text-zinc-400 mb-1">{label}</p>
    <p className="font-medium break-all">{value || "-"}</p>
  </div>
);

const Skeleton = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-white/5 bg-zinc-800/40 p-4"
        >
          <div className="h-3 w-16 bg-zinc-700 rounded mb-3 animate-pulse" />
          <div className="h-6 w-3/4 bg-zinc-700 rounded animate-pulse" />
        </div>
      ))}
    </div>
  </div>
);
