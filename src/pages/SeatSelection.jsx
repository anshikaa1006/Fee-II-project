import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Seat from '../components/Seat'

const seatRows = ['A', 'B', 'C', 'D', 'E']
const seatsPerRow = 8
const bookedSeats = ['A3', 'B5', 'C2', 'D7', 'E4']
const maximumSeats = 6

function SeatSelection() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [concert, setConcert] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [limitMessage, setLimitMessage] = useState('')

  useEffect(() => {
    const loadConcert = async () => {
      setIsLoading(true)
      setError('')
      setConcert(null)
      setSelectedSeats(location.state?.selectedSeats || [])
      setLimitMessage('')

      try {
        const response = await fetch('/concerts.json')
        if (!response.ok) throw new Error('Unable to load seat information.')

        const concerts = await response.json()
        const selectedConcert = concerts.find((item) => String(item.id) === String(id))

        if (!selectedConcert) {
          setError('not-found')
        } else {
          setConcert(selectedConcert)
        }
      } catch {
        setError('load-error')
      } finally {
        setIsLoading(false)
      }
    }

    loadConcert()
  }, [id, location.state])

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
    return <div className="seat-page-state container"><p className="section-label">Please wait</p><h1>Loading seat information...</h1></div>
  }

  if (error === 'load-error') {
    return (
      <div className="seat-page-state container">
        <p className="section-label">Something went wrong</p>
        <h1>Unable to load seat information.</h1>
        <button type="button" className="secondary-btn" onClick={() => navigate('/concerts')}>Back to Concerts</button>
      </div>
    )
  }

  if (error === 'not-found' || !concert) {
    return (
      <div className="seat-page-state container">
        <p className="section-label">404 / Concert</p>
        <h1>Concert not found.</h1>
        <button type="button" className="secondary-btn" onClick={() => navigate('/concerts')}>Back to Concerts</button>
      </div>
    )
  }

  const totalAmount = selectedSeats.length * concert.price

  return (
    <div className="seat-selection-page">
      <div className="container seat-selection-wrap">
        <button type="button" className="seat-back-button" onClick={() => navigate(`/concerts/${concert.id}`)}>
          <span aria-hidden="true">←</span> Back to Concert
        </button>

        <header className="seat-page-header">
          <p className="section-label">Your live experience</p>
          <h1>Select Your Seats</h1>
          <p>{concert.name}</p>
          <span>{concert.date} <b aria-hidden="true">•</b> {concert.time} · {concert.venue}, {concert.city}</span>
        </header>

        <div className="seat-selection-layout">
          <section className="seat-map-panel">
            <div className="seat-panel-heading"><div><p className="section-label">Choose your view</p><h2>Pick your seats</h2></div><span>{selectedSeats.length} / {maximumSeats} selected</span></div>
            <div className="stage-display"><span>STAGE</span></div>
            <div className="seat-map" aria-label="Concert seat map">
              {allSeats.map((seatId) => <Seat key={seatId} seatId={seatId} status={getSeatStatus(seatId)} onClick={handleSeatClick} />)}
            </div>
            <div className="seat-legend">
              <span><i className="legend-seat available" />Available</span>
              <span><i className="legend-seat selected" />Selected</span>
              <span><i className="legend-seat booked" />Booked</span>
            </div>
          </section>

          <aside className="seat-summary-panel">
            <p className="section-label">Your booking</p>
            <h2>Booking Summary</h2>
            <div className="seat-summary-event"><strong>{concert.name}</strong><span>{concert.artist}</span></div>
            <div className="seat-summary-list">
              <div><span>Selected Seats</span><strong>{selectedSeats.length ? selectedSeats.join(', ') : 'No seats selected'}</strong></div>
              <div><span>Ticket Price</span><strong>₹{concert.price}</strong></div>
              <div><span>Number of Tickets</span><strong>{selectedSeats.length}</strong></div>
              <div className="seat-total-row"><span>Total</span><strong>₹{totalAmount}</strong></div>
            </div>
            {limitMessage && <p className="seat-limit-message" role="status">{limitMessage}</p>}
            <button type="button" className="primary-btn seat-continue-button" disabled={selectedSeats.length === 0} onClick={() => navigate('/booking-summary', { state: { concert, selectedSeats } })}>Continue to Booking Summary <span aria-hidden="true">→</span></button>
            <p className="seat-summary-note">You can select up to {maximumSeats} seats per booking.</p>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default SeatSelection
