import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completed: 0,
    inProgress: 0,
    todo: 0,
    overdue: 0,
    recentTasks: [],
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  async function fetchDashboard() {
    const res = await fetch("http://localhost:8000/api/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      setStats(data);
    }
  }

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetchDashboard();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Arial, sans-serif" }}>
      <div style={{ background: "#111827", color: "white", padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>Team Task Manager</h2>

        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => navigate("/projects")} style={navBtn("#2563eb")}>Projects</button>
          <button onClick={() => navigate("/tasks")} style={navBtn("#16a34a")}>Tasks</button>
          <button onClick={() => navigate("/my-tasks")} style={navBtn("#6d28d9")}>My Tasks</button>
          <button onClick={logout} style={navBtn("#dc2626")}>Logout</button>
        </div>
      </div>

      <div style={{ padding: "40px" }}>
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ fontSize: "38px", marginBottom: "8px", color: "#111827" }}>Dashboard</h1>
          <p style={{ color: "#6b7280", fontSize: "16px" }}>Live overview of your projects, tasks, and progress.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
          <Stat title="Projects" value={stats.totalProjects} color="#2563eb" />
          <Stat title="Total Tasks" value={stats.totalTasks} color="#0ea5e9" />
          <Stat title="Todo" value={stats.todo} color="#f59e0b" />
          <Stat title="In Progress" value={stats.inProgress} color="#8b5cf6" />
          <Stat title="Completed" value={stats.completed} color="#16a34a" />
          <Stat title="Overdue" value={stats.overdue} color="#dc2626" />
        </div>

        <div style={{ marginTop: "35px", background: "white", padding: "30px", borderRadius: "18px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "15px", color: "#111827" }}>Quick Actions</h2>

          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/projects")} style={actionBtn("#2563eb")}>Create Project</button>
            <button onClick={() => navigate("/tasks")} style={actionBtn("#16a34a")}>Add Task</button>
            <button onClick={() => navigate("/my-tasks")} style={actionBtn("#111827")}>View My Tasks</button>
          </div>
        </div>

        <div style={{ marginTop: "35px", background: "white", padding: "30px", borderRadius: "18px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
          <h2 style={{ fontSize: "24px", color: "#111827" }}>Recent Tasks</h2>

          {stats.recentTasks.length === 0 ? (
            <p style={{ color: "#6b7280", marginTop: "10px" }}>No tasks available yet.</p>
          ) : (
            <div style={{ marginTop: "15px", display: "grid", gap: "12px" }}>
              {stats.recentTasks.map((task) => (
                <div key={task._id} style={{ padding: "15px", border: "1px solid #e5e7eb", borderRadius: "12px", display: "flex", justifyContent: "space-between" }}>
                  <strong>{task.title}</strong>
                  <span>{task.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value, color }) {
  return (
    <div style={{ background: "white", padding: "25px", borderRadius: "18px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", borderLeft: `6px solid ${color}` }}>
      <p style={{ color: "#6b7280", margin: 0 }}>{title}</p>
      <h2 style={{ fontSize: "36px", color, margin: "10px 0 0" }}>{value}</h2>
    </div>
  );
}

function navBtn(bg) {
  return {
    background: bg,
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
  };
}

function actionBtn(bg) {
  return {
    padding: "13px 22px",
    background: bg,
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  };
}
