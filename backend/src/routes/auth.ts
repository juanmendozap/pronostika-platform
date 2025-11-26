import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { pool } from '../config/database';
import { createError } from '../middleware/errorHandler';

const router = Router();

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(2).max(50).required(),
  username: Joi.string().alphanum().min(3).max(30).optional(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required()
});

// Register
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      throw createError(error.details[0].message, 400);
    }

    const { email, name, password } = value;
    
    // Generate username from name if not provided
    const username = value.username || name.toLowerCase().replace(/\s+/g, '_').slice(0, 30);

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      throw createError('User with this email or username already exists', 400);
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await pool.query(
      `INSERT INTO users (email, username, password_hash, points) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, username, points, is_admin, created_at`,
      [email, username, passwordHash, 1000]
    );

    const user = result.rows[0];

    // Create initial transaction record
    await pool.query(
      'INSERT INTO transactions (user_id, type, amount, description) VALUES ($1, $2, $3, $4)',
      [user.id, 'initial_points', 1000, 'Welcome bonus points']
    );

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          points: user.points,
          isAdmin: user.is_admin
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      throw createError(error.details[0].message, 400);
    }

    const { email, password } = value;

    // Find user
    const result = await pool.query(
      'SELECT id, email, username, password_hash, points, is_admin FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      throw createError('Invalid email or password', 401);
    }

    const user = result.rows[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw createError('Invalid email or password', 401);
    }

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '7d' });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          points: user.points,
          isAdmin: user.is_admin
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
});

// Forgot password - send reset token
router.post('/forgot-password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = forgotPasswordSchema.validate(req.body);
    if (error) {
      throw createError(error.details[0].message, 400);
    }

    const { email } = value;

    // Check if user exists
    const userResult = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      // Don't reveal if email exists or not for security
      return res.json({
        success: true,
        message: 'If the email exists, a password reset link has been sent.'
      });
    }

    const userId = userResult.rows[0].id;

    // Generate reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { userId, type: 'password_reset' },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '1h' }
    );

    // Store reset token in database (you could also just rely on JWT expiration)
    await pool.query(
      `INSERT INTO password_resets (user_id, token, expires_at) 
       VALUES ($1, $2, NOW() + INTERVAL '1 hour')
       ON CONFLICT (user_id) 
       DO UPDATE SET token = $2, expires_at = NOW() + INTERVAL '1 hour'`,
      [userId, resetToken]
    );

    // In a real app, you would send an email here
    // For now, we'll just return the token (NOT SECURE FOR PRODUCTION)
    res.json({
      success: true,
      message: 'Password reset instructions have been sent to your email.',
      // REMOVE THIS IN PRODUCTION - only for testing
      resetToken: resetToken
    });
  } catch (error) {
    next(error);
  }
});

// Reset password with token
router.post('/reset-password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = resetPasswordSchema.validate(req.body);
    if (error) {
      throw createError(error.details[0].message, 400);
    }

    const { token, password } = value;

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    } catch (err) {
      throw createError('Invalid or expired reset token', 400);
    }

    if (decoded.type !== 'password_reset') {
      throw createError('Invalid token type', 400);
    }

    // Check if token exists in database and is not expired
    const tokenResult = await pool.query(
      'SELECT user_id FROM password_resets WHERE user_id = $1 AND token = $2 AND expires_at > NOW()',
      [decoded.userId, token]
    );

    if (tokenResult.rows.length === 0) {
      throw createError('Invalid or expired reset token', 400);
    }

    // Hash new password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Update user password
    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [passwordHash, decoded.userId]
    );

    // Delete used reset token
    await pool.query(
      'DELETE FROM password_resets WHERE user_id = $1',
      [decoded.userId]
    );

    res.json({
      success: true,
      message: 'Password has been reset successfully.'
    });
  } catch (error) {
    next(error);
  }
});

// TEMPORARY: Make user admin (REMOVE AFTER USE)
router.post('/make-admin-emergency', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      throw createError('Email is required', 400);
    }

    // Update user to admin
    const result = await pool.query(
      'UPDATE users SET is_admin = true WHERE email = $1 RETURNING id, email, username, is_admin',
      [email]
    );

    if (result.rows.length === 0) {
      throw createError('User not found', 404);
    }

    const user = result.rows[0];
    
    res.json({
      success: true,
      message: `User ${user.email} is now an admin`,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        isAdmin: user.is_admin
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get current user profile (placeholder for now)
router.get('/profile', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      message: 'Profile endpoint - auth middleware needed'
    }
  });
});

export default router;