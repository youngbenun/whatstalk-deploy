import { createContext, useContext, useState } from "react";
import { post } from "../services/api";
const Context = createContext(null);
function decode(token) {
  try {
    return JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
  } catch {
    return null;
  }
}
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem("whatstalk_token"),
  );
  const user = token ? decode(token) : null;
  const login = async (email, password) => {
    const result = await post("/users/login", { email, password });
    localStorage.setItem("whatstalk_token", result.token);
    setToken(result.token);
  };
  const logout = () => {
    localStorage.removeItem("whatstalk_token");
    setToken(null);
  };
  return (
    <Context.Provider value={{ token, user, login, logout }}>
      {children}
    </Context.Provider>
  );
}
export const useAuth = () => useContext(Context);
