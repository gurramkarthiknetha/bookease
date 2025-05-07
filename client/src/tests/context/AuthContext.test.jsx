import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../../context/AuthContext';

// Mock the API service
vi.mock('../../services/api', () => ({
  authAPI: {
    login: vi.fn(),
    register: vi.fn(),
    getProfile: vi.fn()
  }
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn(key => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn(key => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Test component that uses the auth context
const TestComponent = () => {
  const { user, isAuthenticated, login, logout, register } = useAuth();
  
  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
      </div>
      {user && (
        <div data-testid="user-info">
          {user.name} ({user.email})
        </div>
      )}
      <button 
        onClick={() => login({ email: 'test@example.com', password: 'password' })}
        data-testid="login-button"
      >
        Login
      </button>
      <button 
        onClick={() => register({ name: 'Test User', email: 'test@example.com', password: 'password' })}
        data-testid="register-button"
      >
        Register
      </button>
      <button 
        onClick={logout}
        data-testid="logout-button"
      >
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  const mockUser = {
    _id: '123',
    name: 'Test User',
    email: 'test@example.com',
    role: 'student'
  };
  
  const mockAuthResponse = {
    data: {
      success: true,
      token: 'mock-token',
      user: mockUser
    }
  };
  
  beforeEach(() => {
    vi.resetAllMocks();
    localStorageMock.clear();
  });
  
  it('provides authentication state and functions', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Initially not authenticated
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    
    // Mock successful login
    const { authAPI } = await import('../../services/api');
    authAPI.login.mockResolvedValueOnce(mockAuthResponse);
    
    // Click login button
    const user = userEvent.setup();
    await user.click(screen.getByTestId('login-button'));
    
    // Check if login function was called
    expect(authAPI.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password'
    });
    
    // Wait for state update
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user-info')).toHaveTextContent('Test User (test@example.com)');
    });
    
    // Check if token was stored in localStorage
    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'mock-token');
    
    // Test logout
    await user.click(screen.getByTestId('logout-button'));
    
    // Check if user is logged out
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
  });
  
  it('handles registration', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Mock successful registration
    const { authAPI } = await import('../../services/api');
    authAPI.register.mockResolvedValueOnce(mockAuthResponse);
    
    // Click register button
    const user = userEvent.setup();
    await user.click(screen.getByTestId('register-button'));
    
    // Check if register function was called
    expect(authAPI.register).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password'
    });
    
    // Wait for state update
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });
  });
  
  it('loads user from token on initial load', async () => {
    // Set token in localStorage
    localStorageMock.setItem('token', 'existing-token');
    
    // Mock successful profile fetch
    const { authAPI } = await import('../../services/api');
    authAPI.getProfile.mockResolvedValueOnce({
      data: {
        user: mockUser
      }
    });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Wait for user to be loaded
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user-info')).toHaveTextContent('Test User (test@example.com)');
    });
    
    // Check if getProfile was called
    expect(authAPI.getProfile).toHaveBeenCalled();
  });
  
  it('handles login failure', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Mock failed login
    const { authAPI } = await import('../../services/api');
    authAPI.login.mockRejectedValueOnce(new Error('Login failed'));
    
    // Click login button
    const user = userEvent.setup();
    await user.click(screen.getByTestId('login-button'));
    
    // User should still be unauthenticated
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });
  });
});
