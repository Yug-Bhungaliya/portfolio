import React from 'react'

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="api-status error">
      <p>{message}</p>
      {onRetry && (
        <button className="retry-btn" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  )
}
