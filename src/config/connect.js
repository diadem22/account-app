import { Pool } from 'pg';

import config from '../database/config/config';

// Create a new pool instance using the database configuration
const pool = new Pool({
  user: config.database.username,
  host: config.database.host,
  database: config.database.name,
  password: config.database.password,
  port: config.database.port,
  ssl: {
    // Set SSL options for secure connection (required for Google Cloud SQL)
    rejectUnauthorized: false,
  },
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to database:', res.rows[0].now);
  }
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Error in PostgreSQL client:', err);
});

// Export the pool for use in other modules
export default pool;
