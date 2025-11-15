import { Router, Request, Response } from 'express';
import { pool } from '../config/database';

const router = Router();

// Health check endpoint
router.get('/health', async (req: Request, res: Response) => {
  try {
    // Check database connection
    const dbCheck = await pool.query('SELECT 1');
    
    // Get system stats
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    
    // Check user count
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    const betCount = await pool.query('SELECT COUNT(*) FROM bets');
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(uptime),
      database: 'connected',
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024)
      },
      stats: {
        users: parseInt(userCount.rows[0].count),
        bets: parseInt(betCount.rows[0].count)
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed'
    });
  }
});

// Server status endpoint
router.get('/status', (req: Request, res: Response) => {
  res.json({
    server: 'running',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

export default router;