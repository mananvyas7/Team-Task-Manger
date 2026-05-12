const express = require("express");
const Project = require("../models/Project");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const router = express.Router();

router.post("/", auth, role("Admin"), async (req, res) => {
  try {
    const { title, description, deadline } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Project title is required" });
    }

    const project = await Project.create({
      title,
      description,
      deadline,
      createdBy: req.user.id,
      members: [req.user.id],
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Project creation failed", error: error.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ createdBy: req.user.id }, { members: req.user.id }],
    }).sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch projects", error: error.message });
  }
});

router.put("/:id", auth, role("Admin"), async (req, res) => {
  try {
    const { title, description, deadline } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, deadline },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Project update failed", error: error.message });
  }
});

router.delete("/:id", auth, role("Admin"), async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Project delete failed", error: error.message });
  }
});

module.exports = router;
