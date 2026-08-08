import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Demo credentials
  const quickFill = (role) => {
    if (role === "faculty") {
      setEmail("faculty@demo.com");
      setPassword("Demo@123");
    }

    if (role === "hod") {
      setEmail("hod@demo.com");
      setPassword("Demo@123");
    }

    setError("");
  };

  // Login form
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, password);

      if (!result || !result.success) {
        setError(result?.error || "Invalid email or password.");
        setLoading(false);
        return;
      }

      // Successful login
      setLoading(false);

      // Go to Dashboard
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );

      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        <div className="login-logo">
          CF
        </div>

        <h1>ClassFlow</h1>

        <p>Faculty Substitution System</p>

        <form
          onSubmit={handleSubmit}
          className="login-form"
        >

          {/* Email */}
          <label>
            Email

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@classflow.com"
              autoComplete="email"
              required
            />
          </label>

          {/* Password */}
          <label>
            Password

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>

          {/* Error */}
          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {/* Login */}
          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* Demo login */}
        <div className="login-demo">
          <span>Quick demo login:</span>

          <button
            type="button"
            onClick={() => quickFill("faculty")}
          >
            Faculty
          </button>

          <button
            type="button"
            onClick={() => quickFill("hod")}
          >
            HOD
          </button>
        </div>

      </div>
    </div>
  );
}