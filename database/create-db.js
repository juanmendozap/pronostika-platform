require('dotenv').config();
const { Client } = require('pg');

async function createDatabase() {
  // Connect to the default postgres database first
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: 'postgres' // Connect to default postgres database
  });

  try {
    console.log('Connecting to PostgreSQL...');
    await client.connect();
    
    console.log('Creating database "pronostika"...');
    await client.query('CREATE DATABASE pronostika;');
    console.log('Database "pronostika" created successfully!');
    
  } catch (error) {
    if (error.code === '42P04') {
      console.log('Database "pronostika" already exists!');
    } else {
      console.error('Error creating database:', error.message);
    }
  } finally {
    await client.end();
  }
}

createDatabase();