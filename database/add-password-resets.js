const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function addPasswordResetsTable() {
  try {
    console.log('Adding password resets table...');
    
    // Check if table already exists
    const checkTable = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'password_resets'
      );
    `);
    
    if (checkTable.rows[0].exists) {
      console.log('Password resets table already exists');
      return;
    }
    
    // Create password resets table
    await pool.query(`
      CREATE TABLE password_resets (
        user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        token TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Password resets table created successfully');
    
  } catch (error) {
    console.error('Error adding password resets table:', error);
  } finally {
    await pool.end();
  }
}

addPasswordResetsTable();