import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import useJsonArray from '../hooks/useJsonArray'

function ComedyDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [failedImage, setFailedImage] = useState('')
  const { data: shows, error, loading, retry } = useJsonArray('/comedy.json', 'comedy details')
  const show = shows?.find((item) => String(item.id) === String(id))

  if (loading) {
    return <div className="comedy-detail-state container"><p className="section-label">Please wait</p><h1>Loading comedy details...</h1></div>
  }

  if (error) {
    return (
      <div className="comedy-detail-state container">
        <p className="section-label">Something went wrong</p>
        <h1>Unable to load comedy details.</h1>
        <p role="alert">{error}</p>
        <button type="button" className="primary-btn" onClick={retry}>Try Again</button>
        <button type="button" className="secondary-btn" onClick={() => navigate('/comedy')}>Back to Comedy</button>
      </div>
    )
  }

  if (!show) {
    return (
      <div className="comedy-detail-state container">
        <p className="section-label">404 / Comedy</p>
        <h1>Comedy show not found.</h1>
        <button type="button" className="secondary-btn" onClick={() => navigate('/comedy')}>Back to Comedy</button>
      </div>
    )
  }

  const artistInitials = (show.artist || 'COMEDY').split(' ').map((word) => word[0]).join('').slice(0, 3)

  return (
    <div className="comedy-detail-page">
      <div className="container comedy-detail-wrap">
        <Breadcrumbs items={[
          { label: 'Home', to: '/' },
          { label: 'Comedy', to: '/comedy' },
          { label: show.name },
        ]} />
        <button type="button" className="detail-back-button" onClick={() => navigate('/comedy')}>
          <span aria-hidden="true">←</span> Back to Comedy
        </button>

        <section className="comedy-detail-hero">
          <div className="comedy-detail-image-wrap">
            {failedImage === show.image || !show.image ? (
              <div className="comedy-detail-fallback" aria-label={`${show.artist} comedy placeholder`}>
                <strong>{artistInitials}</strong>
                <span>STAND-UP COMEDY</span>
              </div>
            ) : (
              <img src={show.image} alt={`${show.artist} at ${show.name}`} onError={() => setFailedImage(show.image)} />
            )}
            <span className="comedy-detail-category">{show.category}</span>
          </div>

          <div className="comedy-detail-copy">
            <p className="section-label">Live comedy</p>
            <p className="comedy-detail-artist">{show.artist}</p>
            <h1>{show.name}</h1>
            <p className="comedy-detail-description">{show.description}</p>
            <div className="comedy-detail-price"><small>Price per ticket</small><strong>₹{show.price}</strong></div>
            <div className="comedy-detail-meta-strip">
              <span>{show.date}</span>
              <span>{show.time}</span>
              <span>{show.venue}</span>
              <span>{show.city}</span>
              <span>{show.availableSeats} seats available</span>
            </div>
            <button type="button" className="primary-btn detail-book-button" onClick={() => navigate(`/comedy-seats/${show.id}`, { state: { comedy: show, event: show } })}>Book Tickets <span aria-hidden="true">→</span></button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ComedyDetails
