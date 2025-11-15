const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'pronostika',
  password: 'Hola1234*',
  port: 5432,
});

async function checkDatabase() {
  try {
    // Check tables
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables in database:', tablesResult.rows.map(r => r.table_name));

    // Check users
    const usersResult = await pool.query('SELECT count(*) FROM users');
    console.log('Number of users:', usersResult.rows[0].count);
    
    // Check if bet-related tables exist
    const tables = tablesResult.rows.map(r => r.table_name);
    
    if (tables.includes('bets')) {
      const betsResult = await pool.query('SELECT count(*) FROM bets');
      console.log('Number of bets:', betsResult.rows[0].count);
    } else {
      console.log('Bets table does not exist');
    }
    
    if (tables.includes('categories')) {
      const categoriesResult = await pool.query('SELECT count(*) FROM categories');
      console.log('Number of categories:', categoriesResult.rows[0].count);
    } else {
      console.log('Categories table does not exist');
    }

  } catch (error) {
    console.error('Database error:', error.message);
  } finally {
    await pool.end();
  }
}

checkDatabase();