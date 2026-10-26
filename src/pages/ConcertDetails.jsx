import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import useJsonArray from '../hooks/useJsonArray'

function ConcertDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [failedImage, setFailedImage] = useState('')
  const { data: concerts, error, loading, retry } = useJsonArray('/concerts.json', 'concert details')
  const concert = concerts?.find((item) => String(item.id) === String(id))

  if (loading) {
    return <div className="concert-detail-state container"><p className="section-label">Please wait</p><h1>Loading concert details...</h1></div>
  }

  if (error) {
    return (
      <div className="concert-detail-state container">
        <p className="section-label">Something went wrong</p>
        <h1>Unable to load concert details.</h1>
        <p role="alert">{error}</p>
        <button type="button" className="primary-btn" onClick={retry}>Try Again</button>
        <button type="button" className="secondary-btn" onClick={() => navigate('/concerts')}>Back to Concerts</button>
      </div>
    )
  }

  if (!concert) {
    return (
      <div className="concert-detail-state container">
        <p className="section-label">404 / Concert</p>
        <h1>Concert not found.</h1>
        <button type="button" className="secondary-btn" onClick={() => navigate('/concerts')}>Back to Concerts</button>
      </div>
    )
  }

  const isLowAvailability = concert.availableSeats < 50
  const artistInitials = concert.artist.split(' ').map((word) => word[0]).join('').slice(0, 3)

  return (
    <div className="concert-detail-page">
      <div className="container concert-detail-wrap">
        <Breadcrumbs items={[
          { label: 'Home', to: '/' },
          { label: 'Concerts', to: '/concerts' },
          { label: concert.name },
        ]} />
        <button type="button" className="detail-back-button" onClick={() => navigate('/concerts')}>
          <span aria-hidden="true">←</span> Back to Concerts
        </button>

        <section className="concert-detail-hero">
          <div className="concert-detail-image-wrap">
            {failedImage === concert.image ? (
              <div className="concert-detail-fallback" aria-label={`${concert.artist} concert placeholder`}>
                <strong>{artistInitials}</strong>
                <span>LIVE MUSIC</span>
              </div>
            ) : (
              <img src={concert.image} alt={`${concert.artist} at ${concert.name}`} onError={() => setFailedImage(concert.image)} />
            )}
            <div className="concert-detail-image-overlay" />
            <span className="concert-detail-category">{concert.category}</span>
          </div>

          <div className="concert-detail-copy">
            <p className="section-label">Live event</p>
            <p className="concert-detail-artist">{concert.artist}</p>
            <h1>{concert.name}</h1>
            <p className="concert-detail-description">{concert.description}</p>
            <div className="concert-detail-price"><small>Price per ticket</small><strong>₹{concert.price}</strong></div>
            <button type="button" className="primary-btn detail-book-button" onClick={() => navigate(`/seats/${concert.id}`)}>Book Tickets <span aria-hidden="true">→</span></button>
          </div>
        </section>

        <section className="concert-detail-info-grid" aria-label="Concert information">
          <div className="concert-info-tile"><span aria-hidden="true">◷</span><div><small>Date</small><strong>{concert.date}</strong></div></div>
          <div className="concert-info-tile"><span aria-hidden="true">◉</span><div><small>Time</small><strong>{concert.time}</strong></div></div>
          <div className="concert-info-tile"><span aria-hidden="true">⌖</span><div><small>Venue</small><strong>{concert.venue}</strong></div></div>
          <div className="concert-info-tile"><span aria-hidden="true">◇</span><div><small>City</small><strong>{concert.city}</strong></div></div>
          <div className={`concert-info-tile availability-tile ${isLowAvailability ? 'is-low' : ''}`}><span aria-hidden="true">◌</span><div><small>Availability</small><strong>{isLowAvailability ? `Only ${concert.availableSeats} seats left` : `${concert.availableSeats} seats available`}</strong></div></div>
        </section>

        <section className="concert-detail-lower-grid">
          <article className="detail-content-panel">
            <p className="section-label">About the event</p>
            <h2>One night. One room. All the energy.</h2>
            <p>{concert.description}</p>
          </article>
          <article className="artist-detail-panel">
            <p className="section-label">About the artist</p>
            <div className="artist-detail-mark">{artistInitials}</div>
            <h2>{concert.artist}</h2>
            <p>Artist: {concert.artist}</p>
          </article>
        </section>
      </div>
    </div>
  )
}

export default ConcertDetails
