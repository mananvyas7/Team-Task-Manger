import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDeadline, setEditDeadline] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  async function fetchProjects() {
    const res = await fetch("http://localhost:8000/api/projects", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProjects(Array.isArray(data) ? data : []);
  }

  async function createProject(e) {
    e.preventDefault();

    const res = await fetch("http://localhost:8000/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, deadline }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Project creation failed");
      return;
    }

    setTitle("");
    setDescription("");
    setDeadline("");
    fetchProjects();
  }

  function startEdit(project) {
    setEditingId(project._id);
    setEditTitle(project.title || "");
    setEditDescription(project.description || "");
    setEditDeadline(project.deadline || "");
  }

  async function saveEdit(projectId) {
    const res = await fetch(`http://localhost:8000/api/projects/${projectId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: editTitle,
        description: editDescription,
        deadline: editDeadline,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Update failed");
      return;
    }

    setEditingId(null);
    fetchProjects();
  }

  async function deleteProject(projectId) {
    const ok = confirm("Are you sure you want to delete this project?");
    if (!ok) return;

    const res = await fetch(`http://localhost:8000/api/projects/${projectId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log("Delete response:", data);

    if (!res.ok) {
      alert(data.message || "Delete failed");
      return;
    }

    fetchProjects();
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
    fetchProjects();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Arial, sans-serif" }}>
      <nav style={navStyle}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>Team Task Manager</h2>

        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => navigate("/dashboard")} style={navBtn("#374151")}>Dashboard</button>
          <button onClick={logout} style={navBtn("#dc2626")}>Logout</button>
        </div>
      </nav>

      <main style={{ padding: "40px" }}>
        <section style={heroStyle}>
          <div>
            <h1 style={{ fontSize: "38px", marginBottom: "8px", color: "#111827" }}>Projects</h1>
            <p style={{ color: "#6b7280", fontSize: "16px" }}>
              Create, edit, delete, and organize your team projects.
            </p>
          </div>

          <div style={countBox}>
            <p style={{ color: "#6b7280", margin: 0 }}>Total Projects</p>
            <h2 style={{ fontSize: "36px", margin: 0, color: "#2563eb" }}>{projects.length}</h2>
          </div>
        </section>

        <section style={formCard}>
          <h2 style={{ fontSize: "24px", marginBottom: "18px", color: "#111827" }}>Create New Project</h2>

          <form onSubmit={createProject}>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project title" style={inputStyle} />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Project description" style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }} />
            <input value={deadline} onChange={(e) => setDeadline(e.target.value)} type="date" style={inputStyle} />

            <button style={primaryBtn}>Create Project</button>
          </form>
        </section>

        <section style={{ marginTop: "35px" }}>
          <h2 style={{ fontSize: "26px", marginBottom: "18px", color: "#111827" }}>Your Projects</h2>

          {projects.length === 0 ? (
            <div style={emptyCard}>
              <h3>No projects yet</h3>
              <p style={{ color: "#6b7280" }}>Create your first project using the form above.</p>
            </div>
          ) : (
            <div style={gridStyle}>
              {projects.map((project) => (
                <div key={project._id} style={projectCard}>
                  {editingId === project._id ? (
                    <>
                      <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} style={inputStyle} />
                      <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} style={{ ...inputStyle, minHeight: "80px" }} />
                      <input value={editDeadline} onChange={(e) => setEditDeadline(e.target.value)} type="date" style={inputStyle} />

                      <div style={{ display: "flex", gap: "10px" }}>
                        <button onClick={() => saveEdit(project._id)} style={smallBtn("#16a34a")}>Save</button>
                        <button onClick={() => setEditingId(null)} style={smallBtn("#6b7280")}>Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                        <h3 style={{ fontSize: "22px", margin: 0, color: "#111827" }}>{project.title}</h3>
                        <span style={badge}>Active</span>
                      </div>

                      <p style={{ color: "#6b7280", marginTop: "12px", minHeight: "45px" }}>
                        {project.description || "No description added."}
                      </p>

                      <div style={projectFooter}>
                        <span>📅 {project.deadline || "No deadline"}</span>
                        <span>👥 Team</span>
                      </div>

                      <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
                        <button onClick={() => startEdit(project)} style={smallBtn("#2563eb")}>Edit</button>
                        <button onClick={() => deleteProject(project._id)} style={smallBtn("#dc2626")}>Delete</button>
                      </div>
                    </>
                  )}
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
  background: "linear-gradient(135deg, #ffffff, #eff6ff)",
  padding: "30px",
  borderRadius: "18px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  flexWrap: "wrap",
};

const countBox = {
  background: "white",
  padding: "20px 30px",
  borderRadius: "16px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
};

const formCard = {
  marginTop: "30px",
  background: "white",
  padding: "28px",
  borderRadius: "18px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
  maxWidth: "700px",
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
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};

function smallBtn(bg) {
  return {
    padding: "9px 14px",
    background: bg,
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  };
}

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "22px",
};

const projectCard = {
  background: "white",
  padding: "24px",
  borderRadius: "18px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
  borderTop: "5px solid #2563eb",
};

const badge = {
  background: "#dcfce7",
  color: "#166534",
  padding: "6px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "bold",
};

const projectFooter = {
  marginTop: "20px",
  paddingTop: "15px",
  borderTop: "1px solid #e5e7eb",
  display: "flex",
  justifyContent: "space-between",
  color: "#4b5563",
  fontSize: "14px",
};

const emptyCard = {
  background: "white",
  padding: "35px",
  borderRadius: "18px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
};
