import { Sequelize } from 'sequelize';
import UserAModel from './userA';
import UserBModel from './userB';
import config from '../config/index'; // Assuming you have a separate config file

// Create a new Sequelize instance
const sequelize = new Sequelize(
  config.config.database.name,
  config.config.database.username,
  config.config.database.password,
  {
    host: config.config.database.host,
    port: config.config.database.port,
    dialect: 'postgres', // or any other supported dialect
    logging: false, // Disable logging by default
    // Other Sequelize options...
  },
);

const UserA = new UserAModel(sequelize);
const UserB = new UserBModel(sequelize);

export { sequelize, UserA, UserB };
