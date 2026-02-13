import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import type { SuperAdminContextType } from "../types/type";

const PAGE_SIZE = 10;

const AllUsersPage = () => {
  const { users, companies, loading, handleDeleteUser, handleCreateUser } =
    useOutletContext<SuperAdminContextType>();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    companyId: "",
  });

  /* ===============================
     Only Owners
  =============================== */
  const ownerUsers = useMemo(() => {
    return users.filter((u) => u.role === "owner");
  }, [users]);

  /* ===============================
     Filter
  =============================== */
  const filteredUsers = useMemo(() => {
    return ownerUsers.filter((u) =>
      `${u.name} ${u.email} ${u.phone}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [ownerUsers, search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, page]);

  /* ===============================
     Create Owner
  =============================== */
  const handleSubmit = async () => {
    if (!form.companyId) return;

    await handleCreateUser({
      ...form,
      role: "owner",
      companyId: form.companyId,
    });

    setForm({
      name: "",
      email: "",
      phone: "",
      password: "",
      companyId: "",
    });

    setOpenModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Owners Management</h1>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-indigo-600 px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
        >
          + Create Owner
        </button>
      </div>

      {/* Search */}
      <input
        placeholder="Search owner..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-2 text-sm"
      />

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-zinc-900/30">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900 text-zinc-400">
            <tr>
              <th className="p-4">#</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Company</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {!loading &&
              paginatedUsers.map((user, index) => {
                const company = companies.find((c) => c._id === user.companyId);

                return (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-t border-white/5"
                  >
                    <td className="p-4">
                      {(page - 1) * PAGE_SIZE + index + 1}
                    </td>

                    <td className="p-4">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.phone}</td>
                    <td className="p-4">{company?.name || "Unknown"}</td>

                    <td className="p-4">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="px-3 py-1 text-xs bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
          </tbody>
        </table>

        {!loading && filteredUsers.length === 0 && (
          <div className="p-6 text-center text-zinc-500">No owners found</div>
        )}
      </div>
      {/* Pagination */}
      {filteredUsers.length > PAGE_SIZE && (
        <div className="flex justify-center items-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 border border-white/10 rounded disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-sm text-zinc-400">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border border-white/10 rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* Create Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-zinc-900 p-6 rounded-xl w-96 border border-zinc-800 space-y-3">
            <h2 className="text-lg font-semibold">Create Owner</h2>

            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2 bg-zinc-800 rounded"
            />

            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-2 bg-zinc-800 rounded"
            />

            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full p-2 bg-zinc-800 rounded"
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-2 bg-zinc-800 rounded"
            />

            <select
              value={form.companyId}
              onChange={(e) => setForm({ ...form, companyId: e.target.value })}
              className="w-full p-2 bg-zinc-800 rounded"
            >
              <option value="">Select Company</option>
              {companies.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setOpenModal(false)}>Cancel</button>

              <button
                onClick={handleSubmit}
                className="bg-indigo-600 px-4 py-2 rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsersPage;
