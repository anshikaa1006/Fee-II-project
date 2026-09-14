import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function MovieDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch('/movies.json')
        if (!response.ok) throw new Error('Unable to load movie details.')
        const movies = await response.json()
        const found = movies.find((item) => String(item.id) === String(id))
        setMovie(found || null)
      } finally {
        setLoading(false)
      }
    }

    fetchMovie()
  }, [id])

  if (loading) {
    return <div className="movie-details-state container"><p className="section-label">Cinema details</p><h1>Loading movie...</h1></div>
  }

  if (!movie) {
    return (
      <div className="movie-details-state container">
        <p className="section-label">404 / Movie</p>
        <h1>Movie not found.</h1>
        <button type="button" className="secondary-btn" onClick={() => navigate('/movies')}>Back to Movies</button>
      </div>
    )
  }

  return (
    <div className="movie-details-page">
      <div className="container movie-details-wrap">
        <article className="movie-details-card">
          <div className="movie-details-poster">
            <img src={movie.image} alt={movie.title} onError={(event) => { event.currentTarget.src = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80' }} />
            <span className="movie-rating-badge">★ {movie.rating}</span>
          </div>
          <div className="movie-details-info">
            <span className="movie-kicker">{movie.genre}</span>
            <h1>{movie.title}</h1>
            <div className="movie-details-meta">
              <span><strong>Genre</strong>{movie.genre}</span>
              <span><strong>Rating</strong>{movie.rating}</span>
              <span><strong>Language</strong>{movie.language}</span>
              <span><strong>Duration</strong>{movie.duration}</span>
              <span><strong>Release Date</strong>{movie.releaseDate}</span>
              <span><strong>Theatre</strong>{movie.theatre}</span>
              <span><strong>City</strong>{movie.city}</span>
              <span><strong>Price</strong>₹{movie.price}</span>
            </div>
            <p className="movie-description">{movie.description}</p>
            <div className="movie-details-actions">
              <button type="button" className="primary-btn" onClick={() => navigate('/movie-seats/' + movie.id, { state: { movie, event: movie, selectedSeats: [] } })}>Book Tickets</button>
              <button type="button" className="secondary-btn" onClick={() => navigate('/movies')}>Back to Movies</button>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}

export default MovieDetails
