import React from 'react';

const Seat = ({ seat, isSelected, onToggle, currentUserId }) => {
  const { seatNumber, status, lockedBy } = seat;

  // Determine effective status
  let seatState = 'available';
  let isClickable = true;

  if (status === 'BOOKED') {
    seatState = 'booked';
    isClickable = false;
  } else if (status === 'HELD') {
    // If held by someone else, not clickable
    const heldByMe = lockedBy && currentUserId && (lockedBy === currentUserId || lockedBy._id === currentUserId);
    if (!heldByMe) {
      seatState = 'held';
      isClickable = false;
    } else {
      seatState = 'selected';
    }
  } else if (isSelected) {
    seatState = 'selected';
  }

  const handleClick = () => {
    if (!isClickable) return;
    onToggle(seatNumber);
  };

  return (
    <button
      type="button"
      className={`seat-button ${seatState}`}
      onClick={handleClick}
      disabled={!isClickable}
      title={`Seat ${seatNumber} - ${seatState.toUpperCase()}`}
      aria-label={`Seat ${seatNumber} ${seatState}`}
    >
      {seatNumber}
    </button>
  );
};

export default Seat;
