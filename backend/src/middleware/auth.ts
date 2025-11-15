import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database';
import { createError } from './errorHandler';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
    points: number;
    isAdmin: boolean;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw createError('Access denied. No token provided.', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Get fresh user data from database
    const result = await pool.query(
      'SELECT id, email, username, points, is_admin FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      throw createError('Invalid token.', 401);
    }

    const user = result.rows[0];
    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      points: user.points,
      isAdmin: user.is_admin
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(createError('Invalid token.', 401));
    } else {
      next(error);
    }
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    return next(createError('Access denied. Admin privileges required.', 403));
  }
  next();
};