const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const tasksRouter = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Enable CORS for frontend origins used by Vite (adjust as needed)
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true)
    const allowed = ['http://localhost:5173', 'http://localhost:5174']
    if (allowed.includes(origin)) return callback(null, true)
    return callback(new Error('Not allowed by CORS'))
  }
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
  next();
});

// Mount tasks router
app.use('/tasks', tasksRouter);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'Route does not exist' });
});

// Global error handler (must be last)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Something went wrong' });
});

// Connect to MongoDB then start server
const mongoUrl = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskmanager';
mongoose.connect(mongoUrl)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
