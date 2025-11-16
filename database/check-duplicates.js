const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:GekmdnNLRAibcpBttYEeqkfZGlSajiBV@tramway.proxy.rlwy.net:15989/railway'
});

async function checkCategories() {
  try {
    await client.connect();
    const result = await client.query('SELECT id, name, description FROM categories ORDER BY name, id');
    
    console.log('Categories in database:');
    result.rows.forEach(cat => {
      console.log(`ID: ${cat.id}, Name: ${cat.name}`);
    });
    
    // Check for duplicates
    const names = result.rows.map(r => r.name);
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
    if (duplicates.length > 0) {
      console.log('\nDuplicate categories found:', [...new Set(duplicates)]);
      
      // Show which IDs are duplicates
      const duplicateNames = [...new Set(duplicates)];
      duplicateNames.forEach(dupName => {
        const matches = result.rows.filter(r => r.name === dupName);
        console.log(`"${dupName}" appears ${matches.length} times with IDs: ${matches.map(m => m.id).join(', ')}`);
      });
    } else {
      console.log('\nNo duplicates found');
    }
    
    console.log(`\nTotal categories: ${result.rows.length}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

checkCategories();