import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Seat from '../components/Seat'

const seatRows = ['A', 'B', 'C', 'D', 'E']
const seatsPerRow = 6
const bookedSeats = ['A2', 'B5', 'C3', 'D1', 'E6']
const maximumSeats = 6

function ComedySeatSelection() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [comedy, setComedy] = useState(location.state?.comedy || location.state?.event || null)
  const [selectedSeats, setSelectedSeats] = useState(location.state?.selectedSeats || [])
  const [isLoading, setIsLoading] = useState(!comedy)
  const [limitMessage, setLimitMessage] = useState('')

  useEffect(() => {
    const fetchComedy = async () => {
      if (comedy) return

      try {
        const response = await fetch('/comedy.json')
        if (!response.ok) throw new Error('Unable to load comedy seats.')

        const shows = await response.json()
        const found = shows.find((item) => String(item.id) === String(id))
        setComedy(found || null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchComedy()
  }, [id, comedy])

  const allSeats = useMemo(() => (
    seatRows.flatMap((row) => Array.from({ length: seatsPerRow }, (_, index) => `${row}${index + 1}`))
  ), [])

  const handleSeatClick = (seatId) => {
    if (bookedSeats.includes(seatId)) return

    setLimitMessage('')
    setSelectedSeats((currentSeats) => {
      if (currentSeats.includes(seatId)) {
        return currentSeats.filter((seat) => seat !== seatId)
      }

      if (currentSeats.length >= maximumSeats) {
        setLimitMessage(`Maximum ${maximumSeats} seats can be selected.`)
        return currentSeats
      }

      return [...currentSeats, seatId]
    })
  }

  const getSeatStatus = (seatId) => {
    if (bookedSeats.includes(seatId)) return 'booked'
    if (selectedSeats.includes(seatId)) return 'selected'
    return 'available'
  }

  if (isLoading) {
    return <div className="movie-seat-page-state container"><p className="section-label">Please wait</p><h1>Loading seat information...</h1></div>
  }

  if (!comedy) {
    return (
      <div className="movie-seat-page-state container">
        <p className="section-label">404 / Comedy</p>
        <h1>Comedy show not found.</h1>
        <button type="button" className="secondary-btn" onClick={() => navigate('/comedy')}>Back to Comedy</button>
      </div>
    )
  }

  const subtotal = comedy.price * selectedSeats.length
  const bookingFee = 100
  const total = subtotal + bookingFee

  return (
    <div className="movie-seat-page">
      <div className="container movie-seat-wrap">
        <button type="button" className="movie-seat-back-button" onClick={() => navigate(`/comedy/${comedy.id}`)}>
          <span aria-hidden="true">←</span> Back to Comedy
        </button>

        <header className="movie-seat-header">
          <p className="section-label">Comedy Booking</p>
          <h1>Select Your Seats</h1>
          <span className="movie-seat-screen-title">{comedy.name} · {comedy.venue}, {comedy.city}</span>
        </header>

        <div className="movie-seat-layout">
          <section className="movie-seat-map-panel">
            <div className="movie-seat-panel-heading">
              <div>
                <p className="section-label">Choose your view</p>
                <h2>Pick your seats</h2>
              </div>
              <span>{selectedSeats.length} / {maximumSeats} selected</span>
            </div>
            <div className="movie-screen"><span>SCREEN</span></div>
            <div className="movie-seat-map" aria-label="Comedy seat map">
              {allSeats.map((seatId) => (
                <Seat key={seatId} seatId={seatId} status={getSeatStatus(seatId)} onClick={handleSeatClick} />
              ))}
            </div>
            <div className="movie-seat-legend">
              <span><i className="legend-seat available" />Available</span>
              <span><i className="legend-seat selected" />Selected</span>
              <span><i className="legend-seat booked" />Booked</span>
            </div>
          </section>

          <aside className="movie-seat-summary-panel">
            <p className="section-label">Your booking</p>
            <h2>Booking Summary</h2>
            <div className="movie-seat-summary-event">
              <strong>{comedy.name}</strong>
              <span>{comedy.performer}</span>
            </div>
            <div className="movie-seat-summary-list">
              <div><span>Selected Seats</span><strong>{selectedSeats.length ? selectedSeats.join(', ') : 'No seats selected'}</strong></div>
              <div><span>Ticket Price</span><strong>₹{comedy.price}</strong></div>
              <div><span>Number of Tickets</span><strong>{selectedSeats.length}</strong></div>
              <div><span>Subtotal</span><strong>₹{subtotal}</strong></div>
              <div><span>Booking Fee</span><strong>₹{bookingFee}</strong></div>
              <div className="movie-seat-total-row"><span>Total</span><strong>₹{total}</strong></div>
            </div>
            {limitMessage && <p className="movie-seat-limit-message" role="status">{limitMessage}</p>}
            <button type="button" className="primary-btn movie-seat-continue-button" disabled={selectedSeats.length === 0} onClick={() => navigate('/comedy-booking-summary', { state: { event: comedy, comedy, selectedSeats, subtotal, bookingFee, total, type: 'comedy' } })}>Continue to Booking Summary <span aria-hidden="true">→</span></button>
            <div className="movie-seat-summary-note">You can select up to {maximumSeats} seats per booking.</div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default ComedySeatSelection
