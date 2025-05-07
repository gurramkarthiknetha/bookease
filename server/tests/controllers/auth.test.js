const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../../models/user.model');
const authRoutes = require('../../routes/auth.routes');
const { protect } = require('../../middleware/auth.middleware');

// Mock JWT token generation
jest.mock('../../utils/jwt', () => {
  return jest.fn().mockImplementation(() => 'mock-token');
});

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Mock protected route for testing
app.get('/api/protected', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

describe('Auth Controller Tests', () => {
  // Test user registration
  it('should register a new user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      studentId: 'S12345'
    };
    
    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);
    
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBe('mock-token');
    expect(response.body.user).toBeDefined();
    expect(response.body.user.name).toBe(userData.name);
    expect(response.body.user.email).toBe(userData.email);
    expect(response.body.user.password).toBeUndefined(); // Password should not be returned
    
    // Verify user was saved to database
    const savedUser = await User.findOne({ email: userData.email });
    expect(savedUser).toBeDefined();
    expect(savedUser.name).toBe(userData.name);
  });
  
  // Test user login
  it('should login an existing user', async () => {
    // Create a user first
    const userData = {
      name: 'Login Test',
      email: 'login@example.com',
      password: 'password123'
    };
    
    const user = new User(userData);
    await user.save();
    
    // Test login
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: userData.email,
        password: userData.password
      })
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBe('mock-token');
    expect(response.body.user).toBeDefined();
    expect(response.body.user.name).toBe(userData.name);
    expect(response.body.user.email).toBe(userData.email);
  });
  
  // Test login with incorrect credentials
  it('should fail to login with incorrect password', async () => {
    // Create a user first
    const userData = {
      name: 'Failed Login Test',
      email: 'failed@example.com',
      password: 'password123'
    };
    
    const user = new User(userData);
    await user.save();
    
    // Test login with wrong password
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: userData.email,
        password: 'wrongpassword'
      })
      .expect(401);
    
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBeDefined();
  });
  
  // Test login with non-existent user
  it('should fail to login with non-existent user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'password123'
      })
      .expect(401);
    
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBeDefined();
  });
  
  // Test registration with duplicate email
  it('should fail to register with duplicate email', async () => {
    // Create a user first
    const userData = {
      name: 'Duplicate Test',
      email: 'duplicate@example.com',
      password: 'password123'
    };
    
    const user = new User(userData);
    await user.save();
    
    // Try to register with same email
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Another User',
        email: userData.email,
        password: 'password456'
      })
      .expect(400);
    
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBeDefined();
  });
});
