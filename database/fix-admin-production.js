const { Pool } = require('pg');

// Production database connection (same as your Railway backend uses)
const pool = new Pool({
  connectionString: 'postgresql://postgres:JUegfJDwFOFzYUgdMKUdvUxZjBZkdYNI@junction.proxy.rlwy.net:43522/railway',
  ssl: { rejectUnauthorized: false }
});

async function makeUserAdminDirectly() {
  try {
    console.log('🔍 Connecting to production database...');
    
    // First, let's see what users exist
    const usersResult = await pool.query(`
      SELECT id, email, username, is_admin, created_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 10;
    `);
    
    console.log('\n📋 Current users in database:');
    console.log('=' .repeat(60));
    
    if (usersResult.rows.length === 0) {
      console.log('❌ No users found in database!');
      return;
    }
    
    usersResult.rows.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.username})`);
      console.log(`   Admin: ${user.is_admin ? '✅ YES' : '❌ NO'}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Created: ${user.created_at}`);
      console.log('-'.repeat(40));
    });

    // Find the user that looks like the admin (you can modify this logic)
    let targetUser = null;
    
    // Option 1: Look for user with "admin" in username
    targetUser = usersResult.rows.find(u => u.username.toLowerCase().includes('admin'));
    
    // Option 2: If no admin username, take the first user
    if (!targetUser) {
      targetUser = usersResult.rows[0];
    }
    
    console.log(`\n🎯 Target user: ${targetUser.email} (${targetUser.username})`);
    
    if (targetUser.is_admin) {
      console.log('✅ User is already an admin!');
      return;
    }

    console.log('🔄 Making user admin...');
    
    // Update user to admin
    const updateResult = await pool.query(`
      UPDATE users 
      SET is_admin = true 
      WHERE id = $1 
      RETURNING id, email, username, is_admin;
    `, [targetUser.id]);
    
    if (updateResult.rows.length > 0) {
      const updatedUser = updateResult.rows[0];
      console.log('\n🎉 SUCCESS!');
      console.log(`✅ ${updatedUser.email} (${updatedUser.username}) is now an admin!`);
      console.log(`📧 Admin Status: ${updatedUser.is_admin}`);
      
      console.log('\n🌐 Now you can access admin features at:');
      console.log('   • https://www.pronostika.com.mx/admin');
      console.log('   • Create bets, manage categories, etc.');
      console.log('\n💡 Just refresh your browser and try creating a bet again!');
    } else {
      console.log('❌ Failed to update user');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if database connection string is correct');
    console.log('2. Verify network connectivity');
    console.log('3. Make sure user exists in database');
  } finally {
    await pool.end();
  }
}

// Run the function
makeUserAdminDirectly();