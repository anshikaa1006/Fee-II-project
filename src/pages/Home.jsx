import { Link } from 'react-router-dom'

const categories = [
  {
    name: 'Movies',
    description: 'Big-screen stories, premieres and unforgettable nights.',
    path: '/movies',
    className: 'category-movies',
    visual: '01',
  },
  {
    name: 'Concerts',
    description: 'Feel the pulse of live music from every corner of the world.',
    path: '/concerts',
    className: 'category-concerts',
    visual: '02',
  },
  {
    name: 'Sports',
    description: 'Be there when the crowd roars and legends are made.',
    path: '/sports',
    className: 'category-sports',
    visual: '03',
  },
  {
    name: 'Comedy & Theatre',
    description: 'Stories, laughter and stage lights worth stepping out for.',
    path: '/comedy',
    className: 'category-theatre',
    visual: '04',
  },
]

const trendingEvents = [
  {
    category: 'Concert',
    name: 'Stray Kids: The dominATE Experience',
    details: 'Stray Kids · Live music',
    date: '20 Oct 2026',
    city: 'New Delhi',
    price: '₹1500',
    path: '/concerts',
    className: 'event-concert',
  },
  {
    category: 'Movie',
    name: 'Avengers: Secret Wars',
    details: 'Action · English',
    date: '24 Oct 2026',
    city: 'Mumbai',
    price: '₹250',
    path: '/movies',
    className: 'event-movie',
  },
  {
    category: 'Sports',
    name: 'India vs Australia',
    details: 'Cricket · International match',
    date: '02 Nov 2026',
    city: 'Ahmedabad',
    price: '₹1200',
    path: '/sports',
    className: 'event-sports',
  },
  {
    category: 'Comedy',
    name: 'The Laugh Club',
    details: 'Stand-up · Live show',
    date: '08 Nov 2026',
    city: 'Bengaluru',
    price: '₹800',
    path: '/comedy',
    className: 'event-comedy',
  },
]

const features = [
  { number: '01', title: 'Easy Booking', description: 'Find your event and book in just a few steps.' },
  { number: '02', title: 'Interactive Seats', description: 'Choose exactly where you want to sit.' },
  { number: '03', title: 'Secure Checkout', description: 'A simple and protected checkout experience.' },
  { number: '04', title: 'Digital Tickets', description: 'Keep all your confirmed bookings in one place.' },
]

function Home() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="container hero-layout">
          <div className="hero-copy reveal-up">
            <p className="section-label">Your entertainment destination</p>
            <h1>Experience the Event.<br /><span className="gradient-text">Book the Moment.</span></h1>
            <p className="hero-description">Discover unforgettable movies, concerts, sports and live entertainment. Choose your experience, pick your seats and make the moment yours.</p>
            <div className="hero-actions">
              <a href="#categories" className="primary-btn">Explore Events <span aria-hidden="true">↓</span></a>
              <Link to="/concerts" className="secondary-btn">Explore Concerts <span aria-hidden="true">→</span></Link>
            </div>
          </div>

          <div className="hero-stage reveal-up" aria-label="VIBE event highlights">
            <div className="stage-glow" />
            <div className="stage-ring stage-ring-one" />
            <div className="stage-ring stage-ring-two" />
            <div className="hero-ticket">
              <span className="ticket-kicker">VIBE / 2026</span>
              <strong>Make it<br /><span className="gradient-text">a night.</span></strong>
              <span className="ticket-line" />
              <span className="ticket-meta">Live experiences, one place</span>
            </div>
            <div className="hero-stat hero-stat-top"><strong>500+</strong><span>Events</span></div>
            <div className="hero-stat hero-stat-bottom"><strong>4</strong><span>Categories</span></div>
            <div className="hero-stamp">BOOK<br />YOUR<br />VIBE</div>
          </div>
        </div>
      </section>

      <main>
        <section id="categories" className="home-section categories-section container">
          <div className="section-heading reveal-up">
            <div>
              <p className="section-label">Explore</p>
              <h2>Choose Your Experience</h2>
            </div>
            <p>Something for every kind of entertainment lover.</p>
          </div>

          <div className="category-grid-home">
            {categories.map((category) => (
              <Link to={category.path} key={category.name} className={`category-tile ${category.className}`}>
                <span className="category-number">{category.visual}</span>
                <span className="category-mark" aria-hidden="true" />
                <div className="category-tile-content">
                  <p className="category-overline">VIBE / {category.visual}</p>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <span className="category-link">Explore <span aria-hidden="true">↗</span></span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-section trending-section container">
          <div className="section-heading reveal-up">
            <div>
              <p className="section-label">Trending now</p>
              <h2>What's Trending</h2>
            </div>
            <p>Find your next reason to go out.</p>
          </div>

          <div className="trending-grid">
            {trendingEvents.map((event) => (
              <article className={`trending-card ${event.className}`} key={event.name}>
                <div className="trending-visual">
                  <span>{event.category}</span>
                  <strong aria-hidden="true">{event.category === 'Concert' ? 'LIVE' : event.category.toUpperCase()}</strong>
                </div>
                <div className="trending-body">
                  <p className="event-details">{event.details}</p>
                  <h3>{event.name}</h3>
                  <div className="event-info"><span>{event.date}</span><span>{event.city}</span></div>
                  <div className="event-footer"><span>From <strong>{event.price}</strong></span><Link to={event.path}>View Event <span aria-hidden="true">→</span></Link></div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="concert-highlight">
          <div className="concert-highlight-pattern" />
          <div className="container concert-highlight-layout">
            <div className="concert-art" aria-label="Abstract live concert artwork">
              <span className="concert-art-word">STRAY<br />KIDS</span>
              <span className="concert-art-date">20 / 10 / 26</span>
              <span className="concert-art-line" />
            </div>
            <div className="concert-highlight-copy">
              <p className="section-label">Live music</p>
              <h2>Feel the music.<br /><span className="gradient-text">Live the moment.</span></h2>
              <p className="highlight-name">Stray Kids: The dominATE Experience</p>
              <div className="highlight-details">
                <span>Stray Kids</span><span>20 October 2026 · 7:00 PM</span><span>Jawaharlal Nehru Stadium · New Delhi</span>
              </div>
              <div className="highlight-bottom"><div><small>Starting from</small><strong>₹1500</strong></div><Link to="/concerts" className="primary-btn">Explore Concerts <span aria-hidden="true">→</span></Link></div>
            </div>
          </div>
        </section>

        <section className="home-section why-section container">
          <div className="section-heading reveal-up">
            <div>
              <p className="section-label">Why VIBE?</p>
              <h2>Everything you need for a perfect night out.</h2>
            </div>
          </div>
          <div className="feature-grid-home">
            {features.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <span>{feature.number}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="home-cta container">
          <div className="cta-glow" />
          <div className="cta-content">
            <p className="section-label">The night is yours</p>
            <h2>Your next unforgettable experience is waiting.</h2>
            <p>Choose your event. Pick your seat. Make the memory.</p>
            <Link to="/concerts" className="primary-btn">Explore Concerts <span aria-hidden="true">→</span></Link>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home
