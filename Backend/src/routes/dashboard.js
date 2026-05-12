const express = require("express");
const jwt = require("jsonwebtoken");
const Task = require("../models/Task");
const Project = require("../models/Project");

const router = express.Router();

function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

router.get("/", auth, async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const tasks = await Task.find({
      $or: [{ createdBy: req.user.id }, { assignedTo: req.user.id }],
    });

    const projects = await Project.find({
      $or: [{ createdBy: req.user.id }, { members: req.user.id }],
    });

    const totalTasks = tasks.length;
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const todo = tasks.filter((t) => t.status === "Todo").length;
    const overdue = tasks.filter(
      (t) => t.dueDate && t.dueDate < today && t.status !== "Completed"
    ).length;

    res.json({
      totalProjects: projects.length,
      totalTasks,
      completed,
      inProgress,
      todo,
      overdue,
      recentTasks: tasks.slice(-5).reverse(),
    });
  } catch (error) {
    res.status(500).json({ message: "Dashboard fetch failed", error: error.message });
  }
});

module.exports = router;
