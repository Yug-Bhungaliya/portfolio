import React from 'react'

export default function RepoList({ repos }) {
  return (
    <div className="repo-list project-repo-list">
      {repos.map((repo) => (
        <div key={repo.id} className="repo-card project-repo-card">
          <div className="repo-info">
            <div>
              <h4>{repo.name}</h4>
              <p>{repo.description || 'No description provided.'}</p>
            </div>
            <div className="repo-meta">
              <span className="repo-stars">★ {repo.stargazers_count ?? 0}</span>
            </div>
          </div>
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="repo-link">
            View Repo
          </a>
        </div>
      ))}
    </div>
  )
}
