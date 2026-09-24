export default function AuthCodeError() {
  return (
    <div className="error-container">
      <div className="error-card">
        <div className="error-icon">⚠️</div>
        <h1>Authentication Error</h1>
        <p>
          There was a problem signing you in. This could happen if:
        </p>
        <ul>
          <li>The authentication link expired</li>
          <li>The link was already used</li>
          <li>There was a network issue</li>
        </ul>
        <a href="/login" className="error-btn">
          Try Again
        </a>
      </div>
    </div>
  )
}
