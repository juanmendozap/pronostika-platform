import { Router, Response } from 'express';
import Joi from 'joi';
import { pool } from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = Router();

// Place a bet
router.post('/:id/place', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const betId = req.params.id;
    const { optionId, amount } = req.body;
    const userId = req.user!.id;

    // Validate input
    if (!optionId || !amount || amount <= 0) {
      throw createError('Invalid bet data', 400);
    }

    // Check if user has enough points
    if (req.user!.points < amount) {
      throw createError('Insufficient points', 400);
    }

    // Check if bet exists and is active
    const betCheck = await pool.query(
      'SELECT id, status FROM bets WHERE id = $1',
      [betId]
    );

    if (betCheck.rows.length === 0) {
      throw createError('Bet not found', 404);
    }

    if (betCheck.rows[0].status !== 'active') {
      throw createError('Bet is not active', 400);
    }

    // Start transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Calculate potential winnings (simplified odds calculation)
      const optionResult = await client.query(
        'SELECT odds FROM bet_options WHERE id = $1 AND bet_id = $2',
        [optionId, betId]
      );

      if (optionResult.rows.length === 0) {
        throw createError('Invalid bet option', 400);
      }

      const odds = optionResult.rows[0].odds;
      const potentialWinnings = Math.floor(amount * odds);

      // Create user bet
      const userBetResult = await client.query(`
        INSERT INTO user_bets (user_id, bet_id, option_id, amount, potential_winnings)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `, [userId, betId, optionId, amount, potentialWinnings]);

      // Update user points
      await client.query(
        'UPDATE users SET points = points - $1 WHERE id = $2',
        [amount, userId]
      );

      // Create transaction record
      await client.query(`
        INSERT INTO transactions (user_id, type, amount, description, related_bet_id)
        VALUES ($1, $2, $3, $4, $5)
      `, [userId, 'bet_placed', -amount, 'Bet placed', betId]);

      await client.query('COMMIT');

      res.json({
        success: true,
        data: {
          userBetId: userBetResult.rows[0].id,
          amount,
          potentialWinnings
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

// Get all bets with filtering
router.get('/', async (req: AuthRequest, res: Response, next) => {
  try {
    const { category, status, limit = '50' } = req.query;
    
    let whereClause = "WHERE b.status IN ('active', 'closed', 'paused')";
    const params: any[] = [];
    let paramIndex = 1;

    // Filter by category
    if (category && category !== 'all') {
      whereClause += ` AND LOWER(bc.name) = LOWER($${paramIndex})`;
      params.push(category);
      paramIndex++;
    }

    // Filter by status
    if (status && status !== 'all') {
      if (status === 'open') {
        whereClause += ` AND b.status = 'active'`;
      } else if (status === 'closed') {
        whereClause += ` AND b.status IN ('closed', 'paused')`;
      }
    }

    const query = `
      SELECT 
        b.id,
        b.title,
        b.description,
        b.total_pool,
        b.status,
        b.created_at,
        bc.name as category_name,
        bc.id as category_id,
        array_agg(
          json_build_object(
            'id', bo.id,
            'text', bo.text,
            'odds', bo.odds,
            'total_staked', bo.total_staked
          ) ORDER BY bo.created_at
        ) as options
      FROM bets b
      JOIN bet_categories bc ON b.category_id = bc.id
      JOIN bet_options bo ON b.id = bo.bet_id
      ${whereClause}
      GROUP BY b.id, bc.name, bc.id
      ORDER BY 
        CASE WHEN b.status = 'active' THEN 1 ELSE 2 END,
        bc.name,
        b.created_at DESC
      LIMIT $${paramIndex}
    `;
    
    params.push(parseInt(limit.toString()));
    const result = await pool.query(query, params);

    // Group bets by category for better organization
    const betsByCategory: Record<string, any[]> = {};
    result.rows.forEach(bet => {
      if (!betsByCategory[bet.category_name]) {
        betsByCategory[bet.category_name] = [];
      }
      betsByCategory[bet.category_name].push(bet);
    });

    res.json({
      success: true,
      data: {
        bets: result.rows,
        betsByCategory,
        totalCount: result.rows.length
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;