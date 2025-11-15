require('dotenv').config();
const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function createRealUsers() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'pronostika'
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    
    // Clear existing data in the right order (due to foreign keys)
    console.log('Clearing existing data...');
    await client.query('DELETE FROM transactions');
    await client.query('DELETE FROM user_bets');
    await client.query('DELETE FROM bet_options');
    await client.query('DELETE FROM bets');
    await client.query('DELETE FROM users');
    
    // Create proper password hashes
    const adminPasswordHash = await bcrypt.hash('admin123', 12);
    const userPasswordHash = await bcrypt.hash('user123', 12);
    
    console.log('Creating admin user...');
    // Insert admin user
    await client.query(`
      INSERT INTO users (email, username, password_hash, points, is_admin) 
      VALUES ($1, $2, $3, $4, $5)
    `, ['admin@pronostika.com', 'admin', adminPasswordHash, 10000, true]);
    
    console.log('Creating regular users...');
    // Insert regular users
    await client.query(`
      INSERT INTO users (email, username, password_hash, points) 
      VALUES ($1, $2, $3, $4)
    `, ['user1@example.com', 'bettor1', userPasswordHash, 1000]);
    
    await client.query(`
      INSERT INTO users (email, username, password_hash, points) 
      VALUES ($1, $2, $3, $4)
    `, ['user2@example.com', 'bettor2', userPasswordHash, 1000]);
    
    await client.query(`
      INSERT INTO users (email, username, password_hash, points) 
      VALUES ($1, $2, $3, $4)
    `, ['user3@example.com', 'bettor3', userPasswordHash, 1000]);
    
    // Add initial transaction records
    console.log('Adding transaction records...');
    const users = await client.query('SELECT id, username FROM users');
    
    for (const user of users.rows) {
      const points = user.username === 'admin' ? 10000 : 1000;
      await client.query(`
        INSERT INTO transactions (user_id, type, amount, description) 
        VALUES ($1, $2, $3, $4)
      `, [user.id, 'initial_points', points, 'Welcome bonus points']);
    }
    
    console.log('Users created successfully!');
    console.log('');
    console.log('=== LOGIN CREDENTIALS ===');
    console.log('Admin User:');
    console.log('  Email: admin@pronostika.com');
    console.log('  Password: admin123');
    console.log('');
    console.log('Regular Users:');
    console.log('  Email: user1@example.com');
    console.log('  Password: user123');
    console.log('  (Also user2@example.com and user3@example.com with same password)');
    console.log('========================');
    
  } catch (error) {
    console.error('Error creating users:', error);
  } finally {
    await client.end();
  }
}

createRealUsers();