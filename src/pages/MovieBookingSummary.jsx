import { useLocation, useNavigate } from 'react-router-dom'

const bookingFee = 100

function MovieBookingSummary() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const movie = state?.event || state?.movie || state?.concert || {}
  const selectedSeats = state?.selectedSeats || []

  if (!movie || selectedSeats.length === 0) {
    return (
      <div className="booking-summary-state container">
        <p className="section-label">Your booking</p>
        <h1>No booking information found.</h1>
        <button type="button" className="secondary-btn" onClick={() => navigate('/movies')}>Back to Movies</button>
      </div>
    )
  }

  const movieName = movie.eventName || movie.name || movie.title || 'Movie'
  const subtotal = (movie.price || 0) * selectedSeats.length
  const total = subtotal + bookingFee

  return (
    <div className="movie-booking-summary">
      <div className="container movie-booking-summary-wrap">
        <header className="booking-summary-header">
          <p className="section-label">Almost there</p>
          <h1>Booking Summary</h1>
          <p>Review your movie booking before proceeding to payment.</p>
        </header>

        <div className="booking-summary-layout">
          <section className="booking-summary-main">
            <article className="summary-event-card">
              <div className="summary-event-art movie-summary-art" aria-hidden="true">
                <span>{movie.title ? movie.title.slice(0, 2).toUpperCase() : 'MOV'}</span>
                <small>MOVIE</small>
              </div>
              <div className="summary-event-details">
                <p className="section-label">{movie.category || movie.genre || 'Movie'}</p>
                <h2>{movieName}</h2>
                <p className="summary-artist">{movie.theatre || 'Cinema'}</p>
                <div className="summary-event-meta">
                  <span>{movie.releaseDate || movie.date}</span>
                  <span>{movie.duration || '2h 05m'}</span>
                  <span>{movie.city}</span>
                  <span>{movie.language}</span>
                </div>
              </div>
            </article>

            <article className="selected-seats-card">
              <div className="summary-card-heading">
                <div><p className="section-label">Your selection</p><h2>Selected Seats</h2></div>
                <span>{selectedSeats.length} {selectedSeats.length === 1 ? 'ticket' : 'tickets'}</span>
              </div>
              <div className="selected-seat-list">{selectedSeats.map((seat) => <span key={seat}>{seat}</span>)}</div>
              <div className="selected-seat-count"><span>Number of Tickets</span><strong>{selectedSeats.length}</strong></div>
            </article>
          </section>

          <aside className="price-summary-card">
            <p className="section-label">Price details</p>
            <h2>Complete your booking</h2>
            <div className="price-summary-list">
              <div><span>Ticket Price</span><strong>₹{movie.price} × {selectedSeats.length}</strong></div>
              <div><span>Subtotal</span><strong>₹{subtotal}</strong></div>
              <div><span>Booking Fee</span><strong>₹{bookingFee}</strong></div>
              <div className="price-summary-total"><span>Total Amount</span><strong>₹{total}</strong></div>
            </div>
            <button type="button" className="primary-btn payment-continue-button" onClick={() => navigate('/payment', { state: { event: movie, concert: movie, selectedSeats, subtotal, bookingFee, total, type: 'movie' } })}>Proceed to Payment <span aria-hidden="true">→</span></button>
            <button type="button" className="summary-back-button" onClick={() => navigate(`/movie-seats/${movie.id}`, { state: { movie, event: movie, selectedSeats } })}>← Back to Seat Selection</button>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default MovieBookingSummary
