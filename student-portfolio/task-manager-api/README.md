# Task Manager API

Simple Express-based in-memory Task Management REST API.

Run:

```bash
cd student-portfolio/task-manager-api
npm install
npm start
```

Endpoints:

- `GET /tasks` — list tasks
- `POST /tasks` — create task (JSON body `{ "title": "..." }`)
- `PUT /tasks/:id` — update task (JSON body `{ "title": "...", "completed": true|false }`)
- `DELETE /tasks/:id` — delete task

Notes:

- Requests to `POST`/`PUT` must include `Content-Type: application/json` header.
- 404 handler and global error handler are included.
