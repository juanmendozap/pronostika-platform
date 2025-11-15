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