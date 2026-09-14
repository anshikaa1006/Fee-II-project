import { useLocation, useNavigate } from 'react-router-dom'

function BookingSummary() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const event = state?.event || state?.concert
  const selectedSeats = state?.selectedSeats || []
  const eventType = String(state?.type || event?.type || 'concert').toLowerCase()
  const isMovieBooking = eventType === 'movie'
  const isComedyBooking = eventType === 'comedy'
  const bookingFee = isComedyBooking ? 50 : 100

  if (!event || selectedSeats.length === 0) {
    return (
      <div className="booking-summary-state container">
        <p className="section-label">Your booking</p>
        <h1>No booking information found.</h1>
        <button type="button" className="secondary-btn" onClick={() => navigate('/concerts')}>Back to Concerts</button>
      </div>
    )
  }

  const eventName = event.eventName || event.title || event.name || 'Event'
  const performer = event.performer || event.artist || ''
  const subtotal = event.price * selectedSeats.length
  const total = subtotal + bookingFee
  const eventLabel = isComedyBooking ? 'COMEDY' : (event.category || event.type || 'Event')
  const routeBack = isComedyBooking ? `/comedy-seats/${event.id}` : `/seats/${event.id}`

  return (
    <div className={`booking-summary-page ${isMovieBooking ? 'movie-booking-summary' : ''} ${isComedyBooking ? 'comedy-booking-summary' : ''}`}>
      <div className="container booking-summary-wrap">
        <header className="booking-summary-header">
          <p className="section-label">Almost there</p>
          <h1>Booking Summary</h1>
          <p>Review your booking before proceeding to payment.</p>
        </header>

        <div className="booking-summary-layout">
          <section className="booking-summary-main">
            <article className="summary-event-card">
              <div className="summary-event-art" aria-hidden="true"><span>{performer ? performer.split(' ').map((word) => word[0]).join('').slice(0, 3) : 'EVT'}</span><small>{isComedyBooking ? 'LIVE SHOW' : 'LIVE EVENT'}</small></div>
              <div className="summary-event-details">
                <p className="section-label">{eventLabel}</p>
                <h2>{eventName}</h2>
                {performer && <p className="summary-artist">{performer}</p>}
                <div className="summary-event-meta"><span>{event.date}</span><span>{event.time}</span><span>{event.venue}</span><span>{event.city}</span></div>
              </div>
            </article>

            <article className="selected-seats-card">
              <div className="summary-card-heading"><div><p className="section-label">Your selection</p><h2>Selected Seats</h2></div><span>{selectedSeats.length} {selectedSeats.length === 1 ? 'ticket' : 'tickets'}</span></div>
              <div className="selected-seat-list">{selectedSeats.map((seat) => <span key={seat}>{seat}</span>)}</div>
              <div className="selected-seat-count"><span>Number of Tickets</span><strong>{selectedSeats.length}</strong></div>
            </article>
          </section>

          <aside className="price-summary-card">
            <p className="section-label">Price details</p>
            <h2>Complete your booking</h2>
            <div className="price-summary-list">
              <div><span>Ticket Price</span><strong>₹{event.price} × {selectedSeats.length}</strong></div>
              <div><span>Subtotal</span><strong>₹{subtotal}</strong></div>
              <div><span>Booking Fee</span><strong>₹{bookingFee}</strong></div>
              <div className="price-summary-total"><span>Total Amount</span><strong>₹{total}</strong></div>
            </div>
            <button type="button" className="primary-btn payment-continue-button" onClick={() => navigate('/payment', { state: { event, concert: event, selectedSeats, subtotal, bookingFee, total, type: eventType } })}>Proceed to Payment <span aria-hidden="true">→</span></button>
            <button type="button" className="summary-back-button" onClick={() => navigate(routeBack, { state: { selectedSeats } })}>← Back to Seat Selection</button>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default BookingSummary
