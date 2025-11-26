import { Router, Response } from 'express';
import { pool } from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Temporary endpoint to make current user admin (remove after use)
router.post('/make-me-admin', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const userEmail = req.user!.email;

    // Update user to admin
    const result = await pool.query(
      'UPDATE users SET is_admin = true WHERE id = $1 RETURNING id, email, username, is_admin',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const updatedUser = result.rows[0];
    
    res.json({
      success: true,
      message: `User ${userEmail} is now an admin`,
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        isAdmin: updatedUser.is_admin
      }
    });
    
  } catch (error) {
    next(error);
  }
});

export default router;