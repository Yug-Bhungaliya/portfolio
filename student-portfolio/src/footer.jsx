import { Link } from 'react-router-dom'

export default function Footer({ name }) {
  return (
    <footer className="portfolio-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <h3>{name}</h3>
          <p>React Developer • Data Science Enthusiast • AI Learner</p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-connect">
          <h4>Connect</h4>
          <a href="https://github.com/Yug-Bhungaliya" target="_blank" rel="noopener noreferrer" className="footer-btn footer-btn-primary">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/yug-bhungaliya-771a0b317/" target="_blank" rel="noopener noreferrer" className="footer-btn footer-btn-secondary">
            LinkedIn
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 {name}. All Rights Reserved.</p>
        <p>Designed & Developed using React</p>
      </div>
    </footer>
  )
}
