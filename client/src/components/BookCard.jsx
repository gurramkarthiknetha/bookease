import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

const BookCard = ({ book }) => {
  const {
    _id,
    title,
    author,
    coverImage,
    averageRating,
    genre,
    availableCopies,
    availabilityStatus
  } = book;

  // Determine availability status if the virtual property is not available
  const status = availabilityStatus || (availableCopies > 0 ? 'Available' : 'Unavailable');

  // Default cover image if none provided
  const defaultCover = 'https://placehold.co/200x300/e2e8f0/1e293b?text=No+Cover';

  // Generate star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
        );
      } else {
        stars.push(
          <StarOutlineIcon key={i} className="h-4 w-4 text-yellow-400" />
        );
      }
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-card overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 h-full flex flex-col">
      <Link to={`/books/${_id}`} className="flex flex-col h-full">
        <div className="relative h-48 overflow-hidden">
          <img
            src={coverImage || defaultCover}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded-full ${
            status === 'Available'
              ? 'bg-success text-white'
              : 'bg-danger text-white'
          }`}>
            {status}
          </div>
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 truncate">{title}</h3>
          <p className="text-sm text-gray-600 mb-2">{author}</p>

          <div className="flex items-center mb-2">
            <div className="flex mr-1">
              {renderStars(averageRating || 0)}
            </div>
            <span className="text-xs text-gray-500">({(averageRating || 0).toFixed(1)})</span>
          </div>

          <div className="flex flex-wrap gap-1 mt-auto">
            {(genre || []).slice(0, 2).map((g, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-blue-100 text-primary-dark rounded-full"
              >
                {g}
              </span>
            ))}
            {genre && genre.length > 2 && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                +{genre.length - 2}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BookCard;
