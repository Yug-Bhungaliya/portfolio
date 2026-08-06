import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="card">
      <div className="not-found-container">
        <h1 className="not-found-title">404</h1>
        <h2>Page Not Found</h2>
        <p>Sorry, the page you're looking for doesn't exist.</p>
        <p>It might have been moved or deleted.</p>
        
        <div className="not-found-animation">
          <p>🔍</p>
        </div>
        
        <Link to="/" className="btn">
          Go Back to Home
        </Link>
      </div>
    </div>
  )
}
