import { Router, Request, Response } from 'express';
import { pool } from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all categories (public endpoint)
router.get('/', async (req: Request, res: Response, next) => {
  try {
    const result = await pool.query(
      'SELECT id, name, description, color FROM categories ORDER BY name'
    );

    res.json({
      success: true,
      data: {
        categories: result.rows
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;