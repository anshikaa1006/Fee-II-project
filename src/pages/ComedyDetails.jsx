import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function ComedyDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [show, setShow] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    const loadComedy = async () => {
      setIsLoading(true)
      setError('')
      setShow(null)
      setImageFailed(false)

      try {
        const response = await fetch('/comedy.json')
        if (!response.ok) throw new Error('Unable to load comedy details.')

        const shows = await response.json()
        const selectedShow = shows.find((item) => String(item.id) === String(id))

        if (!selectedShow) {
          setError('not-found')
        } else {
          setShow(selectedShow)
        }
      } catch {
        setError('load-error')
      } finally {
        setIsLoading(false)
      }
    }

    loadComedy()
  }, [id])

  if (isLoading) {
    return <div className="comedy-detail-state container"><p className="section-label">Please wait</p><h1>Loading comedy details...</h1></div>
  }

  if (error === 'load-error') {
    return (
      <div className="comedy-detail-state container">
        <p className="section-label">Something went wrong</p>
        <h1>Unable to load comedy details.</h1>
        <button type="button" className="secondary-btn" onClick={() => navigate('/comedy')}>Back to Comedy</button>
      </div>
    )
  }

  if (error === 'not-found' || !show) {
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
        <button type="button" className="detail-back-button" onClick={() => navigate('/comedy')}>
          <span aria-hidden="true">←</span> Back to Comedy
        </button>

        <section className="comedy-detail-hero">
          <div className="comedy-detail-image-wrap">
            {imageFailed || !show.image ? (
              <div className="comedy-detail-fallback" aria-label={`${show.artist} comedy placeholder`}>
                <strong>{artistInitials}</strong>
                <span>STAND-UP COMEDY</span>
              </div>
            ) : (
              <img src={show.image} alt={`${show.artist} at ${show.name}`} onError={() => setImageFailed(true)} />
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
