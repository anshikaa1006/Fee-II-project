import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Seat from '../components/Seat'

const seatRows = ['A', 'B', 'C', 'D', 'E']
const seatsPerRow = 6
const comedyBookedSeats = ['A2', 'B5', 'C3', 'D1', 'E6']
const concertBookedSeats = ['A3', 'B5', 'C2', 'D7', 'E4']
const maximumSeats = 6

function SeatSelection() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const isComedyRoute = location.pathname.startsWith('/seats/comedy/')
  const [event, setEvent] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [limitMessage, setLimitMessage] = useState('')
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    const loadEvent = async () => {
      setIsLoading(true)
      setError('')
      setEvent(null)
      setSelectedSeats(location.state?.selectedSeats || [])
      setLimitMessage('')
      setImageFailed(false)

      try {
        const response = await fetch(isComedyRoute ? '/comedy.json' : '/concerts.json')
        if (!response.ok) throw new Error('Unable to load seat information.')

        const records = await response.json()
        const selectedEvent = records.find((item) => String(item.id) === String(id))

        if (!selectedEvent) {
          setError(isComedyRoute ? 'not-found-comedy' : 'not-found')
        } else {
          setEvent(selectedEvent)
        }
      } catch {
        setError('load-error')
      } finally {
        setIsLoading(false)
      }
    }

    loadEvent()
  }, [id, isComedyRoute, location.state])

  const allSeats = useMemo(() => (
    seatRows.flatMap((row) => Array.from({ length: seatsPerRow }, (_, index) => `${row}${index + 1}`))
  ), [])

  const bookedSeats = useMemo(() => isComedyRoute ? comedyBookedSeats : concertBookedSeats, [isComedyRoute])

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
        <button type="button" className="secondary-btn" onClick={() => navigate(isComedyRoute ? '/comedy' : '/concerts')}>{isComedyRoute ? 'Back to Comedy' : 'Back to Concerts'}</button>
      </div>
    )
  }

  if (error === 'not-found-comedy' || error === 'not-found' || !event) {
    return (
      <div className="seat-page-state container">
        <p className="section-label">{isComedyRoute ? '404 / Comedy' : '404 / Concert'}</p>
        <h1>{isComedyRoute ? 'Comedy show not found.' : 'Concert not found.'}</h1>
        <button type="button" className="secondary-btn" onClick={() => navigate(isComedyRoute ? '/comedy' : '/concerts')}>{isComedyRoute ? 'Back to Comedy' : 'Back to Concerts'}</button>
      </div>
    )
  }

  const totalAmount = selectedSeats.length * event.price
  const eventTitle = event.name || event.eventName || 'Event'
  const eventPerformer = event.artist || event.performer || ''
  const bookBackPath = isComedyRoute ? `/comedy/${event.id}` : `/concerts/${event.id}`

  return (
    <div className="seat-selection-page">
      <div className="container seat-selection-wrap">
        <button type="button" className="seat-back-button" onClick={() => navigate(bookBackPath)}>
          <span aria-hidden="true">←</span> {isComedyRoute ? 'Back to Comedy' : 'Back to Concert'}
        </button>

        <header className="seat-page-header">
          <p className="section-label">Your live experience</p>
          <h1>Select Your Seats</h1>
          <p>{eventTitle}</p>
          <span>{event.date} <b aria-hidden="true">•</b> {event.time} · {event.venue}, {event.city}</span>
        </header>

        <div className="seat-selection-layout">
          <section className="seat-map-panel">
            <div className="seat-panel-heading"><div><p className="section-label">Choose your view</p><h2>Pick your seats</h2></div><span>{selectedSeats.length} / {maximumSeats} selected</span></div>
            <div className="stage-display"><span>STAGE</span></div>
            <div className="seat-map" aria-label={isComedyRoute ? 'Comedy seat map' : 'Concert seat map'}>
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
            <div className="seat-summary-event"><strong>{eventTitle}</strong><span>{eventPerformer}</span></div>
            <div className="seat-summary-list">
              <div><span>Selected Seats</span><strong>{selectedSeats.length ? selectedSeats.join(', ') : 'No seats selected'}</strong></div>
              <div><span>Ticket Price</span><strong>₹{event.price}</strong></div>
              <div><span>Number of Tickets</span><strong>{selectedSeats.length}</strong></div>
              <div className="seat-total-row"><span>Total</span><strong>₹{totalAmount}</strong></div>
            </div>
            {limitMessage && <p className="seat-limit-message" role="status">{limitMessage}</p>}
            <button type="button" className="primary-btn seat-continue-button" disabled={selectedSeats.length === 0} onClick={() => navigate('/booking-summary', { state: { event, selectedSeats, type: isComedyRoute ? 'comedy' : 'concert' } })}>Continue to Booking Summary <span aria-hidden="true">→</span></button>
            <p className="seat-summary-note">You can select up to {maximumSeats} seats per booking.</p>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default SeatSelection
