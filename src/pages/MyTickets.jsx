import { useState } from 'react'
import { Link } from 'react-router-dom'
import DigitalTicket from '../components/DigitalTicket'

const readBookings = () => {
  try {
    const storedBookings = JSON.parse(localStorage.getItem('vibeBookings'))
    return Array.isArray(storedBookings) ? storedBookings.filter((booking) => booking.status === 'CONFIRMED') : []
  } catch {
    return []
  }
}

function MyTickets() {
  const [bookings, setBookings] = useState(readBookings)

  const clearTickets = () => {
    localStorage.removeItem('vibeBookings')
    setBookings([])
  }

  return (
    <div className="my-tickets-page">
      <div className="container my-tickets-wrap">
        <header className="my-tickets-header">
          <div><p className="section-label">Your VIBE collection</p><h1>My Tickets</h1><p>Your confirmed VIBE bookings.</p></div>
          {bookings.length > 0 && <button type="button" className="clear-tickets-button" onClick={clearTickets}>Clear All Tickets</button>}
        </header>

        {bookings.length > 0 ? (
          <div className="my-tickets-list">
            {bookings.map((booking) => <DigitalTicket key={booking.bookingId} booking={booking} compact />)}
          </div>
        ) : (
          <section className="tickets-empty-state">
            <div className="empty-ticket-mark" aria-hidden="true">V</div>
            <p className="section-label">Your collection is waiting</p>
            <h2>No tickets yet</h2>
            <p>Your confirmed event tickets will appear here.</p>
            <Link to="/concerts" className="primary-btn">Explore Concerts <span aria-hidden="true">→</span></Link>
          </section>
        )}
      </div>
    </div>
  )
}

export default MyTickets
