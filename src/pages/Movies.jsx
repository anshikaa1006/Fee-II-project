import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import useJsonArray from '../hooks/useJsonArray'

function Movies() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const { data: movies, error, loading, retry } = useJsonArray('/movies.json', 'movies')

  const filteredMovies = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase()

    return movies.filter((movie) => {
      const matchesQuery = `${movie.title || ''} ${movie.genre || ''}`.toLowerCase().includes(cleanQuery)
      return matchesQuery
    })
  }, [movies, query])

  if (loading) {
    return (
      <div className="movies-page">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Movies' }]} />
        <div className="container movies-loading">
          <p className="section-label">Cinema collection</p>
          <h1>Loading Movies...</h1>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="movies-page">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Movies' }]} />
        <div className="container movies-loading">
          <p className="section-label">Something went wrong</p>
          <h1>Unable to load movies.</h1>
          <p role="alert">{error}</p>
          <button type="button" className="primary-btn" onClick={retry}>Try Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="movies-page">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Movies' }]} />
      <section className="movies-hero">
        <div className="container movies-hero-wrap">
          <div className="movies-hero-copy">
            <span className="movies-kicker">Now Playing</span>
            <h1>Lights. Camera. Book!</h1>
            <p className="movies-hero-text">Every screen is a story. Find your next favourite night out and book your seat before the lights go down.</p>
            <div className="movies-hero-actions">
              <Link className="primary-btn" to="#movie-grid">Browse Movies</Link>
              <button type="button" className="secondary-btn" onClick={() => navigate('/my-tickets')}>My Tickets</button>
            </div>
          </div>
          <div className="movies-hero-panel">
            <div className="movies-hero-panel-inner">
              <span className="movies-panel-label">Tonight's Highlight</span>
              <div className="movies-panel-feature">
                <span className="movies-panel-rating">8.8</span>
                <div>
                  <span className="movies-panel-category">Action</span>
                  <h3>Spider-Man: No Way Home</h3>
                </div>
              </div>
              <div className="movies-panel-meta">
                <span>IMAX</span>
                <span>Delhi</span>
                <span>7:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="movies-toolbar">
        <div className="container movies-toolbar-wrap">
          <div className="movies-search">
            <input type="search" placeholder="Search by movie or genre" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
        </div>
      </section>

      <section className="movies-grid-section container">
        <div className="section-heading-row">
          <div>
            <p className="section-label">The Screen List</p>
            <h2>Now Showing</h2>
          </div>
          <span className="movies-count">{filteredMovies.length} results</span>
        </div>
        {movies.length === 0 ? (
          <div className="movies-empty-state">
            <p className="section-label">No events yet</p>
            <h2>No movies are currently available.</h2>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="movies-empty-state">
            <p className="section-label">No matches</p>
            <h2>No movies match your search.</h2>
            <button type="button" className="secondary-btn" onClick={() => setQuery('')}>Clear Search</button>
          </div>
        ) : (
          <div className="movie-grid" id="movie-grid">
            {filteredMovies.map((movie) => (
            <article className="movie-card" key={movie.id}>
              <Link className="movie-poster" to={`/movie/${movie.id}`}>
                <span className="movie-poster-shadow" />
                <img src={movie.image} alt={movie.title} onError={(event) => { event.currentTarget.src = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80' }} />
                <span className="movie-rating-badge">★ {movie.rating}</span>
              </Link>
              <div className="movie-card-content">
                <div className="movie-card-top">
                  <span className="movie-genre">{movie.genre}</span>
                  <span className="movie-language">{movie.language}</span>
                </div>
                <h3><Link to={`/movie/${movie.id}`}>{movie.title}</Link></h3>
                <div className="movie-card-meta">
                  <span>{movie.duration}</span>
                  <span>{movie.city}</span>
                </div>
                <div className="movie-card-bottom">
                  <span className="movie-price">Starting from ₹{movie.price}</span>
                  <div className="movie-card-actions">
                    <button type="button" className="secondary-btn movie-details-button" onClick={() => navigate(`/movie/${movie.id}`)}>Details</button>
                    <button type="button" className="primary-btn movie-book-button" onClick={() => navigate(`/movie/${movie.id}`)}>Book Tickets</button>
                  </div>
                </div>
              </div>
            </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Movies
