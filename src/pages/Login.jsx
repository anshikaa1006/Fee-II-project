
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import FormField from '../components/FormField'
import { useAuth } from '../context/AuthContext'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [form, setForm] = useState({
    name: '',
    email: '',
  })

  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }))
  }

  const handleLogin = (event) => {
    event.preventDefault()

    const nextErrors = {}

    if (!form.name.trim()) {
      nextErrors.name = 'Please enter your name.'
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Please enter your email.'
    } else if (!emailPattern.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors)
      return
    }

    login({
      name: form.name.trim(),
      email: form.email.trim(),
    })

    navigate(location.state?.from || '/')
  }

  const handleGuest = () => {
    localStorage.removeItem('vibeUser')
    window.dispatchEvent(new Event('vibe-auth-change'))
    navigate('/')
  }

  return (
    <div className="login-page">
      <div className="login-visual" aria-hidden="true">
        <span>VIBE</span>
        <strong>
          Your next
          <br />
          moment starts
          <br />
          <em>here.</em>
        </strong>
      </div>

      <section className="login-card">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Login' },
          ]}
        />

        <p className="section-label">Welcome to VIBE</p>
        <h1>Welcome Back</h1>
        <p className="login-subtitle">
          Sign in to continue booking your favourite events.
        </p>

        <form
          className="login-form"
          onSubmit={handleLogin}
          noValidate
        >
          {Object.values(errors).some(Boolean) && (
            <p className="form-error-summary" role="alert">
              Please correct the highlighted fields.
            </p>
          )}

          <FormField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
            autoComplete="name"
            error={errors.name}
            required
          />

          <FormField
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email}
            required
          />

          <button
            type="submit"
            className="primary-btn login-button"
          >
            Login <span aria-hidden="true">→</span>
          </button>
        </form>

        <div className="login-divider">
          <span>or</span>
        </div>

        <button
          type="button"
          className="secondary-btn guest-button"
          onClick={handleGuest}
        >
          Continue as Guest
        </button>

        <p className="login-note">
          Demo login for the VIBE frontend project. No credentials
          are sent anywhere.
        </p>
      </section>
    </div>
  )
}

export default Login
