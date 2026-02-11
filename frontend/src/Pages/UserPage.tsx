import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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

const UserPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/${id}`,
          { headers: { token } }
        );

        setUser(res.data);
        setProfile({
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone || "",
        });
      } catch {
        setError("Failed to fetch user");
      }
    };

    fetchUser();
  }, [id]);

  const handleProfileUpdate = async () => {
    setError("");
    setSuccess("");

    if (!profile.name || !profile.email || !profile.phone) {
      setError("Name and email and phone number are required");
      return;
    }

    try {
      setSaving(true);

      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/user/${id}/profile`,
        profile,
        { headers: { token } }
      );

      setUser(res.data.user);
      setSuccess("User profile updated");
    } catch (err: any) {
      setError(err.response?.data || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!newPassword) {
      setError("Password is required");
      return;
    }
    if (newPassword.length < 5) {
      setError("Password must be more then 6");
      return;
    }
    if (newPassword != confirmPassword) {
      setError("New and Confirm password should be same");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/user/${id}/reset-password`,
        { newPassword },
        { headers: { token } }
      );

      setNewPassword("");
      setSuccess("Password reset successfully");
    } catch (err: any) {
      setError(err.response?.data || "Password reset failed");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <p className="text-zinc-400">Loading user...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Details</h1>
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg border border-white/10 px-4 py-2 hover:bg-zinc-800 cursor-pointer"
        >
          Back
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 bg-zinc-900 p-6 space-y-6"
      >
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-yellow-500 text-black flex items-center justify-center text-2xl font-bold">
            {user.name.charAt(0)}
          </div>

          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-sm text-zinc-400">{user.email}</p>
            <span className="text-xs text-zinc-500">
              Role: <b>{user.role}</b>
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Update Profile</h3>

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
            onClick={handleProfileUpdate}
            disabled={saving}
            className={`rounded-lg px-6 py-2 font-semibold transition cursor-pointer
              ${
                saving
                  ? "bg-yellow-500/40 cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-400 text-black"
              }`}
          >
            {saving ? "Updating..." : "Update Profile"}
          </button>
        </div>

        <div className="pt-6 border-t border-white/10 space-y-4">
          <h3 className="font-semibold text-white">Reset Password</h3>

          <div className="flex gap-2">
            <PasswordInput
              placeholder="New Password"
              value={newPassword}
              onChange={setNewPassword}
            />
            <PasswordInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
          </div>

          <button
            onClick={handlePasswordReset}
            disabled={saving}
            className="rounded-lg border border-red-500/40 px-6 py-2 text-red-400 hover:bg-red-500/10 cursor-pointer"
          >
            Reset Password
          </button>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {success && <p className="text-sm text-green-400">{success}</p>}
      </motion.div>
    </div>
  );
};

export default UserPage;
