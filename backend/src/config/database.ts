import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Handle both individual DB config and connection string
const getDatabaseConfig = () => {
  if (process.env.DATABASE_URL) {
    // Use connection string (Railway/Heroku style)
    return {
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    };
  } else {
    // Use individual environment variables (local development)
    return {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'pronostika',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };
  }
};

const pool = new Pool(getDatabaseConfig());

export { pool };