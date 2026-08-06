import React, { useState } from 'react'

const topics = [
  { title: 'Web Development', description: 'Modern, responsive websites and interfaces' },
  { title: 'Collaboration', description: 'Working together on exciting ideas and projects' },
  { title: 'Internship Opportunities', description: 'Open to learning and contributing with a team' },
  { title: 'Friendly Chat', description: 'Always happy to connect and say hello' }
]

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [showHelpTip, setShowHelpTip] = useState(false)
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const allFieldsFilled = Object.values(formData).every((value) => value.trim() !== '')

    if (!allFieldsFilled) {
      setStatusMessage({ type: 'error', text: 'Please fill in all fields before sending your message.' })
      return
    }

    setStatusMessage({ type: 'success', text: 'Thanks! Your message has been sent successfully. I will get back to you soon.' })
    setFormData({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000)
  }

  const characterCount = formData.message.length

  return (
    <>
      <div className="card professional-contact-header">
        <p className="eyebrow">Let's Connect</p>
        <h2>I’d love to hear from you!</h2>
        <p>Whether it’s a project idea, a collaboration request, or a simple hello, I’m always happy to connect.</p>
      </div>

      <div className="contact-grid">
        <div className="card contact-form-section">
          <div className="contact-form-header">
            <h3>Get In Touch</h3>
            <button
              className="help-btn"
              onClick={() => setShowHelpTip(!showHelpTip)}
              title="Toggle help"
            >
              ?
            </button>
          </div>

          {showHelpTip && (
            <div className="help-tip">
              <p>✉️ Fill out the form and I’ll respond within 24–48 hours.</p>
            </div>
          )}

          <div className="contact-topic-grid">
            {topics.map((topic) => (
              <div key={topic.title} className="contact-topic-card">
                <h4>{topic.title}</h4>
                <p>{topic.description}</p>
              </div>
            ))}
          </div>

          {statusMessage.text && (
            <div className={`form-status ${statusMessage.type === 'success' ? 'success-message' : 'error-message'}`}>
              {statusMessage.type === 'success' ? '✅' : '⚠️'} {statusMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g., Job Opportunity, Collaboration"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about your inquiry..."
                rows="5"
                required
              />
              <div className="char-count">{characterCount} / 1000 characters</div>
            </div>

            <div className="message-preview-container">
              <div className="preview-heading">Live Message Preview</div>
              <div className={`message-preview ${formData.message.trim() ? '' : 'preview-empty'}`}>
                {formData.message.trim()
                  ? formData.message
                  : 'Your message will appear here...'}
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </form>
        </div>

        <div className="card contact-info-section">
          <h3>GitHub</h3>
          <p>Check out my repositories and connect on GitHub.</p>

          <div className="contact-item">
            <h4>💼 GitHub</h4>
            <div className="social-links">
              <a href="https://github.com/Yug-Bhungaliya" target="_blank" rel="noopener noreferrer">
                Yug-Bhungaliya
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
