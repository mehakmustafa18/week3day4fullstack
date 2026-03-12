const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const Project = require('../models/Project');
const authMiddleware = require('../middleware/auth');

// GET /api/members
router.get('/', authMiddleware, async (req, res) => {
  try {
    const members = await Member.find({ createdBy: req.user._id })
      .populate('projects', 'title status')
      .sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/members/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const member = await Member.findOne({ _id: req.params.id, createdBy: req.user._id })
      .populate('projects', 'title status');
    if (!member) return res.status(404).json({ message: 'Member not found.' });
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/members
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, role, email, projects, phone, department, status } = req.body;
    const exists = await Member.findOne({ email, createdBy: req.user._id });
    if (exists) return res.status(409).json({ message: 'Member with this email already exists.' });

    const member = await Member.create({
      name, role, email,
      projects: projects || [],
      phone, department,
      status: status || 'active',
      createdBy: req.user._id
    });
    await member.populate('projects', 'title status');
    res.status(201).json({ message: 'Member added!', member });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// PUT /api/members/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const member = await Member.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { ...req.body },
      { new: true, runValidators: true }
    ).populate('projects', 'title status');
    if (!member) return res.status(404).json({ message: 'Member not found.' });
    res.json({ message: 'Member updated!', member });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// DELETE /api/members/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const member = await Member.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!member) return res.status(404).json({ message: 'Member not found.' });

    // Remove from projects
    await Project.updateMany({ members: member._id }, { $pull: { members: member._id } });

    res.json({ message: 'Member removed successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
