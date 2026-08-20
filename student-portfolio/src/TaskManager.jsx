import React, { useEffect, useState } from 'react'
import { createTask, deleteTask, getTasks, updateTask } from './api'
import './TaskManager.css'

export default function TaskManager() {
  const [tasks, setTasks] = useState([])
  const [loadingTasks, setLoadingTasks] = useState(true)
  const [activeAction, setActiveAction] = useState(null)
  const [tasksError, setTasksError] = useState(null)

  useEffect(() => {
    async function loadTasks() {
      setLoadingTasks(true)
      setTasksError(null)
      try {
        setTasks(await getTasks())
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
    setTasksError(null)
    try {
      setTasks(await getTasks())
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
    setActiveAction('create')
    setTasksError(null)
    try {
      const payload = { title: newTitle.trim() }
      if (newDescription.trim()) payload.description = newDescription.trim()
      if (newPriority) payload.priority = newPriority
      await createTask(payload)
      setNewTitle('')
      setNewDescription('')
      setNewPriority('')
      await refreshTasks()
    } catch (err) {
      setTasksError(err.message)
    } finally {
      setActiveAction(null)
    }
  }

  function startEdit(task) {
    setEditingId(task.id)
    setEditingTitle(task.title)
    setEditingDescription(task.description || '')
    setEditingPriority(task.priority || 'medium')
  }

  async function toggleComplete(task) {
    setActiveAction(`toggle-${task.id}`)
    setTasksError(null)
    try {
      await updateTask(task.id, { title: task.title, description: task.description || '', priority: task.priority || 'medium', completed: !task.completed })
      await refreshTasks()
    } catch (err) {
      setTasksError(err.message)
    } finally {
      setActiveAction(null)
    }
  }

  async function saveEdit(e) {
    e.preventDefault()
    if (!editingTitle.trim()) return
    setActiveAction(`edit-${editingId}`)
    setTasksError(null)
    try {
      const payload = { title: editingTitle.trim(), priority: editingPriority }
      if (editingDescription.trim()) payload.description = editingDescription.trim()
      await updateTask(editingId, payload)
      setEditingId(null)
      setEditingTitle('')
      setEditingDescription('')
      setEditingPriority('medium')
      await refreshTasks()
    } catch (err) {
      setTasksError(err.message)
    } finally {
      setActiveAction(null)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this task?')) return
    setActiveAction(`delete-${id}`)
    setTasksError(null)
    try {
      await deleteTask(id)
      await refreshTasks()
    } catch (err) {
      setTasksError(err.message)
    } finally {
      setActiveAction(null)
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
            <button type="submit" className="btn btn-add" disabled={activeAction === 'create'}>{activeAction === 'create' ? 'Adding…' : 'Add'}</button>
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
                      <input type="checkbox" checked={t.completed} disabled={activeAction === `toggle-${t.id}`} onChange={() => toggleComplete(t)} />
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
                        <button type="submit" className="btn btn-small" disabled={activeAction === `edit-${t.id}`}>{activeAction === `edit-${t.id}` ? 'Saving…' : 'Save'}</button>
                        <button type="button" className="task-btn" onClick={() => setEditingId(null)}>Cancel</button>
                    </form>
                  ) : (
                    <>
                        <button className="btn btn-small" disabled={activeAction !== null} onClick={() => startEdit(t)}>✏️ Edit</button>
                        <button className="btn btn-small" disabled={activeAction === `delete-${t.id}`} onClick={() => handleDelete(t.id)}>{activeAction === `delete-${t.id}` ? 'Deleting…' : '🗑️ Delete'}</button>
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
