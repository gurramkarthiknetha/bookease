const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Simple CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5174');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Middleware
app.use(express.json());

// Test route
app.get('/api/books', (req, res) => {
  const featured = req.query.featured === 'true';
  const limit = parseInt(req.query.limit) || 10;
  
  const books = [
    {
      _id: '1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      description: 'A novel about the American Dream',
      coverImage: 'https://placehold.co/300x450/e2e8f0/1e293b?text=Great+Gatsby',
      featured: true
    },
    {
      _id: '2',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      description: 'A novel about racial injustice',
      coverImage: 'https://placehold.co/300x450/e2e8f0/1e293b?text=Mockingbird',
      featured: true
    },
    {
      _id: '3',
      title: '1984',
      author: 'George Orwell',
      description: 'A dystopian novel',
      coverImage: 'https://placehold.co/300x450/e2e8f0/1e293b?text=1984',
      featured: true
    },
    {
      _id: '4',
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      description: 'A romantic novel',
      coverImage: 'https://placehold.co/300x450/e2e8f0/1e293b?text=Pride',
      featured: true
    }
  ];
  
  // Filter books if featured is true
  const filteredBooks = featured ? books.filter(book => book.featured) : books;
  
  // Limit the number of books
  const limitedBooks = filteredBooks.slice(0, limit);
  
  res.json({
    success: true,
    books: limitedBooks,
    totalPages: 1,
    currentPage: 1
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`CORS server running on port ${PORT}`);
});
