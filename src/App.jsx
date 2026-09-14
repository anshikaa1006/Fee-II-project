import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Concerts from './pages/Concerts'
import ConcertDetails from './pages/ConcertDetails'
import Home from './pages/Home'
import BookingSummary from './pages/BookingSummary'
import Confirmation from './pages/Confirmation'
import Login from './pages/Login'
import Payment from './pages/Payment'
import MyTickets from './pages/MyTickets'
import RoutePlaceholder from './pages/RoutePlaceholder'
import SeatSelection from './pages/SeatSelection'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<RoutePlaceholder title="Movies" />} />
            <Route path="/concerts" element={<Concerts />} />
            <Route path="/concerts/:id" element={<ConcertDetails />} />
            <Route path="/sports" element={<RoutePlaceholder title="Sports" />} />
            <Route path="/comedy" element={<RoutePlaceholder title="Comedy & Theatre" />} />
            <Route path="/seats/:id" element={<SeatSelection />} />
            <Route path="/booking-summary" element={<BookingSummary />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/my-tickets" element={<MyTickets />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<RoutePlaceholder title="Page Not Found" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
