import { useState } from 'react'
import { Link } from 'react-router-dom'

function ComedyCard({ show }) {
  const [imageFailed, setImageFailed] = useState(false)
  const initials = (show.performer || show.artist || 'COMEDY')
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)

  return (
    <article className="comedy-card">
      <div className="comedy-card-image-wrap">
        {imageFailed || !show.image ? (
          <div className="comedy-card-fallback">
            <span>{initials || 'V'}</span>
            <small>COMEDY</small>
          </div>
        ) : (
          <img src={show.image} alt={show.name} className="comedy-card-image" onError={() => setImageFailed(true)} />
        )}
        <span className="comedy-card-category">{show.category}</span>
      </div>

      <div className="comedy-card-content">
        <div className="comedy-card-heading">
          <span className="comedy-card-name">{show.name}</span>
          <span className="comedy-card-performer">{show.performer || show.artist}</span>
        </div>

        <div className="comedy-card-meta">
          <span>{show.date}</span>
          <span>{show.time}</span>
        </div>

        <div className="comedy-card-venue">
          <span>{show.venue}</span>
          <span>{show.city}</span>
        </div>

        <div className="comedy-card-bottom">
          <div>
            <small>Starting from</small>
            <span className="comedy-price">₹{show.price}</span>
          </div>
          <div>
            <small>{show.availableSeats || 0} seats available</small>
          </div>
        </div>

        <div className="comedy-card-actions">
          <Link className="secondary-btn comedy-details-button" to={`/comedy/${show.id}`}>View Details</Link>
          <Link className="primary-btn comedy-book-button" to={`/comedy/${show.id}`}>Book Now <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </article>
  )
}

export default ComedyCard
