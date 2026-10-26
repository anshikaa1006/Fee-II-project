import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import FormInput from '../components/FormInput'
import { validateDemoCode, validateUpiId } from '../utils/formValidation'

const paymentOptions = [
  { value: 'UPI', label: 'UPI', description: 'Pay using your UPI ID' },
  { value: 'Card', label: 'Credit / Debit Card', description: 'Use a fictional demo approval code' },
  { value: 'Cash', label: 'Cash / Pay at Venue', description: 'Pay according to venue policy' },
]

function Payment() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState('UPI')
  const [values, setValues] = useState({ upiId: '', demoCode: '' })
  const [errors, setErrors] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)

  const event = state?.event || state?.concert
  const selectedSeats = state?.selectedSeats || []
  const subtotal = state?.subtotal ?? 0
  const bookingFee = state?.bookingFee ?? 100
  const total = state?.total ?? 0
  const bookingState = { event, concert: event, selectedSeats, subtotal, bookingFee, total, type: event?.type || state?.type || 'concert' }
  const eventType = String(state?.type || event?.type || 'concert').toLowerCase()
  const categoryLabel = eventType === 'movie' ? 'Movies' : eventType === 'comedy' ? 'Comedy' : 'Concerts'
  const categoryPath = eventType === 'movie' ? '/movies' : eventType === 'comedy' ? '/comedy' : '/concerts'
  const eventName = event?.title || event?.eventName || event?.name || 'Event'
  const eventPath = eventType === 'movie'
    ? `/movie/${event?.id}`
    : eventType === 'comedy'
      ? `/comedy/${event?.id}`
      : `/concerts/${event?.id}`

  const summaryPath = eventType === 'movie'
    ? '/movie-booking-summary'
    : eventType === 'comedy'
      ? '/comedy-booking-summary'
      : '/booking-summary'

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((currentValues) => ({ ...currentValues, [name]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }))
  }

  const validatePayment = () => {
    if (paymentMethod === 'UPI') return { upiId: validateUpiId(values.upiId) }
    if (paymentMethod === 'Card') return { demoCode: validateDemoCode(values.demoCode) }
    return {}
  }

  const handlePayment = (event) => {
    event.preventDefault()
    const validationErrors = validatePayment()

    if (Object.values(validationErrors).some(Boolean)) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setIsProcessing(true)

    setTimeout(() => {
      navigate('/confirmation', {
        state: {
          ...bookingState,
          paymentMethod,
        },
      })
    }, 1400)
  }

  if (!event || selectedSeats.length === 0) {
    return (
      <div className="payment-state container">
        <p className="section-label">Your payment</p>
        <h1>No booking information found.</h1>
        <button type="button" className="secondary-btn" onClick={() => navigate('/concerts')}>Back to Concerts</button>
      </div>
    )
  }

  return (
    <div className="payment-page">
      <div className="container payment-page-wrap">
        <Breadcrumbs items={[
          { label: 'Home', to: '/' },
          { label: categoryLabel, to: categoryPath },
          { label: eventName, to: eventPath },
          { label: 'Payment' },
        ]} />
        <header className="payment-header">
          <p className="section-label">Secure checkout</p>
          <h1>Payment</h1>
          <p>Complete your booking securely.</p>
        </header>

        <div className="payment-layout">
          <form className="payment-method-panel" onSubmit={handlePayment} noValidate>
            <div className="payment-panel-heading"><div><p className="section-label">Choose a method</p><h2>Payment Method</h2></div><span>DEMO PAYMENT</span></div>
            <div className="payment-options">
              {paymentOptions.map((option) => (
                <label className={`payment-option ${paymentMethod === option.value ? 'active' : ''}`} key={option.value}>
                  <input type="radio" name="paymentMethod" value={option.value} checked={paymentMethod === option.value} onChange={(event) => { setPaymentMethod(event.target.value); setErrors({}) }} />
                  <span className="payment-radio" />
                  <span><strong>{option.label}</strong><small>{option.description}</small></span>
                </label>
              ))}
            </div>

            <div className="payment-form-area">
              {paymentMethod === 'UPI' && (
                <FormInput
                  className="payment-field"
                  label="Demo UPI ID"
                  name="upiId"
                  value={values.upiId}
                  onChange={handleChange}
                  placeholder="demo@upi"
                  error={errors.upiId}
                  required
                  autoComplete="off"
                />
              )}

              {paymentMethod === 'Card' && (
                <FormInput
                  className="payment-field"
                  label="Demo approval code"
                  name="demoCode"
                  value={values.demoCode}
                  onChange={handleChange}
                  placeholder="VIBE-DEMO"
                  error={errors.demoCode}
                  required
                  autoComplete="off"
                />
              )}

              {paymentMethod === 'Cash' && <div className="cash-payment-note"><span aria-hidden="true">◌</span><p>You can pay at the venue according to the event's payment policy.</p></div>}
            </div>

            {Object.values(errors).some(Boolean) && (
              <p className="form-error-summary" role="alert">Please correct the highlighted field before continuing.</p>
            )}
            <button type="submit" className="primary-btn pay-now-button" disabled={isProcessing}>{isProcessing ? <><span className="payment-spinner" /> Processing Payment...</> : <>Pay ₹{total} <span aria-hidden="true">→</span></>}</button>
            <button type="button" className="payment-back-button" disabled={isProcessing} onClick={() => navigate(summaryPath, { state: bookingState })}>← Back to Booking Summary</button>
          </form>

          <aside className="payment-order-summary">
            <p className="section-label">Your order</p>
            <h2>Order Summary</h2>
            <div className="payment-event-summary"><strong>{event.title || event.eventName || event.name || 'Event'}</strong>{(event.performer || event.artist) && <span>{event.performer || event.artist}</span>}<small>{event.date} · {event.time}</small><small>{event.venue}, {event.city}</small></div>
            <div className="payment-summary-list">
              <div><span>Selected Seats</span><strong>{selectedSeats.join(', ')}</strong></div>
              <div><span>Ticket Price</span><strong>₹{event.price} × {selectedSeats.length}</strong></div>
              <div><span>Booking Fee</span><strong>₹{bookingFee}</strong></div>
              <div className="payment-total"><span>Total</span><strong>₹{total}</strong></div>
            </div>
            <p className="demo-payment-note">This is a simulated frontend payment. Use only fictional demo values; no real payment details are needed, sent, or stored.</p>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Payment
