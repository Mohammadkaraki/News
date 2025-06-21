const { validationResult } = require('express-validator');
const User = require('../models/User');
const { asyncHandler, createError, formatValidationErrors } = require('../middleware/errorHandler');

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = formatValidationErrors(errors.array());
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors
    });
  }

  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(createError.conflict('User with this email already exists'));
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password
  });

  // Generate token
  const token = user.getSignedJwtToken();

  // Clear failed attempts on successful registration
  if (req.clearAttempts) {
    req.clearAttempts();
  }

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      },
      token
    }
  });
});

/**
 * @desc    Login user
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = formatValidationErrors(errors.array());
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors
    });
  }

  const { email, password } = req.body;

  // Check for user and include password
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    if (req.trackFailedAttempt) {
      req.trackFailedAttempt();
    }
    return next(createError.unauthorized('Invalid credentials'));
  }

  // Check if user is active
  if (!user.isActive) {
    return next(createError.unauthorized('Account has been deactivated'));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    if (req.trackFailedAttempt) {
      req.trackFailedAttempt();
    }
    return next(createError.unauthorized('Invalid credentials'));
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = user.getSignedJwtToken();

  // Clear failed attempts on successful login
  if (req.clearAttempts) {
    req.clearAttempts();
  }

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
        lastLogin: user.lastLogin
      },
      token
    }
  });
});

/**
 * @desc    Get current user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('articles', 'title slug publishedAt status');

  res.status(200).json({
    success: true,
    data: {
      user
    }
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = formatValidationErrors(errors.array());
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors
    });
  }

  const { name, bio, avatar } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(createError.notFound('User not found'));
  }

  // Update allowed fields
  if (name) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (avatar) user.avatar = avatar;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user
    }
  });
});

/**
 * @desc    Change password
 * @route   PUT /api/users/change-password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = formatValidationErrors(errors.array());
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors
    });
  }

  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');

  // Check current password
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return next(createError.unauthorized('Current password is incorrect'));
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully'
  });
});

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build query
  const query = {};
  
  if (req.query.role) {
    query.role = req.query.role;
  }
  
  if (req.query.isActive !== undefined) {
    query.isActive = req.query.isActive === 'true';
  }

  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

/**
 * @desc    Get user by ID (Admin/Editor only)
 * @route   GET /api/users/:id
 * @access  Private/Admin/Editor
 */
const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .populate('articles', 'title slug publishedAt status views');

  if (!user) {
    return next(createError.notFound('User not found'));
  }

  res.status(200).json({
    success: true,
    data: {
      user
    }
  });
});

/**
 * @desc    Update user (Admin only)
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
const updateUser = asyncHandler(async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = formatValidationErrors(errors.array());
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors
    });
  }

  const { name, email, role, isActive, isVerified } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(createError.notFound('User not found'));
  }

  // Prevent updating admin users unless current user is admin
  if (user.role === 'admin' && req.user.role !== 'admin') {
    return next(createError.forbidden('Cannot update admin users'));
  }

  // Update fields
  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;
  if (isVerified !== undefined) user.isVerified = isVerified;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: {
      user
    }
  });
});

/**
 * @desc    Delete user (Admin only)
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(createError.notFound('User not found'));
  }

  // Prevent deleting admin users
  if (user.role === 'admin') {
    return next(createError.forbidden('Cannot delete admin users'));
  }

  // Prevent users from deleting themselves
  if (user._id.toString() === req.user._id.toString()) {
    return next(createError.forbidden('Cannot delete your own account'));
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});

/**
 * @desc    Get user statistics (Admin only)
 * @route   GET /api/users/stats
 * @access  Private/Admin
 */
const getUserStats = asyncHandler(async (req, res) => {
  const stats = await User.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: {
          $sum: {
            $cond: [{ $eq: ['$isActive', true] }, 1, 0]
          }
        },
        verifiedUsers: {
          $sum: {
            $cond: [{ $eq: ['$isVerified', true] }, 1, 0]
          }
        },
        adminUsers: {
          $sum: {
            $cond: [{ $eq: ['$role', 'admin'] }, 1, 0]
          }
        },
        editorUsers: {
          $sum: {
            $cond: [{ $eq: ['$role', 'editor'] }, 1, 0]
          }
        },
        regularUsers: {
          $sum: {
            $cond: [{ $eq: ['$role', 'user'] }, 1, 0]
          }
        }
      }
    }
  ]);

  // Get recent registrations
  const recentUsers = await User.find()
    .select('name email role createdAt')
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    data: {
      stats: stats[0] || {
        totalUsers: 0,
        activeUsers: 0,
        verifiedUsers: 0,
        adminUsers: 0,
        editorUsers: 0,
        regularUsers: 0
      },
      recentUsers
    }
  });
});

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats
}; 