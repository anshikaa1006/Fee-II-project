import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="not-found-page container">
      <p className="section-label">404 / Page not found</p>
      <h1>Looks like this event went off the map.</h1>
      <p>The page may have moved, or the address may be incorrect.</p>
      <div className="not-found-actions">
        <Link to="/" className="primary-btn">Back to Home</Link>
        <Link to="/movies" className="secondary-btn">Explore Events</Link>
      </div>
    </section>
  )
}

export default NotFound
