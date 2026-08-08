import { createContext, useContext, useState } from "react";

// Dummy accounts for the demo — swap for a real API later
const DUMMY_USERS = [
  { email: "profa@classflow.com", password: "1234", role: "faculty", name: "Prof. A" },
  { email: "profb@classflow.com", password: "1234", role: "faculty", name: "Prof. B" },
  { email: "dean@classflow.com",  password: "1234", role: "dean",    name: "Dean" },
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("classflow_user");
    return saved ? JSON.parse(saved) : null;
  });

  function login(email, password) {
    const found = DUMMY_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return { success: false, error: "Invalid email or password" };

    setUser(found);
    localStorage.setItem("classflow_user", JSON.stringify(found));
    return { success: true, user: found };
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("classflow_user");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}