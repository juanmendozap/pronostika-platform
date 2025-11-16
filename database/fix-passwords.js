const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const client = new Client({
  connectionString: 'postgresql://postgres:GekmdnNLRAibcpBttYEeqkfZGlSajiBV@tramway.proxy.rlwy.net:15989/railway'
});

async function fixPasswords() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Create proper password hashes
    const adminPasswordHash = await bcrypt.hash('admin123', 12);
    const userPasswordHash = await bcrypt.hash('user123', 12);

    console.log('Generated password hashes...');

    // Update admin password
    await client.query(
      'UPDATE users SET password_hash = $1 WHERE email = $2',
      [adminPasswordHash, 'admin@pronostika.com']
    );
    console.log('✅ Updated admin password');

    // Update user passwords
    const userEmails = ['user1@example.com', 'user2@example.com', 'user3@example.com'];
    for (const email of userEmails) {
      await client.query(
        'UPDATE users SET password_hash = $1 WHERE email = $2',
        [userPasswordHash, email]
      );
      console.log(`✅ Updated password for ${email}`);
    }

    console.log('\n🎉 All passwords updated successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('Admin: admin@pronostika.com / admin123');
    console.log('Users: user1@example.com / user123');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

fixPasswords();