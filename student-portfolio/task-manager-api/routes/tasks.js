const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const authenticate = require('../middleware/auth');
const { validateTask, validateTaskUpdate } = require('../middleware/validate');
const cache = require('../cache');
const taskEvents = require('../events');

const router = express.Router();
const cacheEnabled = process.env.TASK_CACHE_ENABLED !== 'false';

function requireJsonContent(req, res, next) {
  if ((req.method === 'POST' || req.method === 'PUT') && !req.is('application/json')) {
    return res.status(415).json({ error: 'Content-Type must be application/json' });
  }
  next();
}

async function validateId(req, res, next) {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID format' });
  const task = await Task.findOne({ _id: id, owner: req.user.id }).lean();
  if (!task) return res.status(404).json({ error: 'Task not found' });
  req.task = task;
  next();
}

router.use(authenticate);
router.use(requireJsonContent);

router.get('/', async (req, res, next) => {
  try {
    const cacheKey = `all_tasks:${req.user.id}`;
    if (cacheEnabled) {
      const cached = cache.get(cacheKey);
      if (cached !== undefined) {
        console.log(`[CACHE HIT] GET /tasks (${cacheKey})`);
        return res.status(200).json(cached);
      }
      console.log(`[CACHE MISS] GET /tasks (${cacheKey})`);
    } else {
      console.log('[CACHE DISABLED] GET /tasks');
    }

    const docs = await Task.find({ owner: req.user.id }).lean();
    const mapped = docs.map(d => ({ id: d._id, title: d.title, description: d.description || '', completed: d.completed, priority: d.priority, createdAt: d.createdAt }));
    if (cacheEnabled) {
      cache.set(cacheKey, mapped);
      console.log(`[CACHE SET] GET /tasks (${cacheKey})`);
    }
    res.status(200).json(mapped);
  } catch (err) { next(err); }
});

router.post('/', validateTask, async (req, res, next) => {
  try {
    const { title, description = '', completed = false, priority = 'medium' } = req.body;
    const created = await Task.create({ owner: req.user.id, title, description, completed, priority });
    cache.del(`all_tasks:${req.user.id}`);
    console.log(`[CACHE INVALIDATED] POST /tasks (${req.user.id})`);
    const responseTask = { id: created._id, title: created.title, description: created.description, completed: created.completed, priority: created.priority, createdAt: created.createdAt };
    res.status(201).json(responseTask);
    console.log(`[API] Response sent at ${new Date().toISOString()}`);
    taskEvents.emit('task-created', created);
  } catch (err) { next(err); }
});

router.put('/:id', validateTaskUpdate, validateId, async (req, res, next) => {
  try {
    const updates = {};
    ['title', 'description', 'completed', 'priority'].forEach(key => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });
    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      updates,
      { new: true, runValidators: true, context: 'query' }
    ).lean();
    if (!updated) return res.status(404).json({ error: 'Task not found' });
    cache.del(`all_tasks:${req.user.id}`);
    console.log(`[CACHE INVALIDATED] PUT /tasks/${req.params.id} (${req.user.id})`);
    res.status(200).json({ id: updated._id, title: updated.title, description: updated.description, completed: updated.completed, priority: updated.priority, createdAt: updated.createdAt });
  } catch (err) { next(err); }
});

router.delete('/:id', validateId, async (req, res, next) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    cache.del(`all_tasks:${req.user.id}`);
    console.log(`[CACHE INVALIDATED] DELETE /tasks/${req.params.id} (${req.user.id})`);
    res.status(200).json({ message: 'Task deleted' });
  } catch (err) { next(err); }
});

router.get('/:id', validateId, async (req, res, next) => {
  try {
    const d = req.task;
    res.status(200).json({ id: d._id, title: d.title, description: d.description || '', completed: d.completed, priority: d.priority, createdAt: d.createdAt });
  } catch (err) { next(err); }
});

module.exports = router;