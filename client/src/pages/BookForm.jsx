import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bookAPI } from '../services/api';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

const BookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    genre: [],
    publishedYear: '',
    publisher: '',
    language: '',
    pages: '',
    coverImage: '',
    availableCopies: 1,
    totalCopies: 1,
    location: {
      shelf: '',
      section: ''
    },
    featured: false
  });
  
  // Available genres for selection
  const availableGenres = [
    'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 
    'Mystery', 'Thriller', 'Romance', 'Biography', 
    'History', 'Science', 'Technology', 'Self-Help',
    'Poetry', 'Drama', 'Adventure', 'Horror',
    'Children', 'Young Adult', 'Classics', 'Comics',
    'Cooking', 'Art', 'Travel', 'Religion',
    'Philosophy', 'Psychology', 'Business', 'Economics'
  ];
  
  // New genre input
  const [newGenre, setNewGenre] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const fetchBook = async () => {
        try {
          setLoading(true);
          const res = await bookAPI.getBookById(id);
          
          // Format the data for the form
          const book = res.data.book;
          setFormData({
            ...book,
            publishedYear: book.publishedYear || '',
            pages: book.pages || '',
            location: {
              shelf: book.location?.shelf || '',
              section: book.location?.section || ''
            }
          });
        } catch (err) {
          console.error('Error fetching book:', err);
          setError('Failed to load book details. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchBook();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [locationField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === '' ? '' : parseInt(value, 10)
    });
  };

  const handleGenreSelect = (genre) => {
    if (formData.genre.includes(genre)) {
      setFormData({
        ...formData,
        genre: formData.genre.filter(g => g !== genre)
      });
    } else {
      setFormData({
        ...formData,
        genre: [...formData.genre, genre]
      });
    }
  };

  const handleAddNewGenre = () => {
    if (newGenre.trim() && !formData.genre.includes(newGenre.trim())) {
      setFormData({
        ...formData,
        genre: [...formData.genre, newGenre.trim()]
      });
      setNewGenre('');
    }
  };

  const handleRemoveGenre = (genre) => {
    setFormData({
      ...formData,
      genre: formData.genre.filter(g => g !== genre)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validate form
      if (!formData.title || !formData.author) {
        setError('Title and author are required');
        setLoading(false);
        return;
      }
      
      if (formData.genre.length === 0) {
        setError('At least one genre is required');
        setLoading(false);
        return;
      }
      
      // Format data for API
      const bookData = {
        ...formData,
        availableCopies: parseInt(formData.availableCopies, 10),
        totalCopies: parseInt(formData.totalCopies, 10),
        publishedYear: formData.publishedYear ? parseInt(formData.publishedYear, 10) : undefined,
        pages: formData.pages ? parseInt(formData.pages, 10) : undefined
      };
      
      if (isEditMode) {
        await bookAPI.updateBook(id, bookData);
      } else {
        await bookAPI.createBook(bookData);
      }
      
      navigate('/admin/books');
    } catch (err) {
      console.error('Error saving book:', err);
      setError(err.response?.data?.message || 'Failed to save book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/admin/books" className="text-blue-600 hover:text-blue-800">
          ← Back to Books
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Book' : 'Add New Book'}
          </h1>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="author" className="block text-gray-700 font-medium mb-2">
                  Author *
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="isbn" className="block text-gray-700 font-medium mb-2">
                  ISBN
                </label>
                <input
                  type="text"
                  id="isbn"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Genres *
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.genre.map((genre) => (
                    <div 
                      key={genre} 
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
                    >
                      <span>{genre}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveGenre(genre)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Add custom genre"
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddNewGenre}
                    className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Common genres:</p>
                  <div className="flex flex-wrap gap-2">
                    {availableGenres.map((genre) => (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => handleGenreSelect(genre)}
                        className={`px-2 py-1 text-xs rounded-full ${
                          formData.genre.includes(genre)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column */}
            <div>
              <div className="mb-4">
                <label htmlFor="coverImage" className="block text-gray-700 font-medium mb-2">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  id="coverImage"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {formData.coverImage && (
                  <div className="mt-2">
                    <img 
                      src={formData.coverImage} 
                      alt="Book cover preview" 
                      className="h-40 object-cover rounded-md"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/200x300/e2e8f0/1e293b?text=Invalid+URL';
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label htmlFor="publishedYear" className="block text-gray-700 font-medium mb-2">
                    Published Year
                  </label>
                  <input
                    type="number"
                    id="publishedYear"
                    name="publishedYear"
                    value={formData.publishedYear}
                    onChange={handleNumberChange}
                    min="1000"
                    max={new Date().getFullYear()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="pages" className="block text-gray-700 font-medium mb-2">
                    Pages
                  </label>
                  <input
                    type="number"
                    id="pages"
                    name="pages"
                    value={formData.pages}
                    onChange={handleNumberChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label htmlFor="publisher" className="block text-gray-700 font-medium mb-2">
                    Publisher
                  </label>
                  <input
                    type="text"
                    id="publisher"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="language" className="block text-gray-700 font-medium mb-2">
                    Language
                  </label>
                  <input
                    type="text"
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label htmlFor="availableCopies" className="block text-gray-700 font-medium mb-2">
                    Available Copies *
                  </label>
                  <input
                    type="number"
                    id="availableCopies"
                    name="availableCopies"
                    value={formData.availableCopies}
                    onChange={handleNumberChange}
                    min="0"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="totalCopies" className="block text-gray-700 font-medium mb-2">
                    Total Copies *
                  </label>
                  <input
                    type="number"
                    id="totalCopies"
                    name="totalCopies"
                    value={formData.totalCopies}
                    onChange={handleNumberChange}
                    min="1"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label htmlFor="location.section" className="block text-gray-700 font-medium mb-2">
                    Section
                  </label>
                  <input
                    type="text"
                    id="location.section"
                    name="location.section"
                    value={formData.location.section}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="location.shelf" className="block text-gray-700 font-medium mb-2">
                    Shelf
                  </label>
                  <input
                    type="text"
                    id="location.shelf"
                    name="location.shelf"
                    value={formData.location.shelf}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-gray-700">
                    Featured Book (will be displayed on homepage)
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Link
              to="/admin/books"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 mr-2"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? 'Saving...' : isEditMode ? 'Update Book' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;
