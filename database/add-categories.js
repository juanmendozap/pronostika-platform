const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:JUegfJDwFOFzYUgdMKUdvUxZjBZkdYNI@junction.proxy.rlwy.net:43522/railway',
  ssl: { rejectUnauthorized: false }
});

async function addDefaultCategories() {
  try {
    console.log('Adding default categories...');
    
    const categories = [
      { name: 'Sports', description: 'Sports betting and predictions' },
      { name: 'Politics', description: 'Political events and elections' },
      { name: 'Entertainment', description: 'Movies, TV shows, and celebrity events' },
      { name: 'Technology', description: 'Tech company events and product launches' },
      { name: 'Weather', description: 'Weather predictions and climate events' }
    ];

    for (const category of categories) {
      // Check if category already exists
      const existing = await pool.query(
        'SELECT id FROM bet_categories WHERE name = $1',
        [category.name]
      );

      if (existing.rows.length === 0) {
        await pool.query(
          'INSERT INTO bet_categories (name, description) VALUES ($1, $2)',
          [category.name, category.description]
        );
        console.log(`✅ Added category: ${category.name}`);
      } else {
        console.log(`⚠️ Category already exists: ${category.name}`);
      }
    }

    // Show all categories
    const result = await pool.query('SELECT * FROM bet_categories ORDER BY name');
    console.log('\n📋 All categories:');
    result.rows.forEach(cat => {
      console.log(`- ID: ${cat.id}, Name: ${cat.name}, Description: ${cat.description}`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

addDefaultCategories();