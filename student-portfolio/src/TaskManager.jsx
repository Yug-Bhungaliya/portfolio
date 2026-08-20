import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './TaskManager.css'

export default function TaskManager() {
  const [tasks, setTasks] = useState([])
  const [loadingTasks, setLoadingTasks] = useState(false)
  const [tasksError, setTasksError] = useState(null)

  useEffect(() => {
    async function loadTasks() {
      setLoadingTasks(true)
      setTasksError(null)
      try {
        const res = await fetch('http://localhost:5000/tasks')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setTasks(data)
      } catch (err) {
        setTasksError(err.message)
      } finally {
        setLoadingTasks(false)
      }
    }
    loadTasks()
  }, [])

  async function refreshTasks() {
    setLoadingTasks(true)
    try {
      const res = await fetch('http://localhost:5000/tasks')
      const data = await res.json()
      setTasks(data)
    } catch (err) {
      setTasksError(err.message)
    } finally {
      setLoadingTasks(false)
    }
  }

  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newPriority, setNewPriority] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [editingDescription, setEditingDescription] = useState('')
  const [editingPriority, setEditingPriority] = useState('medium')

  async function handleCreate(e) {
    e.preventDefault()
    if (!newTitle.trim()) return
    try {
      const payload = { title: newTitle.trim() }
      if (newDescription.trim()) payload.description = newDescription.trim()
      if (newPriority) payload.priority = newPriority
      const res = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.error || 'Create failed')
      }
      setNewTitle('')
      setNewDescription('')
      setNewPriority('')
      await refreshTasks()
    } catch (err) {
      setTasksError(err.message)
    }
  }

  function startEdit(task) {
    setEditingId(task.id)
    setEditingTitle(task.title)
    setEditingDescription(task.description || '')
    setEditingPriority(task.priority || 'medium')
  }

  async function toggleComplete(task) {
    try {
      const res = await fetch(`http://localhost:5000/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: task.title, description: task.description || '', priority: task.priority || 'medium', completed: !task.completed })
      })
      if (!res.ok) throw new Error('Toggle failed')
      await refreshTasks()
    } catch (err) {
      setTasksError(err.message)
    }
  }

  async function saveEdit(e) {
    e.preventDefault()
    if (!editingTitle.trim()) return
    try {
      const payload = { title: editingTitle.trim(), priority: editingPriority }
      if (editingDescription.trim()) payload.description = editingDescription.trim()
      const res = await fetch(`http://localhost:5000/tasks/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Update failed')
      setEditingId(null)
      setEditingTitle('')
      setEditingDescription('')
      setEditingPriority('medium')
      await refreshTasks()
    } catch (err) {
      setTasksError(err.message)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this task?')) return
    try {
      const res = await fetch(`http://localhost:5000/tasks/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      await refreshTasks()
    } catch (err) {
      setTasksError(err.message)
    }
  }

  return (
    <div className="card tasks-section">
      <div className="section-heading">
        <p className="eyebrow">Tasks</p>
        <h2>Tasks from the API</h2>
      </div>
      <div className="tasks-list">
        <div className="search-wrap">
          <form onSubmit={handleCreate} className="search-form">
            <input type="text" className="search-input search-title" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="New task title" />
            <input type="text" className="search-input search-desc" value={newDescription} onChange={e => setNewDescription(e.target.value)} placeholder="Short description (optional)" />
            <select value={newPriority} onChange={e => setNewPriority(e.target.value)} className="priority-select">
              <option value="" disabled>Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button type="submit" className="btn btn-add">Add</button>
          </form>
        </div>

        {loadingTasks && <p>Loading tasks…</p>}
        {tasksError && <p className="error">Error: {tasksError}</p>}
        {!loadingTasks && !tasksError && (
          <ul>
            {tasks.length === 0 && <li>No tasks yet.</li>}
            {tasks.map(t => (
              <li key={t.id} className="task-card">
                <div className="task-left">
                    <label className="task-checkbox">
                      <input type="checkbox" checked={t.completed} onChange={() => toggleComplete(t)} />
                    </label>
                    <div className="task-main">
                      <div className="task-header">
                        <span className={`task-title ${t.completed ? 'task-completed' : ''}`}>{t.title}</span>
                        <span className={`priority-pill priority-${t.priority || 'medium'}`}>{(t.priority || 'medium').toUpperCase()}</span>
                      </div>
                      {t.description && <div className="task-meta">{t.description}</div>}
                    </div>
                  </div>

                  <div className="task-actions">
                  {editingId === t.id ? (
                    <form onSubmit={saveEdit} className="inline-edit">
                        <input type="text" className="search-input" value={editingTitle} onChange={e => setEditingTitle(e.target.value)} />
                        <input type="text" className="search-input" value={editingDescription} onChange={e => setEditingDescription(e.target.value)} placeholder="Description" />
                        <select value={editingPriority} onChange={e => setEditingPriority(e.target.value)} className="priority-select">
                          <option value="" disabled>Priority</option>
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                        <button type="submit" className="btn btn-small">Save</button>
                        <button type="button" className="task-btn" onClick={() => setEditingId(null)}>Cancel</button>
                    </form>
                  ) : (
                    <>
                        <button className="btn btn-small" onClick={() => startEdit(t)}>✏️ Edit</button>
                        <button className="btn btn-small" onClick={() => handleDelete(t.id)}>🗑️ Delete</button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
