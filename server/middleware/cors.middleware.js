/**
 * Custom CORS middleware to handle cross-origin requests
 */
const corsMiddleware = (req, res, next) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  // For debugging - allow requests from all origins
  // res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
};

module.exports = corsMiddleware;
