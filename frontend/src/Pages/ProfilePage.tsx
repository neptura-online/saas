import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PasswordInput from "../Components/Helper/PasswordInput";

type User = {
  _id: string;
  name: string;
  email: string;
  phone?: number;
  role: "admin" | "user" | "owner";
  roleAssignedBy: string;
};

type Props = {
  user: User;
};

const ProfilePage = ({ user }: Props) => {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetStatus = () => {
    setError(null);
    setSuccess(null);
  };

  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || "",
  });

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

      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/user/${user._id}/profile`,
        profile,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      setProfile({
        name: res.data.user.name,
        email: res.data.user.email,
        phone: res.data.user.phone || "",
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

      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/user/${user._id}/password`,
        {
          currentPassword: passwords.current,
          newPassword: passwords.next,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      setPasswords({ current: "", next: "", confirm: "" });
      setSuccess("Password updated successfully");
    } catch (err: any) {
      setError(err.response?.data || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 bg-zinc-900 p-6 space-y-4"
      >
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="h-24 w-24 rounded-full bg-yellow-500 text-black flex items-center justify-center text-3xl font-bold">
            {user.name.charAt(0)}
          </div>

          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-sm text-zinc-400">{user.email}</p>
          </div>

          <span className="rounded-md px-3 py-1 text-xs font-medium bg-zinc-800 text-zinc-300">
            {user.role}
          </span>
        </div>
        <div>
          {" "}
          <label className="text-xs text-zinc-400">Role Assign By</label>{" "}
          <div>
            {" "}
            <p>{Object(user.roleAssignedBy)}</p>{" "}
          </div>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="w-full rounded-lg border border-red-500/40 py-2 text-red-400 hover:bg-red-500/10 cursor-pointer"
        >
          Back
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="lg:col-span-2 rounded-2xl border border-white/10 bg-zinc-900 p-6 space-y-6"
      >
        {error && <p className="text-sm text-red-400">{error}</p>}
        {success && <p className="text-sm text-green-400">{success}</p>}

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
              placeholder="Phone"
              className="rounded-lg bg-zinc-800 border border-white/10 px-4 py-2 text-sm md:col-span-2"
            />
          </div>

          <button
            onClick={handleProfileSave}
            disabled={saving}
            className={`mt-4 rounded-lg px-6 py-2 font-semibold transition ${
              saving
                ? "bg-yellow-500/40 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-400 text-black cursor-pointer"
            }`}
          >
            {saving ? "Updating..." : "Update Profile"}
          </button>
        </div>

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
            className="mt-4 rounded-lg border border-white/10 px-6 py-2 hover:bg-zinc-800 cursor-pointer"
          >
            {saving ? "Updating..." : "Update Password"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
