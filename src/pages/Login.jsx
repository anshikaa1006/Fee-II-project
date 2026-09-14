import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ name: '', email: '' })
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    setForm((currentForm) => ({ ...currentForm, [event.target.name]: event.target.value }))
    setErrors((currentErrors) => ({ ...currentErrors, [event.target.name]: '' }))
  }

  const handleLogin = (event) => {
    event.preventDefault()
    const nextErrors = {}

    if (!form.name.trim()) nextErrors.name = 'Please enter your name.'
    if (!form.email.trim()) {
      nextErrors.email = 'Please enter your email address.'
    } else if (!emailPattern.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    const user = {
      name: form.name.trim(),
      email: form.email.trim(),
      isLoggedIn: true,
    }

    localStorage.setItem('vibeUser', JSON.stringify(user))
    window.dispatchEvent(new Event('vibe-auth-change'))
    navigate(location.state?.from || '/')
  }

  const handleGuest = () => {
    localStorage.removeItem('vibeUser')
    window.dispatchEvent(new Event('vibe-auth-change'))
    navigate('/')
  }

  return (
    <div className="login-page">
      <div className="login-visual" aria-hidden="true"><span>VIBE</span><strong>Your next<br />moment starts<br /><em>here.</em></strong></div>
      <section className="login-card">
        <p className="section-label">Welcome to VIBE</p>
        <h1>Welcome Back</h1>
        <p className="login-subtitle">Sign in to continue booking your favourite events.</p>

        <form className="login-form" onSubmit={handleLogin} noValidate>
          <label className="login-field"><span>Name</span><input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Enter your name" autoComplete="name" aria-invalid={Boolean(errors.name)} />{errors.name && <small>{errors.name}</small>}</label>
          <label className="login-field"><span>Email</span><input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" aria-invalid={Boolean(errors.email)} />{errors.email && <small>{errors.email}</small>}</label>
          <button type="submit" className="primary-btn login-button">Login <span aria-hidden="true">→</span></button>
        </form>

        <div className="login-divider"><span>or</span></div>
        <button type="button" className="secondary-btn guest-button" onClick={handleGuest}>Continue as Guest</button>
        <p className="login-note">Demo login for the VIBE frontend project. No credentials are sent anywhere.</p>
      </section>
    </div>
  )
}

export default Login
