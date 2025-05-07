const mongoose = require('mongoose');
const User = require('../../models/user.model');

describe('User Model Test', () => {
  // Test user creation
  it('should create & save user successfully', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      studentId: 'S12345'
    };
    
    const validUser = new User(userData);
    const savedUser = await validUser.save();
    
    // Object Id should be defined
    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe(userData.name);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.studentId).toBe(userData.studentId);
    expect(savedUser.role).toBe('student'); // Default role
    
    // Password should be hashed
    expect(savedUser.password).not.toBe(userData.password);
  });
  
  // Test required fields
  it('should fail to create user without required fields', async () => {
    const userWithoutRequiredField = new User({ name: 'Test User' });
    let err;
    
    try {
      await userWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.email).toBeDefined();
    expect(err.errors.password).toBeDefined();
  });
  
  // Test email validation
  it('should fail to create user with invalid email', async () => {
    const userWithInvalidEmail = new User({
      name: 'Test User',
      email: 'invalid-email',
      password: 'password123'
    });
    
    let err;
    
    try {
      await userWithInvalidEmail.save();
    } catch (error) {
      err = error;
    }
    
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.email).toBeDefined();
  });
  
  // Test password hashing
  it('should hash password before saving', async () => {
    const userData = {
      name: 'Test User',
      email: 'test2@example.com',
      password: 'password123'
    };
    
    const user = new User(userData);
    await user.save();
    
    // Password should be hashed
    expect(user.password).not.toBe(userData.password);
    
    // Verify password comparison works
    const isMatch = await user.correctPassword('password123', user.password);
    expect(isMatch).toBe(true);
    
    const isNotMatch = await user.correctPassword('wrongpassword', user.password);
    expect(isNotMatch).toBe(false);
  });
  
  // Test unique email constraint
  it('should fail to create user with duplicate email', async () => {
    // Create first user
    const firstUser = new User({
      name: 'First User',
      email: 'duplicate@example.com',
      password: 'password123'
    });
    
    await firstUser.save();
    
    // Try to create second user with same email
    const secondUser = new User({
      name: 'Second User',
      email: 'duplicate@example.com',
      password: 'password456'
    });
    
    let err;
    
    try {
      await secondUser.save();
    } catch (error) {
      err = error;
    }
    
    expect(err).toBeDefined();
    expect(err.code).toBe(11000); // Duplicate key error
  });
});
