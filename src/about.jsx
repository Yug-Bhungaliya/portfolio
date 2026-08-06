import React from 'react'

const highlights = [
  'Frontend-focused developer with a strong eye for UI polish',
  'Builds responsive, modern interfaces with React and Vite',
  'Enjoys turning ideas into clean, practical web experiences'
]

const strengths = [
  'Responsive design and accessibility-minded layouts',
  'Clean component structure and reusable UI patterns',
  'Strong problem-solving approach for real-world projects'
]

const facts = [
  { label: 'Focus', value: 'Frontend Development' },
  { label: 'Specialty', value: 'React & Web Apps' },
  { label: 'Approach', value: 'Modern, User-Friendly' }
]

export default function About() {
  return (
    <>
      <div className="card about-hero">
        <p className="eyebrow">About Me</p>
        <h2>I create polished web experiences with purpose.</h2>
        <p>
          I’m a student developer passionate about building sleek, responsive interfaces that feel effortless to use.
          My work blends creativity, attention to detail, and a solid foundation in modern web technologies.
        </p>

        <div className="about-highlights">
          {highlights.map((item, index) => (
            <span key={index} className="about-pill">
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="about-grid">
        <div className="card about-card">
          <h3>Who I Am</h3>
          <p>
            I enjoy turning ideas into practical digital products and focusing on the details that make a website memorable.
            Whether it’s a portfolio, project showcase, or interactive experience, I aim for a clean and thoughtful result.
          </p>
        </div>

        <div className="card about-card">
          <h3>What I Bring</h3>
          <ul className="about-list">
            {strengths.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card about-card">
        <h3>Quick Snapshot</h3>
        <div className="stats-grid">
          {facts.map((fact, index) => (
            <div key={index} className="stat-box">
              <strong>{fact.value}</strong>
              <span>{fact.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}