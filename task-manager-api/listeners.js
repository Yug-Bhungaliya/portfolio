const taskEvents = require('./events');

taskEvents.on('task-created', task => {
  const assignedUser = task.owner?.toString() || 'unknown';
  const startedAt = new Date().toISOString();

  setImmediate(() => {
    console.log(`[Notification] Task "${task.title}" handler started at ${startedAt} (assigned user: ${assignedUser})`);

    setTimeout(() => {
      console.log(`[Notification] Task "${task.title}" completed at ${new Date().toISOString()} (assigned user: ${assignedUser})`);
    }, 500);
  });
});
