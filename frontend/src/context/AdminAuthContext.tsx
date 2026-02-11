import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

type AuthStatus = "loading" | "authorized" | "unauthorized";

const AdminAuthContext = createContext<{ status: AuthStatus }>({
  status: "loading",
});

export const AdminAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setStatus("unauthorized");
        return;
      }

      try {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/user/verify`,
          {},
          { headers: { token } }
        );
        setStatus("authorized");
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        setStatus("unauthorized");
      }
    };

    verify();
  }, []);

  return (
    <AdminAuthContext.Provider value={{ status }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
