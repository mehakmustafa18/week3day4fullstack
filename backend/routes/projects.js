const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const authMiddleware = require('../middleware/auth');

// GET /api/projects
router.get('/', authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user._id })
      .populate('members', 'name role email avatar')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// GET /api/projects/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, createdBy: req.user._id })
      .populate('members', 'name role email avatar');
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/projects
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, techStack, status, members, deadline, priority } = req.body;
    const project = await Project.create({
      title, description,
      techStack: techStack || [],
      status: status || 'active',
      members: members || [],
      deadline, priority,
      createdBy: req.user._id
    });
    await project.populate('members', 'name role email avatar');
    res.status(201).json({ message: 'Project created!', project });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// PUT /api/projects/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { ...req.body },
      { new: true, runValidators: true }
    ).populate('members', 'name role email avatar');
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    res.json({ message: 'Project updated!', project });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// DELETE /api/projects/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    res.json({ message: 'Project deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
