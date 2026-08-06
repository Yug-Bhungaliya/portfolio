import React from 'react'

export default function Spinner({ message }) {
  return (
    <div className="api-status loading">
      <span className="spinner" aria-hidden="true"></span>
      {message}
    </div>
  )
}
