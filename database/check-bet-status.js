const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:JUegfJDwFOFzYUgdMKUdvUxZjBZkdYNI@junction.proxy.rlwy.net:43522/railway',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function checkBetStatuses() {
  try {
    // Check distinct statuses
    const statusResult = await pool.query('SELECT DISTINCT status FROM bets ORDER BY status;');
    console.log('Available bet statuses:');
    statusResult.rows.forEach(row => {
      console.log(`- "${row.status}"`);
    });

    // Count bets by status
    const countResult = await pool.query(`
      SELECT status, COUNT(*) as count 
      FROM bets 
      GROUP BY status 
      ORDER BY status;
    `);
    console.log('\nBet counts by status:');
    countResult.rows.forEach(row => {
      console.log(`- ${row.status}: ${row.count} bets`);
    });

    // Show some sample bets with their statuses
    const sampleResult = await pool.query(`
      SELECT id, title, status, created_at 
      FROM bets 
      ORDER BY id 
      LIMIT 10;
    `);
    console.log('\nSample bets:');
    sampleResult.rows.forEach(row => {
      console.log(`- ID ${row.id}: "${row.title}" (status: "${row.status}")`);
    });

  } catch (error) {
    console.error('Error checking bet statuses:', error);
  } finally {
    await pool.end();
  }
}

checkBetStatuses();