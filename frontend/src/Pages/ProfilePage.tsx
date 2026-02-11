import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { LayoutContextType } from "../types/type";
import PasswordInput from "../Components/Helper/PasswordInput";
import api from "../utils/api";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, users } = useOutletContext<LayoutContextType>();

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!currentUser) {
    return <p className="text-red-400">User not found</p>;
  }

  // 🔥 Find full user from users array
  const fullUser = users?.find((u) => u._id === currentUser.id);

  const resetStatus = () => {
    setError(null);
    setSuccess(null);
  };

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (fullUser) {
      setProfile({
        name: fullUser.name || "",
        email: fullUser.email || "",
        phone: `${fullUser.phone}` || "",
      });
    }
  }, [fullUser]);

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const handleProfileSave = async () => {
    resetStatus();

    if (!profile.name || !profile.email) {
      setError("Name and email are required");
      return;
    }

    try {
      setSaving(true);

      const res = await api.patch(`/user/${currentUser.id}/profile`, profile);

      const updatedUser = res.data.user;

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setProfile({
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone || "",
      });

      setSuccess("Profile updated successfully");
    } catch (err: any) {
      setError(err.response?.data || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    resetStatus();

    if (!passwords.current || !passwords.next) {
      setError("All password fields are required");
      return;
    }

    if (passwords.next !== passwords.confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      setSaving(true);

      await api.patch(`/user/${currentUser.id}/password`, {
        currentPassword: passwords.current,
        newPassword: passwords.next,
      });

      setPasswords({ current: "", next: "", confirm: "" });
      setSuccess("Password updated successfully");
    } catch (err: any) {
      setError(err.response?.data || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  if (!fullUser) {
    return <p className="text-zinc-400">Loading profile...</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT PROFILE CARD */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 bg-zinc-900 p-6 space-y-4"
      >
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="h-24 w-24 rounded-full bg-yellow-500 text-black flex items-center justify-center text-3xl font-bold">
            {fullUser?.name?.charAt(0)}
          </div>

          <div>
            <h2 className="text-xl font-semibold">{fullUser?.name}</h2>
            <p className="text-sm text-zinc-400">{fullUser?.email}</p>
          </div>

          <span className="rounded-md px-3 py-1 text-xs font-medium bg-zinc-800 text-zinc-300">
            {fullUser?.role}
          </span>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="w-full rounded-lg border border-red-500/40 py-2 text-red-400 hover:bg-red-500/10"
        >
          Back
        </button>
      </motion.div>

      {/* RIGHT SETTINGS */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="lg:col-span-2 rounded-2xl border border-white/10 bg-zinc-900 p-6 space-y-6"
      >
        {error && <p className="text-sm text-red-400">{error}</p>}
        {success && <p className="text-sm text-green-400">{success}</p>}

        {/* PROFILE UPDATE */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Profile Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Name"
              className="rounded-lg bg-zinc-800 border border-white/10 px-4 py-2 text-sm"
            />

            <input
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              placeholder="Email"
              type="email"
              className="rounded-lg bg-zinc-800 border border-white/10 px-4 py-2 text-sm"
            />

            <input
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              type="numeric"
              placeholder="Phone"
              className="rounded-lg bg-zinc-800 border border-white/10 px-4 py-2 text-sm md:col-span-2"
            />
          </div>

          <button
            onClick={handleProfileSave}
            disabled={saving}
            className={`mt-4 rounded-lg px-6 py-2 font-semibold ${
              saving
                ? "bg-yellow-500/40 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-400 text-black"
            }`}
          >
            {saving ? "Updating..." : "Update Profile"}
          </button>
        </div>

        {/* PASSWORD CHANGE */}
        <div className="pt-6 border-t border-white/10">
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PasswordInput
              placeholder="Current Password"
              value={passwords.current}
              onChange={(v) => setPasswords({ ...passwords, current: v })}
            />
            <PasswordInput
              placeholder="New Password"
              value={passwords.next}
              onChange={(v) => setPasswords({ ...passwords, next: v })}
            />
            <PasswordInput
              placeholder="Confirm New Password"
              value={passwords.confirm}
              onChange={(v) => setPasswords({ ...passwords, confirm: v })}
            />
          </div>

          <button
            onClick={handlePasswordChange}
            disabled={saving}
            className="mt-4 rounded-lg border border-white/10 px-6 py-2 hover:bg-zinc-800"
          >
            {saving ? "Updating..." : "Update Password"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
