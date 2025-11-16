const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:GekmdnNLRAibcpBttYEeqkfZGlSajiBV@tramway.proxy.rlwy.net:15989/railway'
});

async function fixTables() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Add missing username column to users table
    console.log('Adding username column to users table...');
    await client.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(100) UNIQUE');

    // Add missing updated_at column to users table
    console.log('Adding updated_at column to users table...');
    await client.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');

    // Check bets table structure
    console.log('\n=== CHECKING BETS TABLE ===');
    const betsResult = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'bets' 
      ORDER BY ordinal_position;
    `);
    console.log(betsResult.rows);

    // Check bet_options table structure  
    console.log('\n=== CHECKING BET_OPTIONS TABLE ===');
    const betOptionsResult = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'bet_options' 
      ORDER BY ordinal_position;
    `);
    console.log(betOptionsResult.rows);

    console.log('✅ Tables updated successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.end();
  }
}

fixTables();