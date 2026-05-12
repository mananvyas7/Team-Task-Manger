import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Tasks() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [status, setStatus] = useState("Todo");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  async function fetchProjects() {
    const res = await fetch("http://localhost:8000/api/projects", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProjects(Array.isArray(data) ? data : []);
  }

  async function fetchTasks() {
    const res = await fetch("http://localhost:8000/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTasks(Array.isArray(data) ? data : []);
  }

  async function fetchUsers() {
    const res = await fetch("http://localhost:8000/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
  }

  async function createTask(e) {
    e.preventDefault();

    const res = await fetch("http://localhost:8000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        project,
        assignedTo,
        status,
        priority,
        dueDate,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Task creation failed");
      return;
    }

    setTitle("");
    setDescription("");
    setProject("");
    setAssignedTo("");
    setStatus("Todo");
    setPriority("Medium");
    setDueDate("");
    fetchTasks();
  }

  async function updateStatus(taskId, newStatus) {
    const task = tasks.find((t) => t._id === taskId);

    const res = await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...task, status: newStatus }),
    });

    if (!res.ok) {
      alert("Status update failed");
      return;
    }

    fetchTasks();
  }

  async function deleteTask(taskId) {
    if (!confirm("Delete this task?")) return;

    const res = await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      alert("Delete failed");
      return;
    }

    fetchTasks();
  }

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetchProjects();
    fetchTasks();
    fetchUsers();
  }, []);

  const completed = tasks.filter((t) => t.status === "Completed").length;
  const progress = tasks.filter((t) => t.status === "In Progress").length;
  const todo = tasks.filter((t) => t.status === "Todo").length;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Arial, sans-serif" }}>
      <nav style={navStyle}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>Team Task Manager</h2>

        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => navigate("/dashboard")} style={navBtn("#374151")}>Dashboard</button>
          <button onClick={() => navigate("/projects")} style={navBtn("#2563eb")}>Projects</button>
          <button onClick={() => navigate("/my-tasks")} style={navBtn("#7c3aed")}>My Tasks</button>
        </div>
      </nav>

      <main style={{ padding: "40px" }}>
        <section style={heroStyle}>
          <div>
            <h1 style={{ fontSize: "40px", margin: 0, color: "#111827" }}>Tasks</h1>
            <p style={{ color: "#6b7280", fontSize: "16px" }}>
              Create, assign, prioritize, and track project tasks.
            </p>
          </div>

          <div style={statsGrid}>
            <div style={statCard("#2563eb")}><p>Total</p><h2>{tasks.length}</h2></div>
            <div style={statCard("#f59e0b")}><p>Todo</p><h2>{todo}</h2></div>
            <div style={statCard("#8b5cf6")}><p>Progress</p><h2>{progress}</h2></div>
            <div style={statCard("#16a34a")}><p>Done</p><h2>{completed}</h2></div>
          </div>
        </section>

        <section style={formCard}>
          <h2 style={{ fontSize: "24px", marginBottom: "18px", color: "#111827" }}>Create New Task</h2>

          <form onSubmit={createTask}>
            <div style={twoCol}>
              <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" style={inputStyle} />

              <select required value={project} onChange={(e) => setProject(e.target.value)} style={inputStyle}>
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>{p.title}</option>
                ))}
              </select>
            </div>

            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Task description" style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }} />

            <div style={threeCol}>
              <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} style={inputStyle}>
                <option value="">Assign to myself</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>

              <select value={status} onChange={(e) => setStatus(e.target.value)} style={inputStyle}>
                <option>Todo</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>

              <select value={priority} onChange={(e) => setPriority(e.target.value)} style={inputStyle}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={inputStyle} />
            </div>

            <button style={primaryBtn}>Create Task</button>
          </form>
        </section>

        <section style={{ marginTop: "35px" }}>
          <h2 style={{ fontSize: "28px", marginBottom: "18px", color: "#111827" }}>Task Board</h2>

          {tasks.length === 0 ? (
            <div style={emptyCard}>
              <h3 style={{ fontSize: "22px" }}>No tasks yet</h3>
              <p style={{ color: "#6b7280" }}>Create your first task using the form above.</p>
            </div>
          ) : (
            <div style={gridStyle}>
              {tasks.map((task) => (
                <div key={task._id} style={taskCard(task.status)}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "center" }}>
                    <h3 style={{ margin: 0, fontSize: "22px", color: "#111827" }}>{task.title}</h3>
                    <span style={priorityBadge(task.priority)}>{task.priority}</span>
                  </div>

                  <p style={{ color: "#6b7280", minHeight: "45px" }}>
                    {task.description || "No description added."}
                  </p>

                  <div style={infoBox}>
                    <p><b>Project:</b> {task.project?.title || "Unknown"}</p>
                    <p><b>Assigned To:</b> {task.assignedTo?.name || "User"}</p>
                    <p><b>Due:</b> {task.dueDate || "No due date"}</p>
                  </div>

                  <select value={task.status} onChange={(e) => updateStatus(task._id, e.target.value)} style={statusSelect(task.status)}>
                    <option>Todo</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>

                  <button onClick={() => deleteTask(task._id)} style={deleteBtn}>Delete Task</button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

const navStyle = {
  background: "#111827",
  color: "white",
  padding: "20px 40px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

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

const heroStyle = {
  background: "linear-gradient(135deg, #ffffff, #ecfdf5)",
  padding: "30px",
  borderRadius: "20px",
  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
  display: "flex",
  justifyContent: "space-between",
  gap: "25px",
  flexWrap: "wrap",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(90px, 1fr))",
  gap: "12px",
};

function statCard(color) {
  return {
    background: "white",
    padding: "16px",
    borderRadius: "16px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
    borderTop: `5px solid ${color}`,
    minWidth: "90px",
  };
}

const formCard = {
  marginTop: "30px",
  background: "white",
  padding: "28px",
  borderRadius: "20px",
  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
};

const twoCol = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "14px",
};

const threeCol = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "14px",
};

const inputStyle = {
  width: "100%",
  padding: "13px",
  marginBottom: "14px",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  fontSize: "15px",
};

const primaryBtn = {
  padding: "13px 22px",
  background: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "22px",
};

function taskCard(status) {
  const color =
    status === "Completed" ? "#16a34a" :
    status === "In Progress" ? "#8b5cf6" :
    "#f59e0b";

  return {
    background: "white",
    padding: "24px",
    borderRadius: "20px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
    borderTop: `6px solid ${color}`,
  };
}

function priorityBadge(priority) {
  const bg = priority === "High" ? "#fee2e2" : priority === "Medium" ? "#fef3c7" : "#dcfce7";
  const color = priority === "High" ? "#991b1b" : priority === "Medium" ? "#92400e" : "#166534";

  return {
    background: bg,
    color,
    padding: "7px 11px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  };
}

const infoBox = {
  background: "#f9fafb",
  padding: "12px",
  borderRadius: "12px",
  color: "#374151",
  marginBottom: "14px",
};

function statusSelect(status) {
  const color =
    status === "Completed" ? "#16a34a" :
    status === "In Progress" ? "#8b5cf6" :
    "#f59e0b";

  return {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    border: `1px solid ${color}`,
    borderRadius: "10px",
    color,
    fontWeight: "bold",
  };
}

const deleteBtn = {
  width: "100%",
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "11px 14px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};

const emptyCard = {
  background: "white",
  padding: "35px",
  borderRadius: "20px",
  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
};
