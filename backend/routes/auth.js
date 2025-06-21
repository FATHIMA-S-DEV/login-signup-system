const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

// Sign up route (existing)
router.post('/signup', async (req, res) => {
  console.log('Signup request received:', req.body); // Debug log
  
  const { fullName, dateOfBirth, email, password } = req.body;

  try {
    // Input validation
    if (!fullName || !dateOfBirth || !email || !password) {
      return res.status(400).json({
        message: 'All fields are required',
        missing_fields: {
          fullName: !fullName,
          dateOfBirth: !dateOfBirth,
          email: !email,
          password: !password
        }
      });
    }

    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not found in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const saltRounds = 12; // Increased from 10 for better security
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      fullName: fullName.trim(),
      dateOfBirth: new Date(dateOfBirth),
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    // Save user to database
    const savedUser = await newUser.save();
    console.log('User saved successfully:', savedUser._id); // Debug log

    // Generate JWT token
    const token = jwt.sign(
      {
        id: savedUser._id,
        email: savedUser.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // Increased from 1h
    );

    // Return success response (don't send password)
    res.status(201).json({
      message: 'User created successfully',
      success: true,
      token,
      user: {
        id: savedUser._id,
        fullName: savedUser.fullName,
        email: savedUser.email,
        dateOfBirth: savedUser.dateOfBirth,
        role: 'User', // Default role
        createdAt: savedUser.createdAt
      }
    });

  } catch (err) {
    console.error('Signup error:', err); // Enhanced error logging
    
    // Handle specific MongoDB errors
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Generic error response
    res.status(500).json({
      message: 'Something went wrong',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

// Sign in route (updated)
router.post('/signin', async (req, res) => {
  console.log('Signin request received:', { email: req.body.email, password: '[HIDDEN]' }); // Debug log
  
  const { email, password } = req.body;

  try {
    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
        missing_fields: {
          email: !email,
          password: !password
        }
      });
    }

    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not found in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update last login time (optional - if you want to track this)
    // user.lastLogin = new Date();
    // await user.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('User signed in successfully:', user._id); // Debug log

    // Return success response (don't send password)
    res.status(200).json({
      message: 'Sign in successful',
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        role: user.role || 'User', // Default role if not set
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLogin: user.lastLogin || user.updatedAt // Use updatedAt as fallback
      }
    });

  } catch (err) {
    console.error('Signin error:', err); // Enhanced error logging
    
    // Generic error response
    res.status(500).json({
      message: 'Something went wrong',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

// Verify token route (NEW - required for Dashboard)
router.get('/verify', async (req, res) => {
  console.log('Token verification request received'); // Debug log
  
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token
    
    if (!token) {
      return res.status(401).json({ 
        message: 'No token provided',
        success: false 
      });
    }

    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not found in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID from token (exclude password)
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid token - user not found',
        success: false 
      });
    }

    console.log('Token verified successfully for user:', user._id); // Debug log

    // Return success response with user data
    res.status(200).json({
      message: 'Token verified successfully',
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        role: user.role || 'User', // Default role if not set
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLogin: user.lastLogin || user.updatedAt // Use updatedAt as fallback
      }
    });

  } catch (err) {
    console.error('Token verification error:', err); // Enhanced error logging
    
    // Handle specific JWT errors
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token format',
        success: false 
      });
    }
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token has expired',
        success: false,
        expired: true
      });
    }

    if (err.name === 'NotBeforeError') {
      return res.status(401).json({ 
        message: 'Token not active yet',
        success: false 
      });
    }
    
    // Generic error response
    res.status(500).json({
      message: 'Token verification failed',
      success: false,
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

// Google Sign Up route (optional - if you want to implement Google OAuth)
router.post('/google-signup', async (req, res) => {
  const { token } = req.body;
  
  try {
    // You would verify the Google token here using Google's API
    // This is a placeholder implementation
    res.status(501).json({ message: 'Google signup not implemented yet' });
  } catch (err) {
    console.error('Google signup error:', err);
    res.status(500).json({ message: 'Google signup failed' });
  }
});

// Google Sign In route (optional - if you want to implement Google OAuth)
router.post('/google-signin', async (req, res) => {
  const { token } = req.body;
  
  try {
    // You would verify the Google token here using Google's API
    // This is a placeholder implementation
    res.status(501).json({ message: 'Google signin not implemented yet' });
  } catch (err) {
    console.error('Google signin error:', err);
    res.status(500).json({ message: 'Google signin failed' });
  }
});

// Middleware to protect routes (utility function)
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user; // Attach user to request object
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = router;