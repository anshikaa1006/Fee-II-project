import { useState } from 'react'
import { Link } from 'react-router-dom'

function ConcertCard({ concert, featured = false }) {
  const [imageFailed, setImageFailed] = useState(false)
  const isLowAvailability = concert.availableSeats < 50
  const artistInitials = concert.artist
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 3)

  return (
    <article className={`concert-card ${featured ? 'concert-card-featured' : ''}`}>
      <div className="concert-card-image-wrap">
        {imageFailed ? (
          <div className="concert-image-fallback" aria-label={`${concert.artist} concert placeholder`}>
            <span>{artistInitials}</span>
            <small>LIVE MUSIC</small>
          </div>
        ) : (
          <img
            src={concert.image}
            alt={`${concert.artist} performing at ${concert.name}`}
            className="concert-card-image"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        )}
        <div className="concert-image-shade" />
        <span className="concert-category-badge">{concert.category}</span>
        <span className={`concert-seat-badge ${isLowAvailability ? 'is-low' : ''}`}>
          {isLowAvailability ? `Only ${concert.availableSeats} seats left` : `${concert.availableSeats} seats left`}
        </span>
      </div>

      <div className="concert-card-body">
        <p className="concert-artist">{concert.artist}</p>
        <h3>{concert.name}</h3>
        <div className="concert-card-info">
          <span>{concert.date}</span>
          <span>{concert.time}</span>
          <span>{concert.city}</span>
        </div>
        <p className="concert-venue">{concert.venue}</p>
        <div className="concert-card-footer">
          <div>
            <small>Starting from</small>
            <strong>₹{concert.price}</strong>
          </div>
          <Link to={`/concerts/${concert.id}`} className="concert-book-button">Book Now <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </article>
  )
}

export default ConcertCard
