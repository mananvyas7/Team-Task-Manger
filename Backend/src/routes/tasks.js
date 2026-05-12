const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const router = express.Router();

router.post("/", auth, role("Admin"), async (req, res) => {
  try {
    const { title, description, project, assignedTo, status, priority, dueDate } = req.body;

    if (!title || !project) {
      return res.status(400).json({ message: "Title and project are required" });
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo: assignedTo || req.user.id,
      createdBy: req.user.id,
      status,
      priority,
      dueDate,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Task creation failed", error: error.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [{ createdBy: req.user.id }, { assignedTo: req.user.id }],
    })
      .populate("project", "title")
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, priority, dueDate },
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Task update failed", error: error.message });
  }
});

router.delete("/:id", auth, role("Admin"), async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Task delete failed", error: error.message });
  }
});

module.exports = router;
