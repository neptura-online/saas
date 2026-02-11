import { motion } from "framer-motion";

const AdminAuthLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="relative rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur px-10 py-8 flex flex-col items-center gap-4">
        <motion.div
          className="h-12 w-12 rounded-full border-2 border-white/10 border-t-yellow-400"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
        />

        <div className="text-center space-y-1">
          <p className="text-sm text-zinc-400">Verifying admin session</p>
          <p className="text-xs text-zinc-500">Please wait a moment…</p>
        </div>

        <div className="absolute inset-0 rounded-2xl ring-1 ring-yellow-500/10" />
      </div>
    </div>
  );
};

export default AdminAuthLoader;
