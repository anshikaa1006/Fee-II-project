import { useEffect, useMemo, useState } from 'react'
import ConcertCard from '../components/ConcertCard'

const genreOptions = ['All', 'K-Pop', 'EDM', 'Pop', 'Rock', 'Hip-Hop', 'International']

const getConcerts = async () => {
  const response = await fetch('/concerts.json')
  if (!response.ok) throw new Error('Concert data could not be loaded.')
  return response.json()
}

function Concerts() {
  const [concerts, setConcerts] = useState([])
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [cityFilter, setCityFilter] = useState('All')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchConcerts = async () => {
    setIsLoading(true)
    setError('')

    try {
      const data = await getConcerts()
      setConcerts(data)
    } catch (fetchError) {
      setError(fetchError.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getConcerts()
      .then((data) => setConcerts(data))
      .catch((fetchError) => setError(fetchError.message))
      .finally(() => setIsLoading(false))
  }, [])

  const cities = useMemo(() => [...new Set(concerts.map((concert) => concert.city))].sort(), [concerts])
  const categories = useMemo(() => [...new Set(concerts.map((concert) => concert.category))].sort(), [concerts])

  const filteredConcerts = useMemo(() => {
    const searchTerm = search.trim().toLowerCase()

    return concerts.filter((concert) => {
      const searchableText = `${concert.name} ${concert.artist} ${concert.city}`.toLowerCase()
      const matchesSearch = !searchTerm || searchableText.includes(searchTerm)
      const matchesGenre = genre === 'All' || concert.category === genre
      const matchesCategory = categoryFilter === 'All' || concert.category === categoryFilter
      const matchesCity = cityFilter === 'All' || concert.city === cityFilter

      return matchesSearch && matchesGenre && matchesCategory && matchesCity
    })
  }, [categoryFilter, cityFilter, concerts, genre, search])

  const hasActiveFilters = search.trim() || genre !== 'All' || categoryFilter !== 'All' || cityFilter !== 'All'
  const featuredConcerts = hasActiveFilters ? filteredConcerts.slice(0, 3) : concerts.slice(0, 3)
  const spotlightConcert = concerts.find((concert) => concert.artist === 'Stray Kids') || concerts[0]

  const clearFilters = () => {
    setSearch('')
    setGenre('All')
    setCategoryFilter('All')
    setCityFilter('All')
  }

  return (
    <div className="concerts-page">
      <section className="concert-hero">
        <div className="concert-hero-grid" />
        <div className="concert-hero-glow concert-hero-glow-one" />
        <div className="concert-hero-glow concert-hero-glow-two" />
        <div className="container concert-hero-content">
          <div>
            <p className="section-label">Live music</p>
            <h1>Feel the Music.<br /><span className="gradient-text">Live the Moment.</span></h1>
            <p className="concert-hero-description">Discover unforgettable live performances from the artists you love.</p>
            <a href="#upcoming-concerts" className="primary-btn">Explore Concerts <span aria-hidden="true">↓</span></a>
          </div>
          <div className="concert-hero-orbit" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit-disc"><span>TURN<br />IT<br />UP</span></div>
            <div className="hero-music-note note-one">♪</div>
            <div className="hero-music-note note-two">♫</div>
          </div>
        </div>
        <div className="container concert-stats">
          <div><strong>{concerts.length || '6'}+</strong><span>Concerts</span></div>
          <div><strong>06</strong><span>Multiple Cities</span></div>
          <div><strong>LIVE</strong><span>Experiences</span></div>
        </div>
      </section>

      <main>
        <section className="container concert-discovery">
          <div className="genre-scroll" aria-label="Concert genres">
            {genreOptions.map((option) => (
              <button type="button" key={option} className={`genre-chip ${genre === option ? 'active' : ''}`} onClick={() => setGenre(option)}>
                {option}
              </button>
            ))}
          </div>

          <div className="concert-filter-bar">
            <label className="concert-search">
              <span aria-hidden="true">⌕</span>
              <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search artist, concert or city..." aria-label="Search concerts" />
            </label>
            <label>
              <span className="sr-only">Category</span>
              <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
                <option value="All">All categories</option>
                {categories.map((category) => <option value={category} key={category}>{category}</option>)}
              </select>
            </label>
            <label>
              <span className="sr-only">City</span>
              <select value={cityFilter} onChange={(event) => setCityFilter(event.target.value)}>
                <option value="All">All cities</option>
                {cities.map((city) => <option value={city} key={city}>{city}</option>)}
              </select>
            </label>
          </div>
        </section>

        {isLoading ? (
          <section className="container concert-section-block">
            <div className="concert-section-title"><p className="section-label">Loading</p><h2>Finding your next live experience...</h2></div>
            <div className="concert-skeleton-grid">{[1, 2, 3].map((item) => <div className="concert-skeleton" key={item} />)}</div>
          </section>
        ) : error ? (
          <section className="container concert-message-state">
            <p className="section-label">Something went wrong</p>
            <h2>Unable to load concerts.</h2>
            <p>Check your connection and try again.</p>
            <button type="button" className="primary-btn" onClick={fetchConcerts}>Try Again</button>
          </section>
        ) : (
          <>
            <section className="container concert-section-block trending-concerts-block">
              <div className="concert-section-title">
                <p className="section-label">🔥 Trending now</p>
                <h2>Concerts Everyone Is Talking About</h2>
              </div>
              <div className="featured-concert-grid">
                {featuredConcerts.map((concert) => <ConcertCard key={concert.id} concert={concert} featured />)}
              </div>
            </section>

            {spotlightConcert && (
              <section className="artist-spotlight">
                <div className="container artist-spotlight-layout">
                  <div className="spotlight-visual"><span className="spotlight-initials">{spotlightConcert.artist.split(' ').map((word) => word[0]).join('')}</span><span className="spotlight-caption">ARTIST<br />SPOTLIGHT</span></div>
                  <div className="spotlight-copy">
                    <p className="section-label">Artist spotlight</p>
                    <h2>{spotlightConcert.artist}</h2>
                    <p>One of the most electric names in global music brings a high-voltage live performance to the VIBE stage.</p>
                    <div className="spotlight-details"><span>{spotlightConcert.name}</span><span>{spotlightConcert.date} · {spotlightConcert.time}</span><span>{spotlightConcert.venue} · {spotlightConcert.city}</span></div>
                    <a href="#upcoming-concerts" className="secondary-btn">View Concert <span aria-hidden="true">→</span></a>
                  </div>
                </div>
              </section>
            )}

            <section id="upcoming-concerts" className="container concert-section-block upcoming-concerts-block">
              <div className="concert-section-title"><p className="section-label">Upcoming concerts</p><h2>Find Your Next Live Experience</h2></div>
              {filteredConcerts.length > 0 ? (
                <div className="concert-card-grid">{filteredConcerts.map((concert) => <ConcertCard key={concert.id} concert={concert} />)}</div>
              ) : (
                <div className="concert-message-state concert-empty-state"><p className="section-label">No matches</p><h2>No concerts found</h2><p>Try changing your search or filters.</p><button type="button" className="secondary-btn" onClick={clearFilters}>Clear Filters</button></div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default Concerts
