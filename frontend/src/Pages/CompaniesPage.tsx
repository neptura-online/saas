import { useState } from "react";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import type { SuperAdminContextType } from "../types/type";

const CompaniesPage = () => {
  const {
    companies,
    loading,
    handleCreateCompany,
    handleToggleCompany,
    handleDeleteCompany,
  } = useOutletContext<SuperAdminContextType>();

  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [search, setSearch] = useState("");

  const filtered = companies.filter((c) => {
    if (!c?.name || !c?.slug) return false;

    return (
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="p-6 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Companies</h1>
        <button
          onClick={() => setOpenModal(true)}
          className="bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          + Create Company
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search company..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg"
      />

      {/* Table */}
      <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
        {loading ? (
          <div className="p-6">Loading...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-zinc-800 text-sm uppercase text-zinc-400">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((company) => (
                <tr key={company._id} className="border-t border-zinc-800">
                  <td className="p-4">{company.name}</td>
                  <td className="p-4 text-zinc-400">{company.slug}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        company.isActive
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {company.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4 text-zinc-500 text-sm">
                    {new Date(company.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 flex gap-3">
                    <button
                      onClick={() => handleToggleCompany(company._id)}
                      className="text-yellow-400 border px-3 rounded-xl py-1 text-sm cursor-pointer"
                    >
                      Toggle
                    </button>
                    <button
                      onClick={() => handleDeleteCompany(company._id)}
                      className="text-red-500 text-sm border px-3 rounded-xl py-1 cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-zinc-900 p-6 rounded-xl w-96 border border-zinc-800"
          >
            <h2 className="text-xl font-semibold mb-4">Create Company</h2>

            <input
              placeholder="Company Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-3 p-3 bg-zinc-800 rounded-lg"
            />

            <input
              placeholder="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full mb-4 p-3 bg-zinc-800 rounded-lg"
            />

            <div className="flex justify-end gap-3">
              <button onClick={() => setOpenModal(false)}>Cancel</button>
              <button
                onClick={() => {
                  handleCreateCompany({ name, slug });
                  setOpenModal(false);
                  setName("");
                  setSlug("");
                }}
                className="bg-indigo-600 px-4 py-2 rounded-lg"
              >
                Create
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CompaniesPage;
