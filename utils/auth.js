import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

// Secret for JWT signing - in production, use environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Salt rounds for bcrypt
const SALT_ROUNDS = 10;

// Hash password
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

// Compare password with hash
export const verifyPassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Set cookie with JWT token
export const setAuthCookie = (res, token) => {
  const cookie = serialize('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/'
  });
  
  res.setHeader('Set-Cookie', cookie);
};

// Clear auth cookie
export const clearAuthCookie = (res) => {
  const cookie = serialize('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: -1, // Expired
    path: '/'
  });
  
  res.setHeader('Set-Cookie', cookie);
};

// Get user from request
export const getUserFromRequest = (req) => {
  const token = req.cookies.auth_token;
  if (!token) return null;
  
  const decoded = verifyToken(token);
  if (!decoded) return null;
  
  return decoded;
};

// Middleware to protect API routes
export const withAuth = (handler) => {
  return async (req, res) => {
    const user = getUserFromRequest(req);
    
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    req.user = user;
    return handler(req, res);
  };
};
