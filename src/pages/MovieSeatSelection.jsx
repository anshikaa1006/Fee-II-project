import { useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import useJsonArray from '../hooks/useJsonArray'

const seatRows = ['A', 'B', 'C', 'D', 'E']
const seatsPerRow = 8
const bookedSeats = ['A3', 'B5', 'C2', 'D7', 'E4']
const maximumSeats = 6

function MovieSeatSelection() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedSeats, setSelectedSeats] = useState(location.state?.selectedSeats || [])
  const [limitMessage, setLimitMessage] = useState('')
  const { data: movies, error, loading, retry } = useJsonArray('/movies.json', 'movie seat information')
  const movie = movies?.find((item) => String(item.id) === String(id))

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

  if (loading) {
    return <div className="movie-seat-page-state container"><p className="section-label">Please wait</p><h1>Loading seat information...</h1></div>
  }

  if (error) {
    return (
      <div className="movie-seat-page-state container">
        <p className="section-label">Something went wrong</p>
        <h1>Unable to load movie seat information.</h1>
        <p role="alert">{error}</p>
        <button type="button" className="primary-btn" onClick={retry}>Try Again</button>
        <button type="button" className="secondary-btn" onClick={() => navigate('/movies')}>Back to Movies</button>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="movie-seat-page-state container">
        <p className="section-label">404 / Movie</p>
        <h1>Movie not found.</h1>
        <button type="button" className="secondary-btn" onClick={() => navigate('/movies')}>Back to Movies</button>
      </div>
    )
  }

  const subtotal = movie.price * selectedSeats.length
  const bookingFee = 100
  const total = subtotal + bookingFee

  return (
    <div className="movie-seat-page">
      <div className="container movie-seat-wrap">
        <Breadcrumbs items={[
          { label: 'Home', to: '/' },
          { label: 'Movies', to: '/movies' },
          { label: movie.title || movie.name, to: `/movie/${movie.id}` },
          { label: 'Select Seats' },
        ]} />
        <button type="button" className="movie-seat-back-button" onClick={() => navigate(`/movie/${movie.id}`)}>
          <span aria-hidden="true">←</span> Back to Movie
        </button>

        <header className="movie-seat-header">
          <p className="section-label">Cinema Booking</p>
          <h1>Select Your Seats</h1>
          <span className="movie-seat-screen-title">{movie.title || movie.eventName || movie.name} · {movie.theatre}, {movie.city}</span>
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
            <div className="movie-seat-map" aria-label="Movie seat map">
              {allSeats.map((seatId) => (
                <button key={seatId} type="button" className={`movie-seat movie-seat-${getSeatStatus(seatId)}`} onClick={() => handleSeatClick(seatId)} disabled={getSeatStatus(seatId) === 'booked'} aria-label={`${seatId}, ${getSeatStatus(seatId)} seat`} aria-pressed={getSeatStatus(seatId) === 'selected'}>{seatId}</button>
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
              <strong>{movie.title}</strong>
              <span>{movie.theatre}</span>
            </div>
            <div className="movie-seat-summary-list">
              <div><span>Selected Seats</span><strong>{selectedSeats.length ? selectedSeats.join(', ') : 'No seats selected'}</strong></div>
              <div><span>Ticket Price</span><strong>₹{movie.price}</strong></div>
              <div><span>Number of Tickets</span><strong>{selectedSeats.length}</strong></div>
              <div><span>Subtotal</span><strong>₹{subtotal}</strong></div>
              <div><span>Booking Fee</span><strong>₹{bookingFee}</strong></div>
              <div className="movie-seat-total-row"><span>Total</span><strong>₹{total}</strong></div>
            </div>
            {limitMessage && <p className="movie-seat-limit-message" role="status">{limitMessage}</p>}
            <button type="button" className="primary-btn movie-seat-continue-button" disabled={selectedSeats.length === 0} onClick={() => navigate('/movie-booking-summary', { state: { event: movie, concert: movie, selectedSeats, subtotal, bookingFee, total, type: 'movie' } })}>Continue to Booking Summary <span aria-hidden="true">→</span></button>
            <div className="movie-seat-summary-note">You can select up to {maximumSeats} seats per booking.</div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default MovieSeatSelection
