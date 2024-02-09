import { DataTypes, QueryInterface } from 'sequelize';
import config from '../../config';

const { userA } = config.config.tableNames;

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable(userA, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      companyName: {
        type: DataTypes.STRING,
      },
      numberOfUsers: {
        type: DataTypes.INTEGER,
      },
      numberOfProducts: {
        type: DataTypes.INTEGER,
      },
      percentage: {
        type: DataTypes.FLOAT,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('UserA');
  },
};

// import { Sequelize } from 'sequelize';

// const sequelize = new Sequelize({
//   dialect: 'postgres',
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   database: process.env.DB_NAME,
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
// });
