import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DB_URI;

const pool = new Pool({
  connectionString: connectionString,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error executing query', err);
  } else {
    console.log('Connected to PostgreSQL:', res.rows[0].now);
  }
});

pool.on('error', (err) => {
  console.error('Error occurred in PostgreSQL client', err);
});

process.on('exit', () => {
  pool.end();
});
