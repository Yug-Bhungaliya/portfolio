const express = require('express');
const cors = require('cors');
const nodeCrypto = require('crypto');
if (!globalThis.crypto) globalThis.crypto = nodeCrypto.webcrypto;
const mongoose = require('mongoose');
require('dotenv').config();
const authRouter = require('./routes/auth');
const tasksRouter = require('./routes/tasks');
const cache = require('./cache');
require('./listeners');
const authenticate = require('./middleware/auth');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 5000;

function createLocalDescription(title) {
  return `Complete "${title}" by defining the expected outcome, implementing the required changes, and verifying the result with an appropriate test.`;
}

function hasUsableOpenAiKey(value) {
  return typeof value === 'string'
    && value.trim().length > 0
    && !/^your[_-].*key_here$/i.test(value.trim())
    && !/^replace[-_].*$/i.test(value.trim());
}

app.use(express.json());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const allowed = ['http://localhost:5173', 'http://localhost:5174'];
    if (allowed.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  }
}));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
  next();
});

app.use('/auth', authRouter);
app.use('/tasks', tasksRouter);
app.post('/api/ai/generate-description', authenticate, async (req, res) => {
  const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
  if (!title) return res.status(400).json({ error: 'Task title is required' });

  if (!hasUsableOpenAiKey(process.env.OPENAI_API_KEY)) {
    return res.status(200).json({
      description: createLocalDescription(title),
      fallback: true,
      demo: true,
      message: 'Demo suggestion added. You can edit it before saving.'
    });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 10000, maxRetries: 0 });
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: `Write a concise, actionable task description in one or two sentences for: ${title}`
      }]
    });
    const description = completion.choices[0]?.message?.content?.trim();
    if (!description) throw new Error('AI returned an empty description');
    res.status(200).json({ description, fallback: false });
  } catch (err) {
    console.error('AI description generation failed:', err.message);
    res.status(200).json({
      description: '',
      fallback: true,
      message: 'AI suggestions are temporarily unavailable. Enter the description manually.'
    });
  }
});
app.get('/cache-stats', (_req, res) => {
  const stats = cache.getStats();
  res.json({
    hits: stats.hits,
    keys: cache.keys(),
    misses: stats.misses
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'Route does not exist' });
});

app.use((err, req, res, _next) => {
  console.error(err);
  if (err.name === 'ValidationError') {
    const details = Object.keys(err.errors).map(field => ({ field, message: err.errors[field].message }));
    return res.status(400).json({ error: 'Validation Error', details });
  }
  if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid ID', message: err.message });
  res.status(err.status || 500).json({ error: err.message || 'Something went wrong' });
});

async function startServer() {
  const mongoUrl = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://mongodb:27017/taskdb';
  await mongoose.connect(mongoUrl);
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

if (require.main === module) {
  startServer().catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
}

module.exports = { app, startServer };