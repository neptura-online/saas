import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLogOut, FiUser } from "react-icons/fi";
import type { User } from "../../types/type";
import { useNavigate } from "react-router-dom";

type Props = {
  currentUser: User;
};

const AdminProfileDropdown = ({ currentUser }: Props) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 hover:bg-zinc-800 cursor-pointer"
      >
        <div className="h-8 w-8 rounded-full bg-yellow-500 text-black flex items-center justify-center font-bold">
          {currentUser.name[0]}
        </div>
        <span className="hidden sm:block text-sm">{currentUser.name}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute md:right-0 mt-3 w-72 rounded-xl border border-white/10 bg-zinc-900 shadow-xl z-50"
          >
            <div className="px-4 py-3 border-b border-white/10">
              <p className="font-semibold">{currentUser.name}</p>
              <p className="text-xs text-zinc-400">{currentUser.email}</p>
              <span className="inline-block mt-2 rounded-md bg-yellow-500 px-2 py-0.5 text-xs text-black">
                {currentUser.role}
              </span>
            </div>

            <div className="py-2">
              <button
                onClick={() => navigate("/admin/profile")}
                className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-zinc-800 cursor-pointer"
              >
                {" "}
                <FiUser />
                My profile
              </button>
            </div>

            <button
              onClick={handleClick}
              className="flex w-full items-center gap-2 border-t border-white/10 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 cursor-pointer"
            >
              <FiLogOut />
              Log out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProfileDropdown;
