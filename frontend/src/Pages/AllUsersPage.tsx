import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import type { LayoutContextType } from "../types/type";

const PAGE_SIZE = 10;

const AllUsersPage = () => {
  const {
    users = [],
    companies = [],
    loading,
    handleDeleteUser,
    handleRoleChange,
  } = useOutletContext<LayoutContextType>();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // 🔥 Map companyId -> companyName
  const companyMap = useMemo(() => {
    const map: Record<string, string> = {};
    companies.forEach((c) => {
      map[c._id] = c.name;
    });
    return map;
  }, [companies]);

  // 🔎 Filter
  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      `${u.name} ${u.email} ${u.phone} ${u.role}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [users, search]);

  // 🔄 Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, page]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Users Management</h1>
        <p className="text-zinc-400">
          Total Users: {loading ? "—" : filteredUsers.length}
        </p>
      </div>

      {/* Search */}
      <input
        placeholder="Search by name, email, phone or role..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-2 text-sm"
      />

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-zinc-900/30">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900 text-zinc-400">
            <tr>
              <th className="p-4 text-left">#</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Company</th>
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
                  className="border-t border-white/5 hover:bg-zinc-800/40"
                >
                  <td className="p-4">{(page - 1) * PAGE_SIZE + index + 1}</td>

                  <td className="p-4 font-medium">{user.name}</td>
                  <td className="p-4 text-zinc-300">{user.email}</td>
                  <td className="p-4">{user.phone}</td>
                  <td className="p-4 capitalize">{user.role}</td>

                  {/* 🔥 Company mapping */}
                  <td className="p-4">
                    {user.companyId
                      ? companyMap[user.companyId] || "Unknown"
                      : "Super Admin"}
                  </td>

                  <td className="p-4 flex gap-2">
                    {user.role !== "SUPER_ADMIN" && (
                      <>
                        <button
                          onClick={() =>
                            handleRoleChange(
                              user._id,
                              user.role === "admin" ? "user" : "admin"
                            )
                          }
                          className="px-3 py-1 text-xs border border-white/10 rounded hover:bg-zinc-800"
                        >
                          Toggle Role
                        </button>

                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </motion.tr>
              ))}
          </tbody>
        </table>

        {!loading && filteredUsers.length === 0 && (
          <div className="p-6 text-center text-zinc-500">No users found</div>
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
    </div>
  );
};

export default AllUsersPage;
