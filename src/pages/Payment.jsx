import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const paymentOptions = [
  { value: 'UPI', label: 'UPI', description: 'Pay using your UPI ID' },
  { value: 'Card', label: 'Credit / Debit Card', description: 'Use a demo card form' },
  { value: 'Cash', label: 'Cash / Pay at Venue', description: 'Pay according to venue policy' },
]

function Payment() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState('UPI')
  const [upiId, setUpiId] = useState('')
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
  })
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const event = state?.event || state?.concert
  const selectedSeats = state?.selectedSeats || []
  const subtotal = state?.subtotal ?? 0
  const bookingFee = state?.bookingFee ?? 100
  const total = state?.total ?? 0
  const bookingState = { event, concert: event, selectedSeats, subtotal, bookingFee, total, type: event?.type || state?.type || 'concert' }

  const handleCardChange = (event) => {
    setCardDetails((currentDetails) => ({
      ...currentDetails,
      [event.target.name]: event.target.value,
    }))
  }

  const validatePayment = () => {
    if (paymentMethod === 'UPI' && !upiId.trim()) return 'Please enter your UPI ID.'

    if (paymentMethod === 'Card') {
      if (!cardDetails.cardNumber.trim()) return 'Please enter your card number.'
      if (!cardDetails.cardHolder.trim()) return 'Please enter the card holder name.'
      if (!cardDetails.expiry.trim()) return 'Please enter the expiry date.'
      if (!cardDetails.cvv.trim()) return 'Please enter the CVV.'
    }

    return ''
  }

  const handlePayment = (event) => {
    event.preventDefault()
    const validationMessage = validatePayment()

    if (validationMessage) {
      setError(validationMessage)
      return
    }

    setError('')
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
        <header className="payment-header">
          <p className="section-label">Secure checkout</p>
          <h1>Payment</h1>
          <p>Complete your booking securely.</p>
        </header>

        <div className="payment-layout">
          <form className="payment-method-panel" onSubmit={handlePayment}>
            <div className="payment-panel-heading"><div><p className="section-label">Choose a method</p><h2>Payment Method</h2></div><span>DEMO PAYMENT</span></div>
            <div className="payment-options">
              {paymentOptions.map((option) => (
                <label className={`payment-option ${paymentMethod === option.value ? 'active' : ''}`} key={option.value}>
                  <input type="radio" name="paymentMethod" value={option.value} checked={paymentMethod === option.value} onChange={(event) => { setPaymentMethod(event.target.value); setError('') }} />
                  <span className="payment-radio" />
                  <span><strong>{option.label}</strong><small>{option.description}</small></span>
                </label>
              ))}
            </div>

            <div className="payment-form-area">
              {paymentMethod === 'UPI' && (
                <label className="payment-field"><span>UPI ID</span><input type="text" value={upiId} onChange={(event) => setUpiId(event.target.value)} placeholder="yourname@upi" autoComplete="off" /></label>
              )}

              {paymentMethod === 'Card' && (
                <div className="card-fields">
                  <label className="payment-field card-number-field"><span>Card Number</span><input type="text" name="cardNumber" value={cardDetails.cardNumber} onChange={handleCardChange} placeholder="1234 5678 9012 3456" autoComplete="off" /></label>
                  <label className="payment-field card-holder-field"><span>Card Holder Name</span><input type="text" name="cardHolder" value={cardDetails.cardHolder} onChange={handleCardChange} placeholder="Enter card holder name" autoComplete="off" /></label>
                  <label className="payment-field"><span>Expiry Date</span><input type="text" name="expiry" value={cardDetails.expiry} onChange={handleCardChange} placeholder="MM/YY" autoComplete="off" /></label>
                  <label className="payment-field"><span>CVV</span><input type="password" name="cvv" value={cardDetails.cvv} onChange={handleCardChange} placeholder="•••" autoComplete="off" /></label>
                </div>
              )}

              {paymentMethod === 'Cash' && <div className="cash-payment-note"><span aria-hidden="true">◌</span><p>You can pay at the venue according to the event's payment policy.</p></div>}
            </div>

            {error && <p className="payment-error" role="alert">{error}</p>}
            <button type="submit" className="primary-btn pay-now-button" disabled={isProcessing}>{isProcessing ? <><span className="payment-spinner" /> Processing Payment...</> : <>Pay ₹{total} <span aria-hidden="true">→</span></>}</button>
            <button type="button" className="payment-back-button" disabled={isProcessing} onClick={() => navigate('/booking-summary', { state: bookingState })}>← Back to Booking Summary</button>
          </form>

          <aside className="payment-order-summary">
            <p className="section-label">Your order</p>
            <h2>Order Summary</h2>
            <div className="payment-event-summary"><strong>{event.eventName || event.name || 'Event'}</strong>{(event.performer || event.artist) && <span>{event.performer || event.artist}</span>}<small>{event.date} · {event.time}</small><small>{event.venue}, {event.city}</small></div>
            <div className="payment-summary-list">
              <div><span>Selected Seats</span><strong>{selectedSeats.join(', ')}</strong></div>
              <div><span>Ticket Price</span><strong>₹{event.price} × {selectedSeats.length}</strong></div>
              <div><span>Booking Fee</span><strong>₹{bookingFee}</strong></div>
              <div className="payment-total"><span>Total</span><strong>₹{total}</strong></div>
            </div>
            <p className="demo-payment-note">This is a simulated frontend payment for the VIBE college project. No payment details are sent or stored.</p>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Payment
