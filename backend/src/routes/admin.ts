import { Router, Response } from 'express';
import { pool } from '../config/database';
import { authenticate, AuthRequest, requireAdmin } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = Router();

// All admin routes require authentication and admin privileges
router.use(authenticate);
router.use(requireAdmin);

// Get admin statistics
router.get('/stats', async (req: AuthRequest, res: Response, next) => {
  try {
    const [usersResult, betsResult, totalVolumeResult] = await Promise.all([
      pool.query('SELECT COUNT(*) as total_users FROM users'),
      pool.query('SELECT COUNT(*) as total_bets FROM bets'),
      pool.query('SELECT SUM(amount) as total_volume FROM user_bets WHERE status = \'active\'')
    ]);

    res.json({
      success: true,
      data: {
        totalUsers: parseInt(usersResult.rows[0].total_users),
        totalBets: parseInt(betsResult.rows[0].total_bets),
        totalVolume: parseInt(totalVolumeResult.rows[0].total_volume || '0')
      }
    });
  } catch (error) {
    next(error);
  }
});

// Create a new bet
router.post('/bets', async (req: AuthRequest, res: Response, next) => {
  try {
    const { title, description, categoryId, options } = req.body;
    const userId = req.user!.id;

    // Validate input
    if (!title || !description || !categoryId || !options || !Array.isArray(options)) {
      throw createError('Missing required fields', 400);
    }

    if (options.length < 2) {
      throw createError('At least 2 betting options are required', 400);
    }

    // Validate options
    for (const option of options) {
      if (!option.text || !option.odds || option.odds <= 0) {
        throw createError('All options must have text and positive odds', 400);
      }
    }

    // Check if category exists
    const categoryResult = await pool.query(
      'SELECT id FROM bet_categories WHERE id = $1',
      [categoryId]
    );

    if (categoryResult.rows.length === 0) {
      throw createError('Invalid category', 400);
    }

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Insert bet
      const betResult = await client.query(`
        INSERT INTO bets (title, description, category_id, created_by, status)
        VALUES ($1, $2, $3, $4, 'active')
        RETURNING id
      `, [title, description, categoryId, userId]);

      const betId = betResult.rows[0].id;

      // Insert bet options
      for (const option of options) {
        await client.query(`
          INSERT INTO bet_options (bet_id, text, odds)
          VALUES ($1, $2, $3)
        `, [betId, option.text, parseFloat(option.odds)]);
      }

      await client.query('COMMIT');

      res.json({
        success: true,
        data: {
          betId,
          message: 'Bet created successfully'
        }
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    next(error);
  }
});

// Get all bets for admin management
router.get('/bets', async (req: AuthRequest, res: Response, next) => {
  try {
    const result = await pool.query(`
      SELECT 
        b.id,
        b.title,
        b.description,
        b.total_pool,
        b.status,
        b.created_at,
        bc.name as category_name,
        u.username as created_by_username,
        array_agg(
          json_build_object(
            'id', bo.id,
            'text', bo.text,
            'odds', bo.odds,
            'total_staked', bo.total_staked
          )
        ) as options
      FROM bets b
      JOIN bet_categories bc ON b.category_id = bc.id
      LEFT JOIN users u ON b.created_by = u.id
      JOIN bet_options bo ON b.id = bo.bet_id
      GROUP BY b.id, bc.name, u.username
      ORDER BY b.created_at DESC
    `);

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

// Update bet status (activate, pause, close)
router.put('/bets/:id/status', async (req: AuthRequest, res: Response, next) => {
  try {
    const betId = req.params.id;
    const { status } = req.body;

    if (!['active', 'paused', 'closed'].includes(status)) {
      throw createError('Invalid status. Must be active, paused, or closed', 400);
    }

    const result = await pool.query(
      'UPDATE bets SET status = $1 WHERE id = $2 RETURNING id, status',
      [status, betId]
    );

    if (result.rows.length === 0) {
      throw createError('Bet not found', 404);
    }

    res.json({
      success: true,
      data: {
        betId,
        status: result.rows[0].status,
        message: `Bet status updated to ${status}`
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;