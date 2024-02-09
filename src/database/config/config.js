import config from '../../config';

module.exports = {
  development: {
    logging,
    dialect: 'postgres',
    migrationStorageTableName: 'sequelizemeta',
    schema: config.database.schema,
  },
};
