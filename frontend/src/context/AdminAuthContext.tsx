import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";

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
        await api.post("/user/verify");
        setStatus("authorized");
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
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
