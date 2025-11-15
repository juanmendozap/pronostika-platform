require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'pronostika'
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    
    console.log('Running schema setup...');
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await client.query(schemaSQL);
    console.log('Schema created successfully!');
    
    console.log('Running seed data...');
    const seedSQL = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    await client.query(seedSQL);
    console.log('Seed data inserted successfully!');
    
    console.log('Database setup completed!');
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupDatabase();