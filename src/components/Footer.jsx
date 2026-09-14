import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-intro">
          <Link to="/" className="brand footer-brand">
            <span className="brand-mark">V</span>
            <span className="brand-name">VIBE</span>
          </Link>
          <p>Your destination for unforgettable entertainment experiences.</p>
        </div>

        <div className="footer-column">
          <h2>Explore</h2>
          <Link to="/movies">Movies</Link>
          <Link to="/concerts">Concerts</Link>
          <Link to="/sports">Sports</Link>
          <Link to="/comedy">Comedy & Theatre</Link>
        </div>

        <div className="footer-column">
          <h2>Company</h2>
          <Link to="/">About</Link>
          <a href="mailto:hello@vibe.example">Contact</a>
          <a href="mailto:support@vibe.example">Help</a>
        </div>

        <div className="footer-column">
          <h2>Account</h2>
          <Link to="/login">Login</Link>
          <Link to="/my-tickets">My Tickets</Link>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>&copy; 2026 VIBE. All rights reserved.</p>
        <span>Made for moments worth remembering.</span>
      </div>
    </footer>
  )
}

export default Footer
