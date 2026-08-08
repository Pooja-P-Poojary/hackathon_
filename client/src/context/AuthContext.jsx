import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load saved login when page refreshes
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Could not load saved user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      // Backend returned an error
      if (!response.ok) {
        return {
          success: false,
          error: data.message || "Invalid email or password",
        };
      }

      // Save token
      localStorage.setItem("token", data.token);

      // Save user
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Update React state
      setToken(data.token);
      setUser(data.user);

      return {
        success: true,
        token: data.token,
        user: data.user,
      };
    } catch (error) {
      console.error("Login request failed:", error);

      return {
        success: false,
        error:
          "Cannot connect to the backend. Make sure the server is running on port 5000.",
      };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}