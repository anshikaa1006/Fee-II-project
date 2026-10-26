
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import ComedyCard from '../components/ComedyCard'
import useJsonArray from '../hooks/useJsonArray'

const defaultFilters = {
  query: '',
}

function Comedy() {
  const navigate = useNavigate()
  const [search, setSearch] = useState(defaultFilters.query)

  const {
    data: shows,
    error,
    loading,
    retry,
  } = useJsonArray('/comedy.json', 'comedy shows')

  const filteredShows = useMemo(() => {
    const term = search.trim().toLowerCase()

    return shows.filter((show) => {
      const searchText =
        `${show.name} ${show.performer} ${show.city}`.toLowerCase()

      return !term || searchText.includes(term)
    })
  }, [search, shows])

  const featured = filteredShows.length > 0
    ? filteredShows.slice(0, 2)
    : []

  const upcoming = filteredShows

  const clearFilters = () => {
    setSearch(defaultFilters.query)
  }

  if (loading) {
    return (
      <div className="comedy-page">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Comedy' },
          ]}
        />

        <div className="container comedy-page-wrap">
          <section className="comedy-listing-loading">
            <p className="section-label">Loading comedy</p>
            <h1>Loading Comedy Shows...</h1>
          </section>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="comedy-page">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Comedy' },
          ]}
        />

        <div className="container comedy-page-wrap">
          <section className="comedy-listing-error">
            <p className="section-label">Something went wrong</p>
            <h1>Unable to load comedy shows.</h1>
            <p role="alert">{error}</p>

            <button
              type="button"
              className="primary-btn"
              onClick={retry}
            >
              Try Again
            </button>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="comedy-page">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Comedy' },
        ]}
      />

      <section className="comedy-hero">
        <div className="container comedy-hero-wrap">
          <div className="comedy-hero-copy">
            <span className="section-label">Live Laughs</span>
            <h1>Comedy Shows</h1>

            <p className="comedy-hero-description">
              Laugh louder. Experience comedy live.
            </p>

            <p className="comedy-hero-subtitle">
              Discover stand-up shows and unforgettable comedy experiences.
            </p>

            <div className="comedy-hero-actions">
              <a href="#comedy-grid" className="primary-btn">
                Explore Shows <span aria-hidden="true">↓</span>
              </a>

              <button
                type="button"
                className="secondary-btn"
                onClick={() => navigate('/my-tickets')}
              >
                My Tickets
              </button>
            </div>
          </div>

          <div className="comedy-hero-aside">
            <div className="comedy-hero-card">
              <span className="comedy-hero-label">Trending</span>
              <span className="comedy-hero-badge">Laughs</span>
              <span className="comedy-hero-badge light">Live</span>
              <span className="comedy-hero-number">{shows.length}</span>
              <span className="comedy-hero-caption">shows</span>
            </div>
          </div>
        </div>
      </section>

      <section className="comedy-toolbar">
        <div className="container comedy-toolbar-wrap">
          <div className="comedy-search">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search comedy shows or comedians..."
              aria-label="Search comedy shows or comedians"
            />
          </div>
        </div>
      </section>

      {shows.length > 0 && (
        <section className="container comedy-featured">
          <div className="section-heading-row">
            <div>
              <p className="section-label">Trending comedy</p>
              <h2>Trending Comedy Shows</h2>
            </div>

            <span className="comedy-count">
              {filteredShows.length} results
            </span>
          </div>

          {featured.length > 0 ? (
            <div className="comedy-featured-grid">
              {featured.map((show) => (
                <ComedyCard
                  key={show.id}
                  show={show}
                  featured
                />
              ))}
            </div>
          ) : (
            <div className="comedy-list-empty">
              <p className="section-label">No results</p>
              <h2>No trending comedy shows found</h2>

              <button
                type="button"
                className="secondary-btn"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>
      )}

      <section className="container comedy-section">
        <div className="section-heading-row">
          <div>
            <p className="section-label">Upcoming comedy</p>
            <h2>Upcoming Comedy Shows</h2>
          </div>

          <span className="comedy-count">
            {filteredShows.length} results
          </span>
        </div>

        {shows.length === 0 ? (
          <div className="comedy-list-empty">
            <p className="section-label">No events yet</p>
            <h2>No comedy shows are currently available.</h2>
          </div>
        ) : filteredShows.length === 0 ? (
          <div className="comedy-list-empty">
            <p className="section-label">No matches</p>
            <h2>No comedy shows found</h2>
            <p>Try changing your search or filters.</p>

            <button
              type="button"
              className="secondary-btn"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="comedy-grid" id="comedy-grid">
            {upcoming.map((show) => (
              <ComedyCard key={show.id} show={show} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Comedy
