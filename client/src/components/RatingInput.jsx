import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

const RatingInput = ({ 
  initialRating = 0, 
  onChange, 
  size = 'medium',
  readOnly = false,
  showValue = false
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  // Determine star size
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-8 w-8'
  };

  const starClass = sizeClasses[size] || sizeClasses.medium;

  const handleClick = (value) => {
    if (readOnly) return;
    
    // Toggle between 0 and value if clicking the same star
    const newRating = rating === value ? 0 : value;
    setRating(newRating);
    
    if (onChange) {
      onChange(newRating);
    }
  };

  const handleMouseEnter = (value) => {
    if (readOnly) return;
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };

  // Render stars
  const renderStars = () => {
    const stars = [];
    const activeRating = hoverRating || rating;

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => handleClick(i)}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
          className={`focus:outline-none ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
          disabled={readOnly}
        >
          {i <= activeRating ? (
            <StarIcon className={`${starClass} text-yellow-400`} />
          ) : (
            <StarOutlineIcon className={`${starClass} text-yellow-400`} />
          )}
        </button>
      );
    }

    return stars;
  };

  return (
    <div className="flex items-center">
      <div className="flex">{renderStars()}</div>
      {showValue && (
        <span className="ml-2 text-gray-600">
          {rating > 0 ? rating.toFixed(1) : '0.0'}
        </span>
      )}
    </div>
  );
};

export default RatingInput;
