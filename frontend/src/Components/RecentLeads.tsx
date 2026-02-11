type Lead = {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
};

const RecentLeads = ({ leads }: { leads: Lead[] }) => {
  const recent = [...leads]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-zinc-400">Recent Leads</p>
        <a
          href="/admin/leads"
          className="text-xs text-yellow-400 hover:underline"
        >
          View all
        </a>
      </div>

      {recent.length === 0 ? (
        <p className="text-sm text-zinc-400">No leads yet</p>
      ) : (
        <div className="space-y-3 text-sm">
          {recent.map((l) => (
            <div
              key={l._id}
              className="flex flex-col sm:flex-row justify-between border border-white/10 rounded-lg p-3"
            >
              <div>
                <p className="font-medium">{l.name}</p>
                <p className="text-zinc-400 text-xs">{l.email}</p>
              </div>
              <span className="text-xs text-zinc-500">
                {new Date(l.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentLeads;
