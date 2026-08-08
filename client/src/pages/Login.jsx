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

  function quickFill(role) {
    if (role === "faculty") { setEmail("profa@classflow.com"); setPassword("1234"); }
    if (role === "dean")    { setEmail("dean@classflow.com");  setPassword("1234"); }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = login(email, password);

    setLoading(false);
    if (!result.success) {
      setError(result.error);
      return;
    }

    if (result.user.role === "dean") navigate("/dean/dashboard");
    else navigate("/faculty/dashboard"); // your existing Dashboard.jsx
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-mark">CF</div>
        <h1>ClassFlow</h1>
        <p className="login-sub">Faculty Substitution System</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@classflow.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>

        <div className="login-demo">
          <span>Quick demo login:</span>
          <button type="button" onClick={() => quickFill("faculty")}>Faculty</button>
          <button type="button" onClick={() => quickFill("dean")}>Dean</button>
        </div>
      </div>
    </div>
  );
}