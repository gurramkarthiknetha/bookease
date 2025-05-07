import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import {
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userAPI.getAllUsers();

      // Sort users
      const sortedUsers = [...res.data.users].sort((a, b) => {
        const aValue = a[sortField] || '';
        const bValue = b[sortField] || '';

        if (sortDirection === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      });

      setUsers(sortedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [sortField, sortDirection]);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      fetchUsers();
      return;
    }

    // Filter users locally based on search query
    const filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.studentId && user.studentId.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    setUsers(filteredUsers);
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setUserToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await userAPI.deleteUser(userToDelete._id);
      setUsers(users.filter(user => user._id !== userToDelete._id));
      closeDeleteModal();
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user. Please try again.');
    }
  };

  const openRoleModal = (user) => {
    setUserToEdit(user);
    setSelectedRole(user.role);
    setIsRoleModalOpen(true);
  };

  const closeRoleModal = () => {
    setUserToEdit(null);
    setSelectedRole('');
    setIsRoleModalOpen(false);
  };

  const handleUpdateRole = async () => {
    if (!userToEdit || !selectedRole) return;

    try {
      await userAPI.updateUserRole(userToEdit._id, { role: selectedRole });

      // Update local state
      setUsers(users.map(user =>
        user._id === userToEdit._id ? { ...user, role: selectedRole } : user
      ));

      closeRoleModal();
    } catch (err) {
      console.error('Error updating user role:', err);
      alert('Failed to update user role. Please try again.');
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Users Management</h1>
        <p className="admin-subtitle">
          Manage user accounts and permissions
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search users by name, email, or student ID..."
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

      {/* Users Table */}
      {error ? (
        <div className="alert alert-danger">{error}</div>
      ) : users.length === 0 ? (
        <div className="card card-body text-center">
          <p className="text-gray-500">No users found.</p>
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
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Name
                      {sortField === 'name' && (
                        sortDirection === 'asc' ?
                          <ArrowUpIcon className="h-4 w-4 ml-1" /> :
                          <ArrowDownIcon className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center">
                      Email
                      {sortField === 'email' && (
                        sortDirection === 'asc' ?
                          <ArrowUpIcon className="h-4 w-4 ml-1" /> :
                          <ArrowDownIcon className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('studentId')}
                  >
                    <div className="flex items-center">
                      Student ID
                      {sortField === 'studentId' && (
                        sortDirection === 'asc' ?
                          <ArrowUpIcon className="h-4 w-4 ml-1" /> :
                          <ArrowDownIcon className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('role')}
                  >
                    <div className="flex items-center">
                      Role
                      {sortField === 'role' && (
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
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.studentId || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <button
                          onClick={() => openRoleModal(user)}
                          className="admin-table-action edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(user)}
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
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete the user "{userToDelete.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {isRoleModalOpen && userToEdit && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Change User Role</h3>
            <p className="text-gray-500 mb-4">
              Update the role for user "{userToEdit.name}".
            </p>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={closeRoleModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRole}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
