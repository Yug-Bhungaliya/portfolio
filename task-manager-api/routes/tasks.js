const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const mongoose = require('mongoose');

// Middleware: require JSON Content-Type for POST and PUT
function requireJsonContent(req, res, next) {
  if ((req.method === 'POST' || req.method === 'PUT') && (!req.is('application/json'))) {
    return res.status(415).json({ error: 'Content-Type must be application/json' });
  }
  next();
}

// Route-specific middleware: validate ObjectId and attach task
async function validateId(req, res, next) {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID format' });
  const task = await Task.findById(id).lean();
  if (!task) return res.status(404).json({ error: 'Task not found' });
  req.task = task;
  next();
}

router.use(requireJsonContent);

// GET /tasks
router.get('/', async (req, res, next) => {
  try {
    const docs = await Task.find().lean();
    const mapped = docs.map(d => ({ id: d._id, title: d.title, completed: d.completed }));
    res.status(200).json(mapped);
  } catch (err) { next(err) }
});

// POST /tasks
router.post('/', async (req, res, next) => {
  try {
    const { title, completed = false } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const created = await Task.create({ title, completed });
    res.status(201).json({ id: created._id, title: created.title, completed: created.completed });
  } catch (err) { next(err) }
});

// PUT /tasks/:id
router.put('/:id', validateId, async (req, res, next) => {
  try {
    const { title, completed } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const updated = await Task.findByIdAndUpdate(req.params.id, { title, completed: Boolean(completed) }, { new: true }).lean();
    res.status(200).json({ id: updated._id, title: updated.title, completed: updated.completed });
  } catch (err) { next(err) }
});

// DELETE /tasks/:id
router.delete('/:id', validateId, async (req, res, next) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Task deleted' });
  } catch (err) { next(err) }
});

module.exports = router;
