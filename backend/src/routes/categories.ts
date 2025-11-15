import { Router, Response } from 'express';
import { pool } from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all categories
router.get('/', async (req: AuthRequest, res: Response, next) => {
  try {
    const result = await pool.query(
      'SELECT id, name, description, is_active FROM bet_categories WHERE is_active = true ORDER BY name'
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