import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UsersIcon,
  BookOpenIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    activeReservations: 0,
    overdue: 0
  });

  // Navigation items for admin panel
  const navItems = [
    {
      name: 'Users Management',
      description: 'Manage user accounts and permissions',
      icon: UsersIcon,
      href: '/admin/users',
      color: 'bg-blue-500'
    },
    {
      name: 'Books Management',
      description: 'Add, edit, and remove books from the library',
      icon: BookOpenIcon,
      href: '/admin/books',
      color: 'bg-green-500'
    },
    {
      name: 'Reservations',
      description: 'Manage active and pending reservations',
      icon: ClockIcon,
      href: '/admin/reservations',
      color: 'bg-purple-500'
    },
    {
      name: 'Reports',
      description: 'View statistics and generate reports',
      icon: ChartBarIcon,
      href: '/admin/reports',
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="container admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Admin Dashboard</h1>
        <p className="admin-subtitle">
          Manage your library system from one central location
        </p>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <div className="admin-stat-icon blue">
              <UsersIcon />
            </div>
            <div className="admin-stat-info">
              <p className="admin-stat-label">Total Users</p>
              <p className="admin-stat-value">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <div className="admin-stat-icon green">
              <BookOpenIcon />
            </div>
            <div className="admin-stat-info">
              <p className="admin-stat-label">Total Books</p>
              <p className="admin-stat-value">{stats.totalBooks}</p>
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <div className="admin-stat-icon purple">
              <ClockIcon />
            </div>
            <div className="admin-stat-info">
              <p className="admin-stat-label">Active Reservations</p>
              <p className="admin-stat-value">{stats.activeReservations}</p>
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <div className="admin-stat-icon red">
              <ClockIcon />
            </div>
            <div className="admin-stat-info">
              <p className="admin-stat-label">Overdue</p>
              <p className="admin-stat-value">{stats.overdue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Navigation Cards */}
      <div className="admin-nav-cards">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="admin-nav-card"
          >
            <div className="admin-nav-content">
              <div className={`admin-nav-icon ${item.color === 'bg-blue-500' ? 'blue' :
                              item.color === 'bg-green-500' ? 'green' :
                              item.color === 'bg-purple-500' ? 'purple' : 'yellow'}`}>
                <item.icon />
              </div>
              <div className="admin-nav-info">
                <h3 className="admin-nav-title">{item.name}</h3>
                <p className="admin-nav-description">{item.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="admin-quick-actions">
        <h2 className="admin-quick-actions-title">Quick Actions</h2>
        <div className="admin-quick-actions-buttons">
          <Link
            to="/admin/books/new"
            className="btn btn-primary"
          >
            Add New Book
          </Link>
          <Link
            to="/admin/users/new"
            className="btn btn-secondary"
          >
            Add New User
          </Link>
          <Link
            to="/admin/reservations"
            className="btn btn-primary"
          >
            Manage Reservations
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
