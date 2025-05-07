import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { user, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    studentId: user?.studentId || '',
    profilePicture: user?.profilePicture || ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      await updateProfile(formData);
      
      setSuccess(true);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(
        err.response?.data?.message || 'Failed to update profile. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              Profile updated successfully!
            </div>
          )}
          
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 mb-6 md:mb-0 flex flex-col items-center">
              <div className="h-32 w-32 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl mb-4">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              )}
            </div>
            
            <div className="md:w-2/3">
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="studentId" className="block text-gray-700 font-medium mb-2">
                      Student ID
                    </label>
                    <input
                      type="text"
                      id="studentId"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="profilePicture" className="block text-gray-700 font-medium mb-2">
                      Profile Picture URL (optional)
                    </label>
                    <input
                      type="url"
                      id="profilePicture"
                      name="profilePicture"
                      value={formData.profilePicture}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">Full Name</h2>
                    <p className="text-gray-700">{user?.name}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">Email</h2>
                    <p className="text-gray-700">{user?.email}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">Student ID</h2>
                    <p className="text-gray-700">{user?.studentId || 'Not set'}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">Account Type</h2>
                    <p className="text-gray-700 capitalize">{user?.role}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">Member Since</h2>
                    <p className="text-gray-700">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'Unknown'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Security</h2>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Change Password</h3>
            <p className="text-gray-600 mb-4">
              To change your password, please contact the library administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
