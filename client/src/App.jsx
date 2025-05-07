import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import NotificationProvider from './context/NotificationContext';
import { ToastProvider } from './components/Toast';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Books from './pages/Books';
import BookDetail from './pages/BookDetail';
import UserProfile from './pages/UserProfile';
import UserReservations from './pages/UserReservations';
import UserReviews from './pages/UserReviews';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminBooks from './pages/AdminBooks';
import BookForm from './pages/BookForm';
import AdminUsers from './pages/AdminUsers';
import AdminReservations from './pages/AdminReservations';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ToastProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-gray-50">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/books" element={<Books />} />
                  <Route path="/books/:id" element={<BookDetail />} />

                  {/* Protected Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/my-reservations" element={<UserReservations />} />
                    <Route path="/my-reviews" element={<UserReviews />} />
                  </Route>

                  {/* Admin Routes */}
                  <Route element={<ProtectedRoute requireAdmin={true} />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/books" element={<AdminBooks />} />
                    <Route path="/admin/books/new" element={<BookForm />} />
                    <Route path="/admin/books/edit/:id" element={<BookForm />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/reservations" element={<AdminReservations />} />
                  </Route>

                  {/* Catch-all Route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <footer className="bg-gray-800 text-white py-6 mt-auto">
                <div className="container mx-auto px-4">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                      <p className="text-sm">&copy; {new Date().getFullYear()} BookEase. All rights reserved.</p>
                    </div>
                    <div className="flex space-x-4">
                      <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Terms</a>
                      <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Privacy</a>
                      <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Contact</a>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </Router>
        </ToastProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
