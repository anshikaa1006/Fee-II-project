import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import DigitalTicket from '../components/DigitalTicket'

const createBookingId = () => `VIB${Math.floor(10000 + Math.random() * 90000)}`

const readStoredBookings = () => {
  try {
    const storedBookings = JSON.parse(localStorage.getItem('vibeBookings'))
    return Array.isArray(storedBookings) ? storedBookings : []
  } catch {
    return []
  }
}

function Confirmation() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [bookingId] = useState(createBookingId)
  const event = state?.event || state?.concert
  const eventType = state?.type || event?.type || 'concert'
  const selectedSeats = state?.selectedSeats
  const subtotal = state?.subtotal ?? 0
  const bookingFee = state?.bookingFee ?? 100
  const total = state?.total ?? 0
  const paymentMethod = state?.paymentMethod || 'UPI'

  const booking = useMemo(() => {
    if (!event || !selectedSeats || selectedSeats.length === 0) return null

    return {
      bookingId,
      type: eventType,
      eventName: event.title || event.eventName || event.name || 'Event',
      performer: event.performer || event.artist || '',
      category: event.category || event.genre || eventType,
      venue: event.venue,
      city: event.city,
      date: event.date,
      time: event.time,
      image: event.image,
      seats: selectedSeats,
      price: event.price,
      subtotal,
      bookingFee,
      total,
      paymentMethod,
      status: 'CONFIRMED',
    }
  }, [bookingFee, bookingId, event, eventType, paymentMethod, selectedSeats, subtotal, total])

  useEffect(() => {
    if (!booking) return

    const existingBookings = readStoredBookings()
    const alreadyStored = existingBookings.some((storedBooking) => storedBooking.bookingId === booking.bookingId)
    if (!alreadyStored) {
      localStorage.setItem('vibeBookings', JSON.stringify([...existingBookings, booking]))
    }
  }, [booking])

  if (!booking) {
    return (
      <div className="confirmation-state container">
        <p className="section-label">Your ticket</p>
        <h1>No booking information found.</h1>
        <button type="button" className="secondary-btn" onClick={() => navigate('/concerts')}>Back to Concerts</button>
      </div>
    )
  }

  return (
    <div className="confirmation-page">
      <div className="container confirmation-wrap">
        <header className="confirmation-header">
          <div className="confirmation-check" aria-hidden="true">✓</div>
          <p className="section-label">Payment successful</p>
          <h1>Booking Confirmed!</h1>
          <p>Your tickets are ready.</p>
        </header>

        <DigitalTicket booking={booking} />

        <div className="confirmation-actions">
          <button type="button" className="primary-btn" onClick={() => navigate('/my-tickets')}>View My Tickets <span aria-hidden="true">→</span></button>
          <button type="button" className="secondary-btn" onClick={() => navigate('/concerts')}>Continue Exploring</button>
          <button type="button" className="confirmation-home-button" onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    </div>
  )
}

export default Confirmation
