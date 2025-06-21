// const express = require('express');
// const { authenticateToken } = require('./auth');

// const router = express.Router();

// // Protected Dashboard route
// router.get('/dashboard', authenticateToken, async (req, res) => {
//   try {
//     User data is available from authenticateToken middleware in req.user
//     const user = req.user;
    
//     console.log('Dashboard access by user:', user._id);

//     // Calculate user age for display
//     const birthDate = new Date(user.dateOfBirth);
//     const today = new Date();
//     let age = today.getFullYear() - birthDate.getFullYear();
//     const monthDiff = today.getMonth() - birthDate.getMonth();
    
//     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//       age--;
//     }

//     // Welcome message with user info
//     res.status(200).json({
//       message: `Welcome to your Dashboard, ${user.fullName}!`,
//       success: true,
//       dashboardData: {
//         welcomeMessage: `Hello ${user.fullName}, you're successfully logged in!`,
//         userInfo: {
//           id: user._id,
//           fullName: user.fullName,
//           email: user.email,
//           age: age,
//           memberSince: user.createdAt,
//           lastUpdated: user.updatedAt,
//           accountStatus: 'Active'
//         },
//         quickStats: {
//           totalLogins: 'N/A', // You can implement login tracking
//           accountAge: Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24)) + ' days',
//           profileCompletion: '100%'
//         },
//         availableFeatures: [
//           'Profile Management',
//           'Account Settings',
//           'Security Settings',
//           'Privacy Controls'
//         ]
//       },
//       timestamp: new Date().toISOString()
//     });

//   } catch (err) {
//     console.error('Dashboard error:', err);
//     res.status(500).json({
//       message: 'Failed to load dashboard',
//       error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
//     });
//   }
// });

// // Additional protected routes can be added here
// router.get('/profile', authenticateToken, async (req, res) => {
//   try {
//     const user = req.user;
    
//     res.status(200).json({
//       message: 'Profile data retrieved successfully',
//       success: true,
//       profile: {
//         id: user._id,
//         fullName: user.fullName,
//         email: user.email,
//         dateOfBirth: user.dateOfBirth,
//         createdAt: user.createdAt,
//         updatedAt: user.updatedAt
//       }
//     });
//   } catch (err) {
//     console.error('Profile error:', err);
//     res.status(500).json({
//       message: 'Failed to load profile',
//       error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
//     });
//   }
// });

// module.exports = router;