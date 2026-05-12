import { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Member");

  async function handleSignup(e) {
    e.preventDefault();

    const res = await fetch("http://localhost:8000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Signup failed");
      return;
    }

    alert("Signup successful. Please login.");
    window.location.href = "/login";
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f4f6" }}>
      <form onSubmit={handleSignup} style={{ width: "390px", background: "white", padding: "28px", borderRadius: "14px", boxShadow: "0 6px 18px rgba(0,0,0,0.1)" }}>
        <h1 style={{ fontSize: "30px", marginBottom: "20px" }}>Signup</h1>

        <input required value={name} onChange={(e) => setName(e.target.value)} style={input} placeholder="Name" />
        <input required value={email} onChange={(e) => setEmail(e.target.value)} style={input} placeholder="Email" />
        <input required value={password} onChange={(e) => setPassword(e.target.value)} style={input} type="password" placeholder="Password" />

        <select value={role} onChange={(e) => setRole(e.target.value)} style={input}>
          <option value="Member">Member</option>
          <option value="Admin">Admin</option>
        </select>

        <button type="submit" style={button}>Signup</button>

        <p style={{ marginTop: "15px" }}>
          Already have account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
};

const button = {
  width: "100%",
  padding: "12px",
  background: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};
