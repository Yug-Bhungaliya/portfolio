function validateBody({ required = [], validate = () => [] } = {}) {
  return (req, res, next) => {
    const body = req.body || {};
    const missing = required.filter(field => body[field] === undefined || body[field] === null || body[field] === '');
    const errors = [...missing.map(field => `${field} is required`), ...validate(body)];

    if (errors.length) return res.status(400).json({ error: 'Validation Error', details: errors });
    next();
  };
}

const validateTask = validateBody({
  required: ['title'],
  validate: body => {
    const errors = [];
    if (body.title !== undefined && (typeof body.title !== 'string' || !body.title.trim())) errors.push('title must be a non-empty string');
    if (body.description !== undefined && typeof body.description !== 'string') errors.push('description must be a string');
    if (body.completed !== undefined && typeof body.completed !== 'boolean') errors.push('completed must be a boolean');
    if (body.priority !== undefined && !['low', 'medium', 'high'].includes(body.priority)) errors.push('priority must be low, medium, or high');
    return errors;
  }
});

const validateTaskUpdate = validateBody({
  validate: body => {
    const errors = [];
    if (body.title !== undefined && (typeof body.title !== 'string' || !body.title.trim())) errors.push('title must be a non-empty string');
    if (body.description !== undefined && typeof body.description !== 'string') errors.push('description must be a string');
    if (body.completed !== undefined && typeof body.completed !== 'boolean') errors.push('completed must be a boolean');
    if (body.priority !== undefined && !['low', 'medium', 'high'].includes(body.priority)) errors.push('priority must be low, medium, or high');
    if (!Object.keys(body).some(field => ['title', 'description', 'completed', 'priority'].includes(field))) errors.push('at least one task field is required');
    return errors;
  }
});

module.exports = { validateBody, validateTask, validateTaskUpdate };