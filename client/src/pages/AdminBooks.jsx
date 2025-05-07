import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookAPI } from '../services/api';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);

      // Build query params
      const params = {
        page: currentPage,
        limit: 10,
        sort: sortDirection === 'asc' ? sortField : `-${sortField}`
      };

      // Add search query if exists
      if (searchQuery) {
        params.q = searchQuery;
      }

      const res = await bookAPI.getAllBooks(params);
      setBooks(res.data.books);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to load books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [currentPage, sortField, sortDirection]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBooks();
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectBook = (bookId) => {
    if (selectedBooks.includes(bookId)) {
      setSelectedBooks(selectedBooks.filter(id => id !== bookId));
    } else {
      setSelectedBooks([...selectedBooks, bookId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedBooks.length === books.length) {
      setSelectedBooks([]);
    } else {
      setSelectedBooks(books.map(book => book._id));
    }
  };

  const openDeleteModal = (book) => {
    setBookToDelete(book);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setBookToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteBook = async () => {
    if (!bookToDelete) return;

    try {
      await bookAPI.deleteBook(bookToDelete._id);
      setBooks(books.filter(book => book._id !== bookToDelete._id));
      closeDeleteModal();
    } catch (err) {
      console.error('Error deleting book:', err);
      alert('Failed to delete book. Please try again.');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedBooks.length === 0 || !confirm(`Are you sure you want to delete ${selectedBooks.length} books?`)) {
      return;
    }

    try {
      // In a real app, you might want to implement a bulk delete endpoint
      // For now, we'll delete them one by one
      for (const bookId of selectedBooks) {
        await bookAPI.deleteBook(bookId);
      }

      setBooks(books.filter(book => !selectedBooks.includes(book._id)));
      setSelectedBooks([]);
    } catch (err) {
      console.error('Error deleting books:', err);
      alert('Failed to delete some books. Please try again.');
    }
  };

  if (loading && books.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container admin-container">
      <div className="admin-header">
        <div className="flex justify-between items-center">
          <h1 className="admin-title">Books Management</h1>
          <Link
            to="/admin/books/new"
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            Add New Book
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search books by title, author, or ISBN..."
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

      {/* Bulk Actions */}
      {selectedBooks.length > 0 && (
        <div className="bg-gray-100 rounded-lg p-4 mb-6 flex justify-between items-center">
          <p className="text-gray-700">
            {selectedBooks.length} {selectedBooks.length === 1 ? 'book' : 'books'} selected
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
            >
              <TrashIcon className="h-5 w-5 mr-1" />
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Books Table */}
      {error ? (
        <div className="alert alert-danger">{error}</div>
      ) : books.length === 0 ? (
        <div className="card card-body text-center">
          <p className="text-gray-500 mb-4">No books found.</p>
          <Link
            to="/admin/books/new"
            className="btn btn-primary inline-flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            Add New Book
          </Link>
        </div>
      ) : (
        <div className="admin-table-container">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={selectedBooks.length === books.length && books.length > 0}
                        onChange={handleSelectAll}
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center">
                      Title
                      {sortField === 'title' && (
                        sortDirection === 'asc' ?
                          <ArrowUpIcon className="h-4 w-4 ml-1" /> :
                          <ArrowDownIcon className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('author')}
                  >
                    <div className="flex items-center">
                      Author
                      {sortField === 'author' && (
                        sortDirection === 'asc' ?
                          <ArrowUpIcon className="h-4 w-4 ml-1" /> :
                          <ArrowDownIcon className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('availableCopies')}
                  >
                    <div className="flex items-center">
                      Available
                      {sortField === 'availableCopies' && (
                        sortDirection === 'asc' ?
                          <ArrowUpIcon className="h-4 w-4 ml-1" /> :
                          <ArrowDownIcon className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('averageRating')}
                  >
                    <div className="flex items-center">
                      Rating
                      {sortField === 'averageRating' && (
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
                {books.map((book) => (
                  <tr key={book._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={selectedBooks.includes(book._id)}
                        onChange={() => handleSelectBook(book._id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-md object-cover"
                            src={book.coverImage || 'https://placehold.co/100x150/e2e8f0/1e293b?text=No+Cover'}
                            alt={book.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{book.title}</div>
                          <div className="text-sm text-gray-500">ISBN: {book.isbn || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{book.author}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        book.availableCopies > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {book.availableCopies} / {book.totalCopies}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {book.averageRating.toFixed(1)} ({book.ratingsCount})
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <Link
                          to={`/admin/books/edit/${book._id}`}
                          className="admin-table-action edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => openDeleteModal(book)}
                          className="admin-table-action delete"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="admin-table-pagination">
              <div className="admin-table-pagination-info">
                Showing page <span className="font-medium">{currentPage}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
              </div>
              <div className="admin-table-pagination-buttons">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="btn btn-outline"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="btn btn-outline"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && bookToDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete "{bookToDelete.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBook}
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

export default AdminBooks;
