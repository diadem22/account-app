import { config as _config } from 'dotenv';
import { Sequelize } from 'sequelize';

// Load environment variables from .env file
const envFound = _config({
  path: `./.env${process.env.APP_ENV ? `.${process.env.APP_ENV}` : ''}`,
});

if (envFound.error) {
  throw new Error('Ooops! Seems like you have not created a .env file');
}

const {
  DATABASE_URI,
  DATABASE_NAME,
  DATABASE_PORT,
  DATABASE_HOST,
  DATABASE_USERNAME,
  DATABASE_SCHEMA,
  DATABASE_PASSWORD,
} = process.env;

const sequelizeConnection = new Sequelize({
  dialect: 'postgres',
  host: DATABASE_HOST || '',
  port: Number(DATABASE_PORT) || 0,
  database: DATABASE_NAME || '',
  username: DATABASE_USERNAME || '',
  password: DATABASE_PASSWORD || '',
});

// Test the database connection
sequelizeConnection
  .authenticate()
  .then(() => {
    console.log(
      'Connection to the database has been established successfully.',
    );
  })
  .catch((error: Error) => {
    console.error('Unable to connect to the database:', error);
  });

// Export config and sequelize together
export default {
  config: {
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
  },
  sequelizeConnection,
};
