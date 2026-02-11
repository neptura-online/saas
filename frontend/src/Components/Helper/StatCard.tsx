export const StatCard = ({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: string;
}) => (
  <div className={`rounded-2xl p-6 bg-linear-to-br ${color}`}>
    <p className="text-sm opacity-80">{title}</p>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);
