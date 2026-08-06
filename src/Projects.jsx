import React, { useEffect, useMemo, useState } from 'react'
import ErrorMessage from './ErrorMessage'
import RepoList from './RepoList'
import Spinner from './Spinner'

export default function Projects() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchRepos = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('https://api.github.com/users/Yug-Bhungaliya/repos')
      if (!response.ok) {
        throw new Error('Unable to load repositories right now.')
      }

      const data = await response.json()
      setRepos(data)
    } catch (err) {
      setError(err.message || 'Something went wrong while fetching repositories.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRepos()
  }, [])

  const filteredRepos = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return repos
    return repos.filter((repo) => repo.name.toLowerCase().includes(query))
  }, [repos, searchTerm])

  return (
    <>
      <div className="card project-header-card">
        <div>
          <p className="eyebrow">Professional Projects</p>
          <h2>Showcasing my most impactful work</h2>
        </div>
        <div className="project-summary-card">
          <p>Explore live GitHub repositories with quick search, star counts, and a refreshed responsive layout.</p>
        </div>
      </div>

      <div className="card api-section project-content-card">
        <div className="api-header project-api-header">
          <div>
            <h3>GitHub Repositories</h3>
            <p>Live data from the GitHub API. Search repos by name and view star counts instantly.</p>
          </div>
          <div className="project-actions">
            {!loading && !error && (
              <button className="retry-btn" onClick={fetchRepos}>
                Refresh
              </button>
            )}
          </div>
        </div>

        <div className="repo-controls">
          <input
            type="search"
            placeholder="Search repositories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="repo-search"
          />
        </div>

        {loading && <Spinner message="Loading repositories..." />}

        {error && <ErrorMessage message={error} onRetry={fetchRepos} />}

        {!loading && !error && (
          <>
            {filteredRepos.length === 0 ? (
              <div className="api-status empty">No repositories match your search.</div>
            ) : (
              <RepoList repos={filteredRepos} />
            )}
          </>
        )}
      </div>
    </>
  )
}
