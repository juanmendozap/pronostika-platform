const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'pronostika',
  password: 'Hola1234*',
  port: 5432,
});

async function checkBetData() {
  try {
    // Check bets with categories
    const betsResult = await pool.query(`
      SELECT b.*, bc.name as category_name 
      FROM bets b 
      LEFT JOIN bet_categories bc ON b.category_id = bc.id 
      ORDER BY b.created_at DESC
    `);
    console.log('Bets in database:');
    betsResult.rows.forEach(bet => {
      console.log(`- ${bet.title} (${bet.category_name}) - Status: ${bet.status}`);
    });

    // Check bet options
    const optionsResult = await pool.query(`
      SELECT bo.*, b.title as bet_title 
      FROM bet_options bo 
      LEFT JOIN bets b ON bo.bet_id = b.id
    `);
    console.log('\nBet options:');
    optionsResult.rows.forEach(option => {
      console.log(`- ${option.bet_title}: ${option.text} (${option.odds}x odds)`);
    });

    // Check categories
    const categoriesResult = await pool.query('SELECT * FROM bet_categories');
    console.log('\nCategories:');
    categoriesResult.rows.forEach(cat => {
      console.log(`- ${cat.name}: ${cat.description}`);
    });

  } catch (error) {
    console.error('Database error:', error.message);
  } finally {
    await pool.end();
  }
}

checkBetData();