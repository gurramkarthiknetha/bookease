import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reservationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const UserReservations = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const res = await reservationAPI.getUserReservations();
        setReservations(res.data.reservations);
      } catch (err) {
        console.error('Error fetching reservations:', err);
        setError('Failed to load reservations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleCancelReservation = async (id) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }
    
    try {
      await reservationAPI.updateReservationStatus(id, 'cancelled');
      
      // Update local state
      setReservations(
        reservations.map((res) =>
          res._id === id ? { ...res, status: 'cancelled' } : res
        )
      );
    } catch (err) {
      console.error('Error cancelling reservation:', err);
      alert('Failed to cancel reservation. Please try again.');
    }
  };

  // Filter reservations based on active tab
  const filteredReservations = reservations.filter((res) => {
    if (activeTab === 'active') {
      return res.status === 'active' || res.status === 'pending';
    } else if (activeTab === 'completed') {
      return res.status === 'completed';
    } else if (activeTab === 'cancelled') {
      return res.status === 'cancelled';
    }
    return true;
  });

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Reservations</h1>
      
      {error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
      ) : (
        <>
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('active')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'active'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Active & Pending
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'completed'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setActiveTab('cancelled')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'cancelled'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Cancelled
              </button>
            </nav>
          </div>
          
          {filteredReservations.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500 mb-4">No {activeTab} reservations found.</p>
              <Link
                to="/books"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Browse Books
              </Link>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Book
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reservation Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReservations.map((reservation) => (
                    <tr key={reservation._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-md object-cover"
                              src={reservation.book.coverImage || 'https://placehold.co/100x150/e2e8f0/1e293b?text=No+Cover'}
                              alt={reservation.book.title}
                            />
                          </div>
                          <div className="ml-4">
                            <Link
                              to={`/books/${reservation.book._id}`}
                              className="text-sm font-medium text-gray-900 hover:text-blue-600"
                            >
                              {reservation.book.title}
                            </Link>
                            <div className="text-sm text-gray-500">
                              {reservation.book.author}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(reservation.status)}`}>
                          {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(reservation.reservationDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(reservation.dueDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {(reservation.status === 'pending' || reservation.status === 'active') && (
                          <button
                            onClick={() => handleCancelReservation(reservation._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Cancel
                          </button>
                        )}
                        {reservation.status === 'completed' && (
                          <Link
                            to={`/books/${reservation.book._id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Review
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserReservations;
