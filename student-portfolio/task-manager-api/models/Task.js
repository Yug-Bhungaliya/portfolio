const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'], trim: true },
  description: { type: String, default: '' },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  createdAt: { type: Date, default: Date.now }
});

// Trim whitespace before saving (synchronous)
taskSchema.pre('save', function () {
  if (this.title && typeof this.title === 'string') this.title = this.title.trim();
});

module.exports = mongoose.model('Task', taskSchema);
