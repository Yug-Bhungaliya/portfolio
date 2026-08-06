import React from 'react'

const skillGroups = [
  {
    title: 'Frontend',
    items: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Vite']
  },
  {
    title: 'Backend',
    items: ['Node.js', 'Express', 'REST APIs']
  },
  {
    title: 'Design & Workflow',
    items: ['Figma', 'Git', 'GitHub', 'VS Code']
  }
]

export default function Skills() {
  return (
    <>
      <div className="card skills-page-hero">
        <p className="eyebrow">Skills & Expertise</p>
        <h2>I build with modern tools and a thoughtful workflow.</h2>
        <p>
          My experience is focused on creating polished user interfaces while keeping the development process organized and efficient.
        </p>
      </div>

      <div className="skills-page-grid">
        {skillGroups.map((group, index) => (
          <div key={index} className="card skill-page-card">
            <h3>{group.title}</h3>
            <div className="skill-page-tags">
              {group.items.map((item, itemIndex) => (
                <span key={itemIndex} className="skill-page-tag">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="card skill-page-card highlight-card">
        <h3>Current Focus</h3>
        <p>
          I’m especially interested in building responsive React applications, improving user experience, and learning new ways to solve modern web challenges.
        </p>
      </div>
    </>
  )
}