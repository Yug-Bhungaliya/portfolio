const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, options)
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.error || data?.message || `HTTP ${response.status}`)
  }

  return data
}

export const getTasks = () => request('/tasks')

export const createTask = task => request('/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(task)
})

export const updateTask = (id, task) => request(`/tasks/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(task)
})

export const deleteTask = id => request(`/tasks/${id}`, { method: 'DELETE' })