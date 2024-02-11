import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const {
  DATABASE_URI,
  DATABASE_NAME,
  DATABASE_PORT,
  DATABASE_HOST,
  DATABASE_USERNAME,
  DATABASE_SCHEMA,
  DATABASE_PASSWORD,
} = process.env;

const itemsPool = new Pool({
  connectionString: DATABASE_URI,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default {
  database: {
    url: DATABASE_URI,
    name: DATABASE_NAME,
    DATABASE_SCHEMA,
    port: Number(DATABASE_PORT),
    host: DATABASE_HOST,
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
  },
  tableNames: {
    userA: 'userA',
    userB: 'userB',
  },
  itemsPool,
};
