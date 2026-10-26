import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navigationLinks = [
  { label: 'Home', to: '/' },
  { label: 'Movies', to: '/movies' },
  { label: 'Concerts', to: '/concerts' },
  { label: 'Comedy', to: '/comedy' },
  { label: 'My Tickets', to: '/my-tickets' },
  { label: 'Login', to: '/login' },
]

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()

  const closeMenu = () => setIsMenuOpen(false)

  const handleLogout = () => {
    logout()
    closeMenu()
  }

  return (
    <header className="site-header">
      <div className="container navbar-inner">
        <Link to="/" className="brand" onClick={closeMenu}>
          <span className="brand-mark">V</span>
          <span className="brand-name">VIBE</span>
        </Link>

        <button
          type="button"
          className={`menu-toggle ${isMenuOpen ? 'is-open' : ''}`}
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
        >
          <span />
          <span />
          <span />
        </button>

        <nav id="primary-navigation" className={`primary-navigation ${isMenuOpen ? 'is-open' : ''}`}>
          {navigationLinks.filter((link) => !(isAuthenticated && link.to === '/login')).map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              {link.label}
            </NavLink>
          ))}
          {user && <span className="nav-greeting">Hi, {user.name}</span>}
          {isAuthenticated && <button type="button" className="nav-logout" onClick={handleLogout}>Logout</button>}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
