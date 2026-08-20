# Task Manager API

Express and MongoDB Task Management REST API used by the React frontend.

Run:

```bash
cd student-portfolio/task-manager-api
npm install
npm start
```

Create a `.env` file from `.env.example` and set `MONGO_URI` to your MongoDB connection string. The API listens on `http://localhost:5000` by default.

Endpoints:

- `GET /tasks` — list tasks
- `POST /tasks` — create task (JSON body `{ "title": "...", "description": "...", "priority": "low|medium|high" }`)
- `PUT /tasks/:id` — update task (JSON body with any of `title`, `description`, `completed`, or `priority`)
- `DELETE /tasks/:id` — delete task

Notes:

- Requests to `POST`/`PUT` must include `Content-Type: application/json` header.
- 404 handler and global error handler are included.
