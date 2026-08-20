import React from 'react'
import { Link } from 'react-router-dom'
import profilePic from './assets/pic.jpeg'

export default function Home() {

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

      {/* Task manager moved to its own route/page. See /tasks */}
    </>
  )
}
