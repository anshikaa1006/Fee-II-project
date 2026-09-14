import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'

const navigationLinks = [
  { label: 'Home', to: '/' },
  { label: 'Movies', to: '/movies' },
  { label: 'Concerts', to: '/concerts' },
  { label: 'Comedy', to: '/comedy' },
  { label: 'My Tickets', to: '/my-tickets' },
  { label: 'Login', to: '/login' },
]

const readUser = () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem('vibeUser'))
    return storedUser?.isLoggedIn ? storedUser : null
  } catch {
    return null
  }
}

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState(readUser)

  useEffect(() => {
    const syncUser = () => setUser(readUser())
    window.addEventListener('vibe-auth-change', syncUser)
    window.addEventListener('storage', syncUser)

    return () => {
      window.removeEventListener('vibe-auth-change', syncUser)
      window.removeEventListener('storage', syncUser)
    }
  }, [])

  const closeMenu = () => setIsMenuOpen(false)

  const handleLogout = () => {
    localStorage.removeItem('vibeUser')
    setUser(null)
    window.dispatchEvent(new Event('vibe-auth-change'))
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
          {navigationLinks.filter((link) => !(user && link.to === '/login')).map((link) => (
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
          {user && <button type="button" className="nav-logout" onClick={handleLogout}>Logout</button>}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
