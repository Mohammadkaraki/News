/**
 * Global Error Handler Middleware
 * Handles all errors thrown in the application
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error Details:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query
    });
  } else {
    // In production, log only essential info
    console.error('❌ Production Error:', {
      name: err.name,
      message: err.message,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString()
    });
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = {
      message,
      statusCode: 404
    };
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `Duplicate field value for ${field}: '${value}'. Please use another value.`;
    error = {
      message,
      statusCode: 400
    };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = {
      message,
      statusCode: 400
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token. Please log in again.';
    error = {
      message,
      statusCode: 401
    };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired. Please log in again.';
    error = {
      message,
      statusCode: 401
    };
  }

  // Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'File too large. Please upload a smaller file.';
    error = {
      message,
      statusCode: 400
    };
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    const message = 'Too many files. Please upload fewer files.';
    error = {
      message,
      statusCode: 400
    };
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    const message = 'Unexpected file field. Please check your upload.';
    error = {
      message,
      statusCode: 400
    };
  }

  // Syntax errors in JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    const message = 'Invalid JSON in request body';
    error = {
      message,
      statusCode: 400
    };
  }

  // MongoDB connection errors
  if (err.name === 'MongooseError' || err.name === 'MongoError') {
    const message = process.env.NODE_ENV === 'development' 
      ? `Database error: ${err.message}`
      : 'Database connection error';
    error = {
      message,
      statusCode: 500
    };
  }

  // Rate limiting errors
  if (err.status === 429) {
    const message = 'Too many requests. Please try again later.';
    error = {
      message,
      statusCode: 429
    };
  }

  // Custom error class handling
  if (err.isOperational) {
    error = {
      message: err.message,
      statusCode: err.statusCode
    };
  }

  // Build error response
  const response = {
    success: false,
    error: error.message || 'Server Error'
  };

  // Add additional info in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    response.details = {
      name: err.name,
      code: err.code,
      statusCode: error.statusCode || 500
    };
  }

  // Add error ID for tracking
  const errorId = Date.now().toString(36) + Math.random().toString(36).substr(2);
  response.errorId = errorId;

  // Log error with ID for tracking
  console.error(`Error ID: ${errorId} - ${error.message}`);

  res.status(error.statusCode || 500).json(response);
};

/**
 * Async error handler wrapper
 * Wraps async functions to catch errors and pass to next()
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Custom Error Class
 */
class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Create specific error instances
 */
const createError = {
  badRequest: (message = 'Bad Request') => new CustomError(message, 400),
  unauthorized: (message = 'Unauthorized') => new CustomError(message, 401),
  forbidden: (message = 'Forbidden') => new CustomError(message, 403),
  notFound: (message = 'Not Found') => new CustomError(message, 404),
  conflict: (message = 'Conflict') => new CustomError(message, 409),
  unprocessable: (message = 'Unprocessable Entity') => new CustomError(message, 422),
  tooManyRequests: (message = 'Too Many Requests') => new CustomError(message, 429),
  internal: (message = 'Internal Server Error') => new CustomError(message, 500),
  notImplemented: (message = 'Not Implemented') => new CustomError(message, 501),
  badGateway: (message = 'Bad Gateway') => new CustomError(message, 502),
  serviceUnavailable: (message = 'Service Unavailable') => new CustomError(message, 503)
};

/**
 * 404 Not Found middleware
 * Should be placed before error handler
 */
const notFound = (req, res, next) => {
  const error = new CustomError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

/**
 * Validation error formatter
 */
const formatValidationErrors = (errors) => {
  return errors.map(error => ({
    field: error.path,
    message: error.msg,
    value: error.value
  }));
};

module.exports = {
  errorHandler,
  asyncHandler,
  CustomError,
  createError,
  notFound,
  formatValidationErrors
}; 