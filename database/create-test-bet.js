const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:JUegfJDwFOFzYUgdMKUdvUxZjBZkdYNI@junction.proxy.rlwy.net:43522/railway',
  ssl: { rejectUnauthorized: false }
});

async function createTestBet() {
  try {
    console.log('🎯 Creating test bet directly in database...\n');
    
    // First, check/create a category
    let categoryResult = await pool.query('SELECT id FROM bet_categories LIMIT 1');
    let categoryId;
    
    if (categoryResult.rows.length === 0) {
      console.log('📝 Creating default category...');
      const newCategory = await pool.query(
        'INSERT INTO bet_categories (name, description) VALUES ($1, $2) RETURNING id',
        ['Sports', 'Sports betting category']
      );
      categoryId = newCategory.rows[0].id;
      console.log(`✅ Created category with ID: ${categoryId}`);
    } else {
      categoryId = categoryResult.rows[0].id;
      console.log(`✅ Using existing category ID: ${categoryId}`);
    }

    // Get admin user
    const userResult = await pool.query('SELECT id FROM users WHERE is_admin = true LIMIT 1');
    if (userResult.rows.length === 0) {
      console.log('❌ No admin user found! Creating one...');
      const adminUser = await pool.query(
        'INSERT INTO users (email, username, password_hash, is_admin) VALUES ($1, $2, $3, $4) RETURNING id',
        ['admin@pronostika.com', 'admin', '$2a$12$dummy.hash.for.testing', true]
      );
      var userId = adminUser.rows[0].id;
      console.log(`✅ Created admin user with ID: ${userId}`);
    } else {
      var userId = userResult.rows[0].id;
      console.log(`✅ Using existing admin user ID: ${userId}`);
    }

    // Create the bet
    console.log('🎲 Creating test bet...');
    const betResult = await pool.query(
      `INSERT INTO bets (title, description, category_id, created_by, status)
       VALUES ($1, $2, $3, $4, 'active')
       RETURNING id, title`,
      ['Will it rain tomorrow in CDMX?', 'Weather prediction bet for Mexico City', categoryId, userId]
    );
    
    const betId = betResult.rows[0].id;
    console.log(`✅ Created bet: "${betResult.rows[0].title}" with ID: ${betId}`);

    // Create bet options
    console.log('📊 Adding bet options...');
    const option1 = await pool.query(
      'INSERT INTO bet_options (bet_id, text, odds) VALUES ($1, $2, $3) RETURNING id, text, odds',
      [betId, 'Yes', 2.0]
    );
    
    const option2 = await pool.query(
      'INSERT INTO bet_options (bet_id, text, odds) VALUES ($1, $2, $3) RETURNING id, text, odds',
      [betId, 'No', 1.5]
    );
    
    console.log(`✅ Option 1: "${option1.rows[0].text}" (${option1.rows[0].odds}x)`);
    console.log(`✅ Option 2: "${option2.rows[0].text}" (${option2.rows[0].odds}x)`);

    console.log('\n🎉 SUCCESS! Test bet created successfully!');
    console.log('📱 You should now see this bet on your website at:');
    console.log('   https://pronostika.com.mx/bets');
    console.log('   https://pronostika.com.mx/admin');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

createTestBet();