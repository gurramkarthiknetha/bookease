import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookAPI } from '../services/api';
import BookCard from '../components/BookCard';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Home = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);

        // Fetch featured books
        const featuredRes = await bookAPI.getAllBooks({
          featured: true,
          limit: 4
        });

        // Fetch recent books
        const recentRes = await bookAPI.getAllBooks({
          sort: '-createdAt',
          limit: 8
        });

        setFeaturedBooks(featuredRes.data.books);
        setRecentBooks(recentRes.data.books);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to load books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/books?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to BookEase
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Your online library book reservation system
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for books by title, author, or genre..."
                  className="w-full px-4 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-light shadow-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-4 rounded-r-full bg-primary-dark hover:bg-primary transition-colors duration-200 flex items-center justify-center"
                >
                  <MagnifyingGlassIcon className="h-6 w-6" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Featured Books</h2>
            <Link to="/books" className="text-primary hover:text-primary-dark transition-colors duration-200 font-medium">
              View All
            </Link>
          </div>

          {error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-md shadow-sm">{error}</div>
          ) : featuredBooks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No featured books available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredBooks.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent Books Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Recently Added</h2>
            <Link to="/books" className="text-primary hover:text-primary-dark transition-colors duration-200 font-medium">
              View All
            </Link>
          </div>

          {error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-md shadow-sm">{error}</div>
          ) : recentBooks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No books available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recentBooks.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
              <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <span className="text-primary text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Books</h3>
              <p className="text-gray-600">
                Search our extensive collection by title, author, or genre to find your next read.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
              <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <span className="text-primary text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Reserve Online</h3>
              <p className="text-gray-600">
                Reserve your book with just a few clicks and pick it up at your convenience.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
              <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <span className="text-primary text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Read & Return</h3>
              <p className="text-gray-600">
                Enjoy your book and return it by the due date to avoid late fees.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
