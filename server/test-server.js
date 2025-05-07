const express = require('express');
const cors = require('cors');

// Create Express app
const app = express();

// CORS Configuration
const corsOptions = {
  origin: ['http://localhost:5174', 'http://127.0.0.1:5174'], // Your frontend origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow cookies and authentication headers
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Enable CORS for all routes
app.use(cors(corsOptions));

// Test route
app.get('/api/books', (req, res) => {
  res.json({
    success: true,
    books: [
      {
        _id: '1',
        title: 'Test Book 1',
        author: 'Test Author 1',
        description: 'Test Description 1',
        coverImage: 'https://placehold.co/300x450/e2e8f0/1e293b?text=Test+Book+1'
      },
      {
        _id: '2',
        title: 'Test Book 2',
        author: 'Test Author 2',
        description: 'Test Description 2',
        coverImage: 'https://placehold.co/300x450/e2e8f0/1e293b?text=Test+Book+2'
      }
    ],
    totalPages: 1,
    currentPage: 1
  });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
