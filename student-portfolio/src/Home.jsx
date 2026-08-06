import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import profilePic from './assets/pic.jpeg'

export default function Home() {
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

  // CRUD helpers
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
  const [editingId, setEditingId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')

  async function handleCreate(e) {
    e.preventDefault()
    if (!newTitle.trim()) return
    try {
      const res = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle.trim() })
      })
      if (!res.ok) throw new Error('Create failed')
      setNewTitle('')
      await refreshTasks()
    } catch (err) {
      setTasksError(err.message)
    }
  }

  function startEdit(task) {
    setEditingId(task.id)
    setEditingTitle(task.title)
  }

  async function saveEdit(e) {
    e.preventDefault()
    if (!editingTitle.trim()) return
    try {
      const res = await fetch(`http://localhost:5000/tasks/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editingTitle.trim(), completed: false })
      })
      if (!res.ok) throw new Error('Update failed')
      setEditingId(null)
      setEditingTitle('')
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

  const skills = [
    { category: 'Frontend', items: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Vite'] },
    { category: 'Backend', items: ['Node.js', 'Express', 'REST APIs'] },
    { category: 'Tools & Platforms', items: ['Git', 'GitHub', 'VS Code', 'Figma'] }
  ]

  return (
    <>
      <div className="card professional-header hero-panel">
        <div className="hero-content">
          <div className="hero-text">
            <p className="eyebrow">Welcome to my portfolio</p>
            <h1>Hi, I'm Yug Bhungaliya</h1>
            <p className="professional-title">React Developer • Data Science Enthusiast • AI Learner</p>
            <p className="professional-summary">
              I design and develop modern, responsive web applications while exploring Data Science, artificial intelligence, and cloud technologies.
            </p>
            <div className="hero-actions">
              <Link to="/projects" className="btn">View Projects</Link>
              <Link to="/contact" className="btn btn-secondary">Contact Me</Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-avatar">
              <img src={profilePic} alt="Yug Bhungaliya" />
            </div>
          </div>
        </div>
      </div>

      <div className="card education-section">
        <div className="section-heading">
          <p className="eyebrow">Education</p>
          <h2>Learning with a strong foundation</h2>
        </div>
        <div className="education-item">
          <div className="education-header">
            <h3>Bachelor of Technology</h3>
            <span className="year">2024 - 2028</span>
          </div>
          <p className="institution">Charotar University of Science and Technology (CHARUSAT)</p>
          <p className="details">Computer Engineering | CGPA: 7.22 (Till 4th Sem)</p>
          <p className="coursework"><strong>Relevant Coursework:</strong> Web Development, Data Structures, Object-Oriented Programming, Database Management, Software Engineering</p>
        </div>
      </div>

      <div className="card skills-section">
        <div className="section-heading">
          <p className="eyebrow">Skills</p>
          <h2>Tools and technologies I work with</h2>
        </div>
        <div className="skills-grid">
          {skills.map((skillGroup, idx) => (
            <div key={idx} className="skill-group">
              <h3>{skillGroup.category}</h3>
              <div className="skill-tags">
                {skillGroup.items.map((skill, i) => (
                  <span key={i} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card tasks-section">
        <div className="section-heading">
          <p className="eyebrow">Tasks</p>
          <h2>Tasks from the API</h2>
        </div>
        <div className="tasks-list">
          <form onSubmit={handleCreate} style={{ marginBottom: 12 }}>
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="New task title" />
            <button type="submit">Add</button>
          </form>

          {loadingTasks && <p>Loading tasks…</p>}
          {tasksError && <p className="error">Error: {tasksError}</p>}
          {!loadingTasks && !tasksError && (
            <ul>
              {tasks.length === 0 && <li>No tasks yet.</li>}
              {tasks.map(t => (
                <li key={t.id} style={{ marginBottom: 8 }}>
                  {editingId === t.id ? (
                    <form onSubmit={saveEdit} style={{ display: 'inline' }}>
                      <input value={editingTitle} onChange={e => setEditingTitle(e.target.value)} />
                      <button type="submit">Save</button>
                      <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
                    </form>
                  ) : (
                    <>
                      <strong>{t.title}</strong> — {t.completed ? 'Done' : 'Pending'}
                      <button style={{ marginLeft: 8 }} onClick={() => startEdit(t)}>Edit</button>
                      <button style={{ marginLeft: 6 }} onClick={() => handleDelete(t.id)}>Delete</button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}
