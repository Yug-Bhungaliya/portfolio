let nextId = 1;
const tasks = [
  { id: nextId++, title: 'Sample task', completed: false },
];

function getAll() {
  return tasks;
}

function getById(id) {
  return tasks.find(t => t.id === id);
}

function create({ title, completed = false }) {
  const task = { id: nextId++, title, completed };
  tasks.push(task);
  return task;
}

function update(id, { title, completed }) {
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return null;
  tasks[idx] = { id, title, completed: Boolean(completed) };
  return tasks[idx];
}

function remove(id) {
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return false;
  tasks.splice(idx, 1);
  return true;
}

module.exports = { getAll, getById, create, update, remove };
