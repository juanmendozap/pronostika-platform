const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:JUegfJDwFOFzYUgdMKUdvUxZjBZkdYNI@junction.proxy.rlwy.net:43522/railway',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function checkAdminUsers() {
  try {
    // Check all users and their admin status
    const usersResult = await pool.query(`
      SELECT id, email, username, is_admin, created_at 
      FROM users 
      ORDER BY is_admin DESC, id;
    `);
    
    console.log('All users in database:');
    console.log('='.repeat(80));
    usersResult.rows.forEach(user => {
      console.log(`ID: ${user.id}`);
      console.log(`Email: ${user.email}`);
      console.log(`Username: ${user.username}`);
      console.log(`Admin: ${user.is_admin ? 'YES' : 'NO'}`);
      console.log(`Created: ${user.created_at}`);
      console.log('-'.repeat(40));
    });

    // Check specifically admin users
    const adminResult = await pool.query(`
      SELECT id, email, username, created_at 
      FROM users 
      WHERE is_admin = true;
    `);
    
    console.log('\nAdmin users only:');
    console.log('='.repeat(50));
    if (adminResult.rows.length === 0) {
      console.log('No admin users found!');
    } else {
      adminResult.rows.forEach(admin => {
        console.log(`Admin: ${admin.email} (${admin.username})`);
      });
    }

    // Check password hash for first admin (to see if it's properly hashed)
    if (adminResult.rows.length > 0) {
      const passwordResult = await pool.query(`
        SELECT email, password 
        FROM users 
        WHERE is_admin = true 
        LIMIT 1;
      `);
      
      console.log('\nPassword hash check:');
      console.log('Email:', passwordResult.rows[0].email);
      console.log('Password hash starts with:', passwordResult.rows[0].password.substring(0, 10) + '...');
      console.log('Hash length:', passwordResult.rows[0].password.length);
    }

  } catch (error) {
    console.error('Error checking admin users:', error);
  } finally {
    await pool.end();
  }
}

checkAdminUsers();