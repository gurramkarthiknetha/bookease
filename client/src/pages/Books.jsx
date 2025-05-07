import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bookAPI } from '../services/api';
import BookCard from '../components/BookCard';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  // Get search query from URL
  const searchQuery = searchParams.get('q') || '';
  const genre = searchParams.get('genre') || '';
  
  // Filter states
  const [filters, setFilters] = useState({
    q: searchQuery,
    genre: genre,
    sort: searchParams.get('sort') || '-createdAt'
  });

  // Available genres for filter
  const genres = [
    'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 
    'Mystery', 'Thriller', 'Romance', 'Biography', 
    'History', 'Science', 'Technology', 'Self-Help'
  ];

  // Sort options
  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: '-averageRating', label: 'Highest Rated' },
    { value: 'title', label: 'Title (A-Z)' },
    { value: '-title', label: 'Title (Z-A)' },
    { value: 'author', label: 'Author (A-Z)' },
    { value: '-author', label: 'Author (Z-A)' }
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        
        // Build query params
        const params = { ...filters, page: currentPage, limit: 12 };
        
        // Remove empty params
        Object.keys(params).forEach(key => 
          !params[key] && delete params[key]
        );
        
        const res = await bookAPI.getAllBooks(params);
        setBooks(res.data.books);
        setTotalPages(res.data.totalPages);
        setCurrentPage(res.data.currentPage);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to load books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [filters, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Update filters and reset page
    setFilters({ ...filters, q: filters.q });
    setCurrentPage(1);
    
    // Update URL params
    const newParams = new URLSearchParams();
    if (filters.q) newParams.set('q', filters.q);
    if (filters.genre) newParams.set('genre', filters.genre);
    if (filters.sort) newParams.set('sort', filters.sort);
    
    setSearchParams(newParams);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleGenreSelect = (selectedGenre) => {
    setFilters({ 
      ...filters, 
      genre: filters.genre === selectedGenre ? '' : selectedGenre 
    });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ q: '', genre: '', sort: '-createdAt' });
    setSearchParams({});
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Generate pagination
  const renderPagination = () => {
    const pages = [];
    
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || 
        i === totalPages || 
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-1 mx-1 rounded ${
              currentPage === i
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {i}
          </button>
        );
      } else if (
        i === currentPage - 2 || 
        i === currentPage + 2
      ) {
        pages.push(
          <span key={i} className="px-2">
            ...
          </span>
        );
      }
    }
    
    return pages;
  };

  if (loading && books.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
          {searchQuery ? `Search Results: "${searchQuery}"` : 'Browse Books'}
        </h1>
        
        <div className="flex items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md mr-2"
          >
            <FunnelIcon className="h-5 w-5 mr-1" />
            Filters
          </button>
          
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search books..."
              className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.q || ''}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-4 rounded-md shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genre
              </label>
              <div className="flex flex-wrap gap-2">
                {genres.map((g) => (
                  <button
                    key={g}
                    onClick={() => handleGenreSelect(g)}
                    className={`px-3 py-1 text-sm rounded-full ${
                      filters.genre === g
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                id="sort"
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
      
      {/* Results */}
      {error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
      ) : books.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-md shadow">
          <p className="text-gray-500 text-lg mb-4">No books found.</p>
          <p className="text-gray-400">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 mx-1 rounded bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {renderPagination()}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 mx-1 rounded bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Books;
