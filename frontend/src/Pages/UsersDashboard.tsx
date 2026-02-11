import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { FaEye } from "react-icons/fa6";
import { FiEyeOff } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { LayoutContextType } from "../types/type";

type CreateUserPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "admin" | "user";
};

const PAGE_SIZE = 10;

const AddUserModal = ({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: CreateUserPayload) => void;
}) => {
  const [form, setForm] = useState<CreateUserPayload>({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  });
  const [show, setShow] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <motion.form
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(form);
        }}
        className="w-full max-w-md rounded-xl border border-white/10 bg-zinc-900 p-6 space-y-4"
      >
        <div className="flex justify-between">
          <h2 className="text-xl font-bold">Add User</h2>
          <IoMdClose className="cursor-pointer" onClick={onClose} />
        </div>

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-lg border border-white/10 bg-zinc-800 px-4 py-2 text-sm"
          required
          minLength={3}
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-lg border border-white/10 bg-zinc-800 px-4 py-2 text-sm"
          required
        />

        <input
          placeholder="Phone"
          type="tel"
          value={form.phone || ""}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full rounded-lg border border-white/10 bg-zinc-800 px-4 py-2 text-sm"
          required
          pattern="[0-9]{10}"
          title="Phone number must be 10 digits"
          minLength={10}
          maxLength={10}
        />

        <div className="relative w-full">
          <input
            placeholder="Password"
            type={show ? "text" : "password"}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-zinc-800 px-4 py-2 pr-10 text-sm"
            required
            minLength={6}
          />

          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
          >
            {show ? <FiEyeOff size={18} /> : <FaEye size={18} />}
          </button>
        </div>

        <select
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value as "admin" | "user" })
          }
          className="w-full rounded-lg border border-white/10 bg-zinc-800 px-4 py-2 text-sm"
          required
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-white/10 py-2"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex-1 rounded-lg bg-yellow-500 py-2 font-semibold text-black hover:bg-yellow-400"
          >
            Create
          </button>
        </div>
      </motion.form>
    </div>
  );
};

const UsersDashboard = () => {
  const {
    users,
    loading,
    handleDeleteUser,
    handleCreateUser,
    handleRoleChange,
    currentUser,
  } = useOutletContext<LayoutContextType>();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];
    return users.filter((u) =>
      `${u.name} ${u.email} ${u.phone}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [users, search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, page]);

  console.log(users);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold font-serif">Users</h1>

        <div className="flex items-center gap-4">
          <p className="text-sm sm:text-lg text-zinc-300">
            Total Users: {loading ? "—" : filteredUsers.length}
          </p>

          <button
            onClick={() => setOpen(true)}
            className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-400 cursor-pointer"
          >
            + Add User
          </button>
        </div>
      </div>

      <input
        placeholder="Search name, email or phone"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
      />

      <div className="grid gap-4 md:hidden">
        {!loading &&
          paginatedUsers.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-white/10 bg-zinc-900 p-4 space-y-3"
            >
              <p className="text-xs text-zinc-400">
                User #{(page - 1) * PAGE_SIZE + index + 1}
              </p>

              <div>
                <p className="text-lg font-semibold">{user.name}</p>
                <p className="text-sm text-zinc-300">{user.email}</p>
                <p className="text-sm">{user.phone}</p>
              </div>
              {user.role === "owner" ? null : (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="flex-1 rounded-lg border border-red-500/40 py-2 text-red-400 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() =>
                      handleRoleChange(
                        user._id,
                        user.role === "admin" ? "user" : "admin"
                      )
                    }
                    className="flex-1 rounded-lg border border-white/10 py-2 text-xs hover:bg-zinc-800 cursor-pointer"
                  >
                    Make {user.role === "admin" ? "User" : "Admin"}
                  </button>
                  {currentUser?.role === "owner" && (
                    <button
                      onClick={() => navigate(`/admin/users/${user._id}`)}
                      className="rounded-lg bg-yellow-500 px-4 py-2 text-xs font-semibold text-black hover:bg-yellow-400 cursor-pointer"
                    >
                      View
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          ))}
      </div>

      <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/10 bg-zinc-900/30">
        <table className="w-full text-sm lg:text-base">
          <thead className="bg-zinc-900 text-zinc-400">
            <tr>
              <th className="p-4 text-left">#</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {!loading &&
              paginatedUsers.map((user, index) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-t border-white/5 hover:bg-zinc-800/50"
                >
                  <td className="p-4">{(page - 1) * PAGE_SIZE + index + 1}</td>
                  <td className="p-4 font-medium">{user.name}</td>
                  <td className="p-4 text-zinc-300">{user.email}</td>
                  <td className="p-4">{user.phone}</td>
                  <td className="p-4">{user.role}</td>
                  {user.role === "owner" ? null : (
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="rounded-lg border border-red-500/40 bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-500/10 cursor-pointer"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() =>
                          handleRoleChange(
                            user._id,
                            user.role === "admin" ? "user" : "admin"
                          )
                        }
                        className="rounded-lg border border-white/10 px-3 py-1 text-xs hover:bg-zinc-800 cursor-pointer"
                      >
                        Make {user.role === "admin" ? "User" : "Admin"}
                      </button>
                      {currentUser?.role === "owner" && (
                        <button
                          onClick={() => navigate(`/admin/users/${user._id}`)}
                          className="rounded-lg bg-yellow-500 px-4 py-2 text-xs font-semibold text-black hover:bg-yellow-400 cursor-pointer"
                        >
                          View
                        </button>
                      )}
                    </td>
                  )}
                </motion.tr>
              ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-4">
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

      {open && (
        <AddUserModal
          onClose={() => setOpen(false)}
          onSubmit={(data) => {
            handleCreateUser(data);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default UsersDashboard;
