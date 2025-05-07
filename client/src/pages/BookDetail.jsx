import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookAPI, reservationAPI, reviewAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

const BookDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [reservationError, setReservationError] = useState(null);
  const [reviewFormVisible, setReviewFormVisible] = useState(false);
  
  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });
  
  // Default cover image if none provided
  const defaultCover = 'https://placehold.co/300x450/e2e8f0/1e293b?text=No+Cover';

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch book details
        const bookRes = await bookAPI.getBookById(id);
        setBook(bookRes.data.book);
        
        // Fetch book reviews
        const reviewsRes = await reviewAPI.getBookReviews(id);
        setReviews(reviewsRes.data.reviews);
      } catch (err) {
        console.error('Error fetching book details:', err);
        setError('Failed to load book details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleReservation = async () => {
    if (!isAuthenticated) {
      return;
    }
    
    try {
      setReservationError(null);
      
      // Calculate due date (14 days from now)
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);
      
      await reservationAPI.createReservation({
        bookId: id,
        dueDate: dueDate.toISOString()
      });
      
      setReservationSuccess(true);
      
      // Refresh book details to update availability
      const bookRes = await bookAPI.getBookById(id);
      setBook(bookRes.data.book);
    } catch (err) {
      console.error('Error creating reservation:', err);
      setReservationError(
        err.response?.data?.message || 'Failed to reserve book. Please try again.'
      );
    }
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm({
      ...reviewForm,
      [name]: value
    });
  };

  const handleRatingChange = (rating) => {
    setReviewForm({
      ...reviewForm,
      rating
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await reviewAPI.createReview({
        bookId: id,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      
      // Refresh reviews
      const reviewsRes = await reviewAPI.getBookReviews(id);
      setReviews(reviewsRes.data.reviews);
      
      // Refresh book to update rating
      const bookRes = await bookAPI.getBookById(id);
      setBook(bookRes.data.book);
      
      // Reset form
      setReviewForm({ rating: 5, comment: '' });
      setReviewFormVisible(false);
    } catch (err) {
      console.error('Error submitting review:', err);
      alert(err.response?.data?.message || 'Failed to submit review. Please try again.');
    }
  };

  // Generate star rating display
  const renderStars = (rating, interactive = false) => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      if (interactive) {
        stars.push(
          <button
            key={i}
            type="button"
            onClick={() => handleRatingChange(i)}
            className="focus:outline-none"
          >
            {i <= reviewForm.rating ? (
              <StarIcon className="h-6 w-6 text-yellow-400" />
            ) : (
              <StarOutlineIcon className="h-6 w-6 text-yellow-400" />
            )}
          </button>
        );
      } else {
        stars.push(
          i <= rating ? (
            <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
          ) : (
            <StarOutlineIcon key={i} className="h-5 w-5 text-yellow-400" />
          )
        );
      }
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error || 'Book not found'}
        </div>
        <div className="mt-4">
          <Link to="/books" className="text-blue-600 hover:text-blue-800">
            ← Back to Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4">
        <Link to="/books" className="text-blue-600 hover:text-blue-800 flex items-center">
          ← Back to Books
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Book Cover */}
          <div className="md:w-1/3 p-6 flex justify-center">
            <img
              src={book.coverImage || defaultCover}
              alt={book.title}
              className="w-full max-w-xs object-cover rounded-md shadow-md"
            />
          </div>
          
          {/* Book Details */}
          <div className="md:w-2/3 p-6">
            <div className="flex flex-wrap justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                book.availabilityStatus === 'Available' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {book.availabilityStatus}
              </div>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="flex mr-2">
                {renderStars(book.averageRating)}
              </div>
              <span className="text-gray-600">
                {book.averageRating.toFixed(1)} ({book.ratingsCount} {book.ratingsCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
              <p className="text-gray-700">
                {book.description || 'No description available.'}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Details</h2>
                <ul className="text-gray-700">
                  <li><span className="font-medium">ISBN:</span> {book.isbn || 'N/A'}</li>
                  <li><span className="font-medium">Published:</span> {book.publishedYear || 'N/A'}</li>
                  <li><span className="font-medium">Publisher:</span> {book.publisher || 'N/A'}</li>
                  <li><span className="font-medium">Language:</span> {book.language || 'N/A'}</li>
                  <li><span className="font-medium">Pages:</span> {book.pages || 'N/A'}</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Availability</h2>
                <ul className="text-gray-700">
                  <li><span className="font-medium">Available Copies:</span> {book.availableCopies}</li>
                  <li><span className="font-medium">Total Copies:</span> {book.totalCopies}</li>
                  {book.location && (
                    <li>
                      <span className="font-medium">Location:</span> {book.location.section}, Shelf {book.location.shelf}
                    </li>
                  )}
                </ul>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {book.genre.map((g, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {g}
                </span>
              ))}
            </div>
            
            {/* Reservation Button */}
            {isAuthenticated ? (
              <div>
                <button
                  onClick={handleReservation}
                  disabled={book.availabilityStatus !== 'Available' || reservationSuccess}
                  className={`px-6 py-2 rounded-md text-white font-medium ${
                    book.availabilityStatus === 'Available' && !reservationSuccess
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {reservationSuccess ? 'Reserved Successfully' : 'Reserve Book'}
                </button>
                
                {reservationError && (
                  <p className="text-red-600 mt-2">{reservationError}</p>
                )}
                
                {reservationSuccess && (
                  <p className="text-green-600 mt-2">
                    Book reserved successfully! Check your reservations for details.
                  </p>
                )}
              </div>
            ) : (
              <div>
                <Link
                  to="/login"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Login to Reserve
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Reviews ({reviews.length})
          </h2>
          
          {isAuthenticated && !reviewFormVisible && (
            <button
              onClick={() => setReviewFormVisible(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Write a Review
            </button>
          )}
        </div>
        
        {/* Review Form */}
        {isAuthenticated && reviewFormVisible && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
            
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Rating</label>
                <div className="flex">
                  {renderStars(0, true)}
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="comment" className="block text-gray-700 mb-2">
                  Review
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  rows="4"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Share your thoughts about this book..."
                  value={reviewForm.comment}
                  onChange={handleReviewChange}
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setReviewFormVisible(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500">No reviews yet. Be the first to review this book!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                      {review.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{review.user.name}</h4>
                      <p className="text-gray-500 text-sm">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetail;
