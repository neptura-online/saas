import { useState } from "react";
import axios from "axios";
import PasswordInput from "../Components/Helper/PasswordInput";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const role = res.data?.user?.role;
      if (!role) {
        setError("Invalid server response");
        return;
      }

      if (role === "SUPER_ADMIN") {
        navigate("/super-admin");
      } else {
        navigate("/admin");
      }
    } catch (error: any) {
      setError(error.response?.data || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-zinc-950 text-white px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm rounded-xl border border-white/10 bg-zinc-900 p-6 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Admin Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg bg-zinc-800 border border-white/10 px-4 py-2 text-sm"
        />

        <PasswordInput
          placeholder="Password"
          value={password}
          onChange={setPassword}
        />

        {error && <p className="text-sm text-red-400 text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-yellow-500 py-2 text-black font-semibold hover:bg-yellow-400 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </section>
  );
};

export default AdminLogin;
