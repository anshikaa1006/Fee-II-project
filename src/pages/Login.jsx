import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import FormInput from '../components/FormInput'
import { validateEmail, validateRequired } from '../utils/formValidation'

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
    const nextErrors = {
      name: validateRequired(form.name, 'your name'),
      email: validateEmail(form.email),
    }

    if (Object.values(nextErrors).some(Boolean)) {
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
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Login' }]} />
        <p className="section-label">Welcome to VIBE</p>
        <h1>Welcome Back</h1>
        <p className="login-subtitle">Sign in to continue booking your favourite events.</p>

        <form className="login-form" onSubmit={handleLogin} noValidate>
          {Object.values(errors).some(Boolean) && (
            <p className="form-error-summary" role="alert">Please correct the highlighted fields.</p>
          )}
          <FormInput
            className="login-field"
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
            autoComplete="name"
            error={errors.name}
            required
          />
          <FormInput
            className="login-field"
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email}
            required
          />
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
