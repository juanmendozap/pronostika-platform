const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:GekmdnNLRAibcpBttYEeqkfZGlSajiBV@tramway.proxy.rlwy.net:15989/railway'
});

async function checkTables() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Check users table structure
    console.log('\n=== USERS TABLE STRUCTURE ===');
    const usersResult = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `);
    console.log(usersResult.rows);

    // Check categories table structure
    console.log('\n=== CATEGORIES TABLE STRUCTURE ===');
    const categoriesResult = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'categories' 
      ORDER BY ordinal_position;
    `);
    console.log(categoriesResult.rows);

    // Check all tables
    console.log('\n=== ALL TABLES ===');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log(tablesResult.rows);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkTables();