const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:JUegfJDwFOFzYUgdMKUdvUxZjBZkdYNI@junction.proxy.rlwy.net:43522/railway',
  ssl: { rejectUnauthorized: false }
});

async function makeUserAdmin() {
  try {
    // First, let's check if there are any users
    const usersResult = await pool.query(`
      SELECT id, email, username, is_admin 
      FROM users 
      ORDER BY created_at DESC;
    `);
    
    console.log('Current users:');
    console.log('='.repeat(50));
    usersResult.rows.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.username}) - Admin: ${user.is_admin ? 'YES' : 'NO'}`);
    });

    if (usersResult.rows.length === 0) {
      console.log('No users found! Please create a user first.');
      return;
    }

    // Get the first user (or you can modify this to target a specific user)
    const firstUser = usersResult.rows[0];
    
    if (firstUser.is_admin) {
      console.log(`\nUser ${firstUser.email} is already an admin!`);
    } else {
      // Make the first user an admin
      await pool.query(`
        UPDATE users 
        SET is_admin = true 
        WHERE id = $1;
      `, [firstUser.id]);
      
      console.log(`\n✅ SUCCESS: Made ${firstUser.email} (${firstUser.username}) an admin!`);
    }

    // Verify the change
    const verifyResult = await pool.query(`
      SELECT email, username, is_admin 
      FROM users 
      WHERE id = $1;
    `, [firstUser.id]);
    
    const updatedUser = verifyResult.rows[0];
    console.log(`\nVerification: ${updatedUser.email} - Admin: ${updatedUser.is_admin ? 'YES' : 'NO'}`);

  } catch (error) {
    console.error('Error making user admin:', error);
  } finally {
    await pool.end();
  }
}

// If you want to make a specific user admin, you can also do it by email:
async function makeSpecificUserAdmin(email) {
  try {
    const result = await pool.query(`
      UPDATE users 
      SET is_admin = true 
      WHERE email = $1 
      RETURNING email, username, is_admin;
    `, [email]);
    
    if (result.rows.length === 0) {
      console.log(`User with email ${email} not found!`);
    } else {
      console.log(`✅ SUCCESS: Made ${result.rows[0].email} an admin!`);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

// Run the function
makeUserAdmin();

// Uncomment and modify the line below if you want to make a specific user admin:
// makeSpecificUserAdmin('your-email@example.com');