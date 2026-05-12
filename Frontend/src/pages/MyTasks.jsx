import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  async function fetchTasks() {
    const res = await fetch("http://localhost:8000/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setTasks(Array.isArray(data) ? data : []);
  }

  async function updateStatus(taskId, newStatus) {
    const task = tasks.find((t) => t._id === taskId);

    await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...task, status: newStatus }),
    });

    fetchTasks();
  }

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetchTasks();
  }, []);

  const todo = tasks.filter((t) => t.status === "Todo").length;
  const progress = tasks.filter((t) => t.status === "In Progress").length;
  const completed = tasks.filter((t) => t.status === "Completed").length;

  return (
    <div style={page}>
      <nav style={nav}>
        <h2>🚀 Team Task Manager</h2>

        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => navigate("/dashboard")} style={navButton("#2563eb")}>Dashboard</button>
          <button onClick={() => navigate("/tasks")} style={navButton("#16a34a")}>Tasks</button>
          <button onClick={logout} style={navButton("#ef4444")}>Logout</button>
        </div>
      </nav>

      <main style={{ padding: "40px" }}>
        <section style={hero}>
          <div>
            <p style={smallTitle}>PERSONAL WORKSPACE</p>
            <h1 style={mainTitle}>My Tasks</h1>
            <p style={subtitle}>Manage your assigned tasks and update progress in real time.</p>
          </div>

          <div style={stats}>
            <Stat label="Todo" value={todo} color="#f59e0b" />
            <Stat label="Progress" value={progress} color="#8b5cf6" />
            <Stat label="Completed" value={completed} color="#16a34a" />
          </div>
        </section>

        <section style={{ marginTop: "35px" }}>
          {tasks.length === 0 ? (
            <div style={emptyBox}>
              <h2>📭 No tasks assigned yet</h2>
              <p>Your assigned tasks will appear here once they are created.</p>
            </div>
          ) : (
            <div style={taskGrid}>
              {tasks.map((task) => (
                <div key={task._id} style={taskCard(task.status)}>
                  <div style={cardHeader}>
                    <h3 style={{ margin: 0 }}>{task.title}</h3>
                    <span style={priorityBadge(task.priority)}>{task.priority}</span>
                  </div>

                  <p style={description}>
                    {task.description || "No description added."}
                  </p>

                  <div style={detailsBox}>
                    <p>📁 <b>Project:</b> {task.project?.title || "Unknown"}</p>
                    <p>📅 <b>Due Date:</b> {task.dueDate || "Not set"}</p>
                  </div>

                  <label style={label}>Update Status</label>
                  <select
                    value={task.status}
                    onChange={(e) => updateStatus(task._id, e.target.value)}
                    style={statusSelect(task.status)}
                  >
                    <option>Todo</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={{ ...statCard, borderTop: `5px solid ${color}` }}>
      <p>{label}</p>
      <h2 style={{ color }}>{value}</h2>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
  fontFamily: "Arial, sans-serif",
};

const nav = {
  background: "#111827",
  color: "white",
  padding: "20px 40px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
};

function navButton(bg) {
  return {
    background: bg,
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  };
}

const hero = {
  background: "linear-gradient(135deg, #ffffff, #ede9fe)",
  padding: "35px",
  borderRadius: "24px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  display: "flex",
  justifyContent: "space-between",
  gap: "25px",
  flexWrap: "wrap",
};

const smallTitle = {
  color: "#7c3aed",
  fontWeight: "bold",
  letterSpacing: "1px",
};

const mainTitle = {
  fontSize: "44px",
  margin: "6px 0",
  color: "#111827",
};

const subtitle = {
  color: "#6b7280",
  fontSize: "17px",
};

const stats = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(110px, 1fr))",
  gap: "15px",
};

const statCard = {
  background: "white",
  padding: "18px",
  borderRadius: "18px",
  boxShadow: "0 5px 16px rgba(0,0,0,0.08)",
  minWidth: "110px",
};

const taskGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
  gap: "24px",
};

function taskCard(status) {
  const color =
    status === "Completed" ? "#16a34a" :
    status === "In Progress" ? "#8b5cf6" :
    "#f59e0b";

  return {
    background: "rgba(255,255,255,0.95)",
    padding: "26px",
    borderRadius: "24px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.09)",
    borderTop: `7px solid ${color}`,
  };
}

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
};

const description = {
  color: "#6b7280",
  minHeight: "48px",
  lineHeight: "1.5",
};

const detailsBox = {
  background: "#f9fafb",
  padding: "14px",
  borderRadius: "14px",
  color: "#374151",
  marginBottom: "16px",
};

const label = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "bold",
  color: "#374151",
};

function priorityBadge(priority) {
  const bg = priority === "High" ? "#fee2e2" : priority === "Medium" ? "#fef3c7" : "#dcfce7";
  const color = priority === "High" ? "#991b1b" : priority === "Medium" ? "#92400e" : "#166534";

  return {
    background: bg,
    color,
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "bold",
  };
}

function statusSelect(status) {
  const color =
    status === "Completed" ? "#16a34a" :
    status === "In Progress" ? "#8b5cf6" :
    "#f59e0b";

  return {
    width: "100%",
    padding: "13px",
    border: `2px solid ${color}`,
    borderRadius: "12px",
    color,
    fontWeight: "bold",
    background: "white",
  };
}

const emptyBox = {
  background: "white",
  padding: "45px",
  borderRadius: "24px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  textAlign: "center",
  color: "#374151",
};
