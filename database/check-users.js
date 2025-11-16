const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:GekmdnNLRAibcpBttYEeqkfZGlSajiBV@tramway.proxy.rlwy.net:15989/railway'
});

async function checkUsers() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Check all users
    console.log('\n=== ALL USERS ===');
    const usersResult = await client.query('SELECT id, email, username, points, is_admin FROM users');
    console.log(usersResult.rows);

    // Check password hashes
    console.log('\n=== USER PASSWORDS ===');
    const passwordResult = await client.query('SELECT email, password_hash FROM users LIMIT 3');
    passwordResult.rows.forEach(row => {
      console.log(`${row.email}: ${row.password_hash ? 'Has password hash' : 'NO PASSWORD HASH'}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkUsers();