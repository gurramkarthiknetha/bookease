import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reservationAPI } from '../services/api';
import {
  MagnifyingGlassIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortField, setSortField] = useState('reservationDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [reservationToUpdate, setReservationToUpdate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await reservationAPI.getAllReservations();
      setReservations(res.data.reservations);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError('Failed to load reservations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Filter reservations based on active tab and search query
  const filteredReservations = reservations.filter((res) => {
    // Filter by status tab
    if (activeTab !== 'all' && res.status !== activeTab) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        res.user.name.toLowerCase().includes(query) ||
        res.user.email.toLowerCase().includes(query) ||
        res.book.title.toLowerCase().includes(query) ||
        res.book.author.toLowerCase().includes(query) ||
        (res.book.isbn && res.book.isbn.toLowerCase().includes(query))
      );
    }

    return true;
  });

  // Sort reservations
  const sortedReservations = [...filteredReservations].sort((a, b) => {
    let aValue, bValue;

    // Handle nested fields
    if (sortField === 'user.name') {
      aValue = a.user.name;
      bValue = b.user.name;
    } else if (sortField === 'book.title') {
      aValue = a.book.title;
      bValue = b.book.title;
    } else {
      aValue = a[sortField];
      bValue = b[sortField];
    }

    // Handle date fields
    if (sortField === 'reservationDate' || sortField === 'dueDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    // Handle string fields
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const openStatusModal = (reservation) => {
    setReservationToUpdate(reservation);
    setSelectedStatus(reservation.status);
    setIsStatusModalOpen(true);
  };

  const closeStatusModal = () => {
    setReservationToUpdate(null);
    setSelectedStatus('');
    setIsStatusModalOpen(false);
  };

  const handleUpdateStatus = async () => {
    if (!reservationToUpdate || !selectedStatus) return;

    try {
      await reservationAPI.updateReservationStatus(reservationToUpdate._id, { status: selectedStatus });

      // Update local state
      setReservations(reservations.map(res =>
        res._id === reservationToUpdate._id ? { ...res, status: selectedStatus } : res
      ));

      closeStatusModal();
    } catch (err) {
      console.error('Error updating reservation status:', err);
      alert('Failed to update reservation status. Please try again.');
    }
  };

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

  if (loading && reservations.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Reservations Management</h1>
        <p className="admin-subtitle">
          Manage book reservations and track their status
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by user, book title, or ISBN..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>
        </form>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Reservations
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pending'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'active'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab('overdue')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overdue'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overdue
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

      {/* Reservations Table */}
      {error ? (
        <div className="alert alert-danger">{error}</div>
      ) : sortedReservations.length === 0 ? (
        <div className="card card-body text-center">
          <p className="text-gray-500">No reservations found.</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('user.name')}
                  >
                    <div className="flex items-center">
                      User
                      {sortField === 'user.name' && (
                        sortDirection === 'asc' ?
                          <ArrowUpIcon className="h-4 w-4 ml-1" /> :
                          <ArrowDownIcon className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('book.title')}
                  >
                    <div className="flex items-center">
                      Book
                      {sortField === 'book.title' && (
                        sortDirection === 'asc' ?
                          <ArrowUpIcon className="h-4 w-4 ml-1" /> :
                          <ArrowDownIcon className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      {sortField === 'status' && (
                        sortDirection === 'asc' ?
                          <ArrowUpIcon className="h-4 w-4 ml-1" /> :
                          <ArrowDownIcon className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('reservationDate')}
                  >
                    <div className="flex items-center">
                      Reserved On
                      {sortField === 'reservationDate' && (
                        sortDirection === 'asc' ?
                          <ArrowUpIcon className="h-4 w-4 ml-1" /> :
                          <ArrowDownIcon className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('dueDate')}
                  >
                    <div className="flex items-center">
                      Due Date
                      {sortField === 'dueDate' && (
                        sortDirection === 'asc' ?
                          <ArrowUpIcon className="h-4 w-4 ml-1" /> :
                          <ArrowDownIcon className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedReservations.map((reservation) => (
                  <tr key={reservation._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                          {reservation.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{reservation.user.name}</div>
                          <div className="text-sm text-gray-500">{reservation.user.email}</div>
                        </div>
                      </div>
                    </td>
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
                    <td>
                      <div className="admin-table-actions">
                        <button
                          onClick={() => openStatusModal(reservation)}
                          className="admin-table-action edit"
                        >
                          Update Status
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {isStatusModalOpen && reservationToUpdate && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Update Reservation Status</h3>
            <p className="text-gray-500 mb-4">
              Update the status for the reservation of "{reservationToUpdate.book.title}" by {reservationToUpdate.user.name}.
            </p>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={closeStatusModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReservations;
