const express = require('express');
const router = express.Router();
const tasks = require('../data/tasksData');

// Middleware: require JSON Content-Type for POST and PUT
function requireJsonContent(req, res, next) {
  if ((req.method === 'POST' || req.method === 'PUT') && req.headers['content-type'] !== 'application/json') {
    return res.status(415).json({ error: 'Content-Type must be application/json' });
  }
  next();
}

// Route-specific middleware: validate numeric id and attach task
function validateId(req, res, next) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid ID format' });
  const task = tasks.getById(id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  req.task = task;
  next();
}

router.use(requireJsonContent);

// GET /tasks
router.get('/', (req, res) => {
  res.status(200).json(tasks.getAll());
});

// POST /tasks
router.post('/', (req, res) => {
  const { title, completed = false } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const created = tasks.create({ title, completed });
  res.status(201).json(created);
});

// PUT /tasks/:id
router.put('/:id', validateId, (req, res) => {
  const { title, completed } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const updated = tasks.update(req.task.id, { title, completed });
  res.status(200).json(updated);
});

// DELETE /tasks/:id
router.delete('/:id', validateId, (req, res) => {
  tasks.remove(req.task.id);
  res.status(200).json({ message: 'Task deleted' });
});

module.exports = router;
