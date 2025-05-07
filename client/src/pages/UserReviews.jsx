import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reviewAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const UserReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState(null);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await reviewAPI.getUserReviews();
        setReviews(res.data.reviews);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

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
            {i <= editForm.rating ? (
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

  const openEditModal = (review) => {
    setReviewToEdit(review);
    setEditForm({
      rating: review.rating,
      comment: review.comment
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setReviewToEdit(null);
    setIsEditModalOpen(false);
  };

  const handleRatingChange = (rating) => {
    setEditForm({
      ...editForm,
      rating
    });
  };

  const handleCommentChange = (e) => {
    setEditForm({
      ...editForm,
      comment: e.target.value
    });
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    
    if (!reviewToEdit) return;
    
    try {
      await reviewAPI.updateReview(reviewToEdit._id, editForm);
      
      // Update local state
      setReviews(reviews.map(review => 
        review._id === reviewToEdit._id 
          ? { ...review, ...editForm } 
          : review
      ));
      
      closeEditModal();
    } catch (err) {
      console.error('Error updating review:', err);
      alert('Failed to update review. Please try again.');
    }
  };

  const openDeleteModal = (review) => {
    setReviewToDelete(review);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setReviewToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteReview = async () => {
    if (!reviewToDelete) return;
    
    try {
      await reviewAPI.deleteReview(reviewToDelete._id);
      
      // Update local state
      setReviews(reviews.filter(review => review._id !== reviewToDelete._id));
      
      closeDeleteModal();
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Failed to delete review. Please try again.');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Reviews</h1>
      
      {error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500 mb-4">You haven't written any reviews yet.</p>
          <Link
            to="/books"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className="h-12 w-12 flex-shrink-0">
                      <img
                        className="h-12 w-12 rounded-md object-cover"
                        src={review.book.coverImage || 'https://placehold.co/100x150/e2e8f0/1e293b?text=No+Cover'}
                        alt={review.book.title}
                      />
                    </div>
                    <div className="ml-4">
                      <Link
                        to={`/books/${review.book._id}`}
                        className="text-lg font-medium text-gray-900 hover:text-blue-600"
                      >
                        {review.book.title}
                      </Link>
                      <p className="text-sm text-gray-500">
                        by {review.book.author}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex mr-2">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-gray-600">{review.rating}.0</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-gray-700">{review.comment}</p>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Reviewed on {formatDate(review.createdAt)}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(review)}
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(review)}
                      className="text-red-600 hover:text-red-800 flex items-center"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Review Modal */}
      {isEditModalOpen && reviewToEdit && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Review</h3>
            
            <form onSubmit={handleUpdateReview}>
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
                  rows="4"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Share your thoughts about this book..."
                  value={editForm.comment}
                  onChange={handleCommentChange}
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && reviewToDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete your review for "{reviewToDelete.book.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteReview}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserReviews;
