import React from 'react';

const StarRating = ({ rating }) => {
  const stars = [];

  for (let i = 1; i <= rating; i++) {
    stars.push(
      <span key={i} style={{ color: 'white' }}>
        ★
      </span>
    );
  }

  return (
    <div>
      {stars}
      {/* <span> ({rating})</span> */}
    </div>
  );
};

export default StarRating;
