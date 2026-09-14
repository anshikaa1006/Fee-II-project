import { useState } from 'react'

function DigitalTicket({ booking, compact = false }) {
  const [imageFailed, setImageFailed] = useState(false)
  const eventName = booking.eventName || booking.name || 'Event'
  const performer = booking.performer || booking.artist || ''
  const typeLabel = String(booking.type || 'event').toUpperCase()
  const category = booking.category ? `${typeLabel} · ${booking.category}` : typeLabel
  const seats = Array.isArray(booking.seats) && booking.seats.length ? booking.seats.join(', ') : 'General admission'
  const artistInitials = performer
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 3) || 'EVT'

  return (
    <article className={`digital-ticket ${compact ? 'digital-ticket-compact' : ''}`}>
      <div className="ticket-topline"><span>VIBE</span><span>DIGITAL TICKET</span></div>
      <div className="digital-ticket-main">
        <div className="ticket-event-image">
          {imageFailed || !booking.image ? (
            <div className="ticket-image-fallback"><strong>{artistInitials}</strong><small>LIVE EVENT</small></div>
          ) : (
            <img src={booking.image} alt={`${performer || eventName} at ${eventName}`} onError={() => setImageFailed(true)} />
          )}
        </div>
        <div className="ticket-event-copy">
          <span className="ticket-category">{category}</span>
          <h2>{eventName}</h2>
          {performer && <p>{performer}</p>}
        </div>
      </div>
      <div className="ticket-dashed-line" />
      <div className="ticket-details-grid">
        <div><small>Date</small><strong>{booking.date}</strong></div>
        <div><small>Time</small><strong>{booking.time}</strong></div>
        <div><small>Venue</small><strong>{booking.venue}</strong></div>
        <div><small>City</small><strong>{booking.city}</strong></div>
        <div><small>Seats</small><strong>{seats}</strong></div>
        <div><small>Booking ID</small><strong>{booking.bookingId || 'Pending'}</strong></div>
      </div>
      <div className="ticket-bottom-row">
        <div><small>Total Paid</small><strong>₹{booking.total ?? 0}</strong></div>
        <div><small>Payment</small><strong>{booking.paymentMethod || 'Demo'}</strong></div>
        <span className="ticket-status">{booking.status || 'CONFIRMED'}</span>
      </div>
      {!compact && (
        <div className="ticket-qr-area">
          <div className="ticket-qr-placeholder" aria-label="Decorative ticket verification placeholder">
            <span className="qr-square qr-square-one" /><span className="qr-square qr-square-two" /><span className="qr-square qr-square-three" /><span className="qr-dots" />
          </div>
          <span>Scan at venue<br /><small>Ticket Verification</small></span>
        </div>
      )}
    </article>
  )
}

export default DigitalTicket
