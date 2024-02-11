import { Sequelize } from 'sequelize-typescript';
import { Account } from './account';
import { User } from './users';
import config from '../config/index';

// Create a new Sequelize instance
const sequelize = new Sequelize(config.database.url, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: true,
  },
});

sequelize.addModels([User, Account]);

export default sequelize;
