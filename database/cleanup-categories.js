const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:GekmdnNLRAibcpBttYEeqkfZGlSajiBV@tramway.proxy.rlwy.net:15989/railway'
});

async function cleanupCategories() {
  try {
    await client.connect();
    console.log('Starting category cleanup...');

    // Delete duplicate categories (keep the lower IDs)
    const duplicatesToDelete = [12, 10, 9, 14, 8, 11, 13]; // Higher IDs
    
    for (const id of duplicatesToDelete) {
      const result = await client.query('DELETE FROM categories WHERE id = $1', [id]);
      console.log(`Deleted category with ID ${id}`);
    }

    // Add Finance category
    await client.query(
      "INSERT INTO categories (name, description, color) VALUES ($1, $2, $3)",
      ['Finance', 'Financial markets, stocks, bonds, and economic predictions', '#065F46']
    );
    console.log('Added Finance category');

    // Check final result
    const finalResult = await client.query('SELECT id, name, description FROM categories ORDER BY name');
    console.log('\nFinal categories:');
    finalResult.rows.forEach(cat => {
      console.log(`ID: ${cat.id}, Name: ${cat.name}`);
    });

    console.log(`\nTotal categories after cleanup: ${finalResult.rows.length}`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

cleanupCategories();