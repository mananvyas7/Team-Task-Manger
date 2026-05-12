import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    const res = await fetch("http://localhost:8000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    localStorage.setItem("token", data.token);
    alert("Login successful");
    window.location.href = "/dashboard";
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f4f6" }}>
      <form onSubmit={handleLogin} style={{ width: "380px", background: "white", padding: "25px", borderRadius: "10px" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>Login</h1>

        <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "12px" }} placeholder="Email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "12px" }} type="password" placeholder="Password" />

        <button type="submit" style={{ width: "100%", padding: "10px", background: "#2563eb", color: "white", border: "none", borderRadius: "5px" }}>
          Login
        </button>

        <p style={{ marginTop: "15px" }}>
          No account? <Link to="/signup">Signup</Link>
        </p>
      </form>
    </div>
  );
}
