import { useState } from 'react'
import { login, register } from './api'

export default function Auth({ onAuthenticated }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const response = await (mode === 'login' ? login({ email, password }) : register({ email, password }))
      localStorage.setItem('taskManagerToken', response.token)
      onAuthenticated()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card tasks-section">
      <div className="section-heading">
        <p className="eyebrow">Task Manager</p>
        <h2>{mode === 'login' ? 'Sign in to manage tasks' : 'Create your account'}</h2>
      </div>
      <form onSubmit={handleSubmit} className="search-form auth-form">
        <input
          type="email"
          className="search-input"
          value={email}
          onChange={event => setEmail(event.target.value)}
          placeholder="Email address"
          required
        />
        <input
          type="password"
          className="search-input"
          value={password}
          onChange={event => setPassword(event.target.value)}
          placeholder="Password (6+ characters)"
          minLength="6"
          required
        />
        <button type="submit" className="btn btn-add" disabled={loading}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
        </button>
      </form>
      {error && <p className="error">Error: {error}</p>}
      <button type="button" className="task-btn" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null) }}>
        {mode === 'login' ? 'Need an account? Register' : 'Already registered? Login'}
      </button>
    </div>
  )
}
