import jwt from 'jsonwebtoken';
import { findByColumn, SHEETS } from '../services/googleSheets.js';

/**
 * Middleware to verify JWT token
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from database to ensure they still exist
    const user = await findByColumn(SHEETS.USERS, 'id', decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    // Remove password hash from user object
    delete user.password_hash;

    req.user = user;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      });
    }

    return res.status(403).json({
      success: false,
      message: 'Invalid token',
    });
  }
};

/**
 * Middleware to check user roles
 * @param {string[]} roles - Array of allowed roles
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action',
      });
    }

    next();
  };
};

/**
 * Optional authentication - adds user to req if token present, but doesn't require it
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await findByColumn(SHEETS.USERS, 'id', decoded.userId);

      if (user) {
        delete user.password_hash;
        req.user = user;
        req.userId = decoded.userId;
      }
    }

    next();
  } catch (error) {
    // Token invalid or expired, continue without user
    next();
  }
};
