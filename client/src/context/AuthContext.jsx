import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
axios.defaults.baseURL = "http://localhost:5000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("financeUser");
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      axios.defaults.headers.common["Authorization"] = `Bearer ${u.token}`;
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem("financeUser", JSON.stringify(userData));
    axios.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("financeUser");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);