function Seat({ seatId, status, onClick }) {
  const isBooked = status === 'booked'

  return (
    <button
      type="button"
      className={`seat-button seat-${status}`}
      onClick={() => onClick(seatId)}
      disabled={isBooked}
      aria-label={`${seatId}, ${status} seat`}
      aria-pressed={status === 'selected'}
    >
      {seatId}
    </button>
  )
}

export default Seat
