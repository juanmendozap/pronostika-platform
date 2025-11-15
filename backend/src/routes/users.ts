import { Router, Response } from 'express';
import { pool } from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = Router();

// Get current user's bets
router.get('/bets', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;

    const result = await pool.query(`
      SELECT 
        ub.id,
        ub.amount,
        ub.potential_winnings,
        ub.status,
        ub.placed_at,
        b.id as bet_id,
        b.title as bet_title,
        bo.text as option_text
      FROM user_bets ub
      JOIN bets b ON ub.bet_id = b.id
      JOIN bet_options bo ON ub.option_id = bo.id
      WHERE ub.user_id = $1
      ORDER BY ub.placed_at DESC
    `, [userId]);

    res.json({
      success: true,
      data: {
        bets: result.rows
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get user profile
router.get('/:id', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const { id: requestedUserId } = req.params;
    const currentUserId = req.user!.id;

    // Users can only view their own profile unless they're admin
    if (requestedUserId !== currentUserId && !req.user!.isAdmin) {
      throw createError('Access denied', 403);
    }

    const result = await pool.query(
      'SELECT id, email, username, points, is_admin, created_at FROM users WHERE id = $1',
      [requestedUserId]
    );

    if (result.rows.length === 0) {
      throw createError('User not found', 404);
    }

    const user = result.rows[0];
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          points: user.points,
          isAdmin: user.is_admin,
          createdAt: user.created_at
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get user's bets
router.get('/:id/bets', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const { id: requestedUserId } = req.params;
    const currentUserId = req.user!.id;

    // Users can only view their own bets unless they're admin
    if (requestedUserId !== currentUserId && !req.user!.isAdmin) {
      throw createError('Access denied', 403);
    }

    const result = await pool.query(`
      SELECT 
        ub.id,
        ub.amount,
        ub.potential_winnings,
        ub.status,
        ub.placed_at,
        b.id as bet_id,
        b.title as bet_title,
        bo.text as option_text
      FROM user_bets ub
      JOIN bets b ON ub.bet_id = b.id
      JOIN bet_options bo ON ub.option_id = bo.id
      WHERE ub.user_id = $1
      ORDER BY ub.placed_at DESC
    `, [requestedUserId]);

    res.json({
      success: true,
      data: {
        bets: result.rows
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get user's transactions
router.get('/:id/transactions', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const { id: requestedUserId } = req.params;
    const currentUserId = req.user!.id;

    // Users can only view their own transactions unless they're admin
    if (requestedUserId !== currentUserId && !req.user!.isAdmin) {
      throw createError('Access denied', 403);
    }

    const result = await pool.query(`
      SELECT 
        id,
        type,
        amount,
        description,
        created_at
      FROM transactions
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 50
    `, [requestedUserId]);

    res.json({
      success: true,
      data: {
        transactions: result.rows
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get leaderboard/rankings
router.get('/leaderboard', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.username,
        u.points,
        COALESCE(stats.total_bets, 0) as total_bets,
        COALESCE(stats.total_wagered, 0) as total_wagered,
        COALESCE(stats.total_winnings, 0) as total_winnings,
        COALESCE(stats.active_bets, 0) as active_bets,
        CASE 
          WHEN COALESCE(stats.total_bets, 0) = 0 THEN 0
          ELSE ROUND(
            (COALESCE(stats.won_bets, 0)::decimal / COALESCE(stats.total_bets, 1)::decimal) * 100, 
            1
          )
        END as win_rate,
        RANK() OVER (ORDER BY u.points DESC) as rank
      FROM users u
      LEFT JOIN (
        SELECT 
          ub.user_id,
          COUNT(*) as total_bets,
          SUM(ub.amount) as total_wagered,
          SUM(CASE WHEN ub.status = 'won' THEN ub.potential_winnings ELSE 0 END) as total_winnings,
          COUNT(CASE WHEN ub.status = 'active' THEN 1 END) as active_bets,
          COUNT(CASE WHEN ub.status = 'won' THEN 1 END) as won_bets
        FROM user_bets ub
        GROUP BY ub.user_id
      ) stats ON u.id = stats.user_id
      WHERE u.is_admin = false
      ORDER BY u.points DESC, stats.total_winnings DESC
      LIMIT 50
    `);

    res.json({
      success: true,
      data: {
        leaderboard: result.rows
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;