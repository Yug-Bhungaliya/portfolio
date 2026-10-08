# Task Manager API

Express and MongoDB Task Management REST API used by the React frontend.

Run:

```bash
cd student-portfolio/task-manager-api
npm install
npm start
```

Create a `.env` file from `.env.example` and set `MONGO_URI` to your MongoDB connection string. The API listens on `http://localhost:5000` by default.

Set `JWT_SECRET` in `.env` to a long random value before starting the API.

Authentication endpoints:

- `POST /auth/register` - register with `{ "email": "student@example.com", "password": "secret123" }`
- `POST /auth/login` - receive a JWT using the same credentials

Send the returned token on every task request:

```text
Authorization: Bearer <token>
```

Task endpoints:

- `GET /tasks` — list tasks
- `POST /tasks` — create task (JSON body `{ "title": "...", "description": "...", "priority": "low|medium|high" }`)
- `PUT /tasks/:id` — update task (JSON body with any of `title`, `description`, `completed`, or `priority`)
- `DELETE /tasks/:id` — delete task

Notes:

- Requests to `POST`/`PUT` must include `Content-Type: application/json` header.
- Task data is isolated per authenticated user.
- Task creation and updates reject missing or invalid fields before database access.
- 404 handler and global error handler are included.

## In-memory caching practical

`GET /tasks` caches the response for each authenticated user for 60 seconds using
`node-cache`. The cache is removed after a successful `POST /tasks`,
`PUT /tasks/:id`, or `DELETE /tasks/:id`, so a write cannot leave the list stale.
The owner ID is part of the cache key to keep users' task data isolated.

### Measuring the difference

Use an authenticated request in Postman or Thunder Client:

1. Send `GET http://localhost:5000/tasks` three times without changing data.
   Record each client response time. The first request is a cache miss; the
   second and third requests are cache hits.
2. Restart the API with `TASK_CACHE_ENABLED=false` and send the same request
   three times. This temporarily bypasses both the cache lookup and cache
   population without changing the committed implementation.
3. Restart the API normally (without `TASK_CACHE_ENABLED=false`) before using
   the API again.

Record the actual `Time` value shown by the client in this table:

| Request | Cached (ms) | Uncached (ms) |
| --- | ---: | ---: |
| 1 | 23 | 14 |
| 2 | 2 | 6 |
| 3 | 1 | 4 |
| Average | 8.7 | 8.0 |

Sample run captured locally on 2026-10-08 using PowerShell against an empty
MongoDB task collection. The cached API ran on port 5050 and the uncached API
ran on port 5051 with `TASK_CACHE_ENABLED=false`; readings include local
HTTP-client overhead and will vary by machine and database load.

The expected result is that requests 2 and 3 in the cached column are faster
than the uncached requests because they avoid the MongoDB query. Network,
database, and local machine load can make individual readings vary.

## Background task-created notifications

The API uses Node.js `EventEmitter` for non-blocking task-created
notifications. After a task is saved, `POST /tasks` sends the response and
then emits `task-created`. The listener defers its work with `setImmediate`
and waits 500 ms with `setTimeout` to make the asynchronous ordering visible.

Example server output after creating a task:

```text
[API] Response sent at 2026-10-08T07:30:10.100Z
[Notification] Task "Finish practical" handler started at 2026-10-08T07:30:10.101Z (assigned user: USER_ID)
[Notification] Task "Finish practical" completed at 2026-10-08T07:30:10.602Z (assigned user: USER_ID)
```

The API response timestamp appears before notification completion, proving that
the delayed notification does not block the task-creation response.
