import { DataTypes, Model, Sequelize } from 'sequelize';
import { User } from './users';

interface UserAAttributes {
  id: number;
  user_id: number;
  companyName: string;
  numberOfUsers: number;
  numberOfProducts: number;
  percentage: number;
  createdAt: Date;
  updatedAt: Date;
}

class UserA extends Model<UserAAttributes> implements UserAAttributes {
  public id!: number;
  public user_id!: number;
  public companyName!: string;
  public numberOfUsers!: number;
  public numberOfProducts!: number;
  public percentage!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initialize(sequelize: Sequelize) {
    UserA.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: User,
            key: 'id',
          },
        },
        companyName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        numberOfUsers: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        numberOfProducts: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        percentage: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      },
      {
        sequelize,
        tableName: 'usera',
        modelName: 'UserA',
        timestamps: false,
      },
    );
  }

  static associate(models: any) {
    UserA.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  }
}

export default UserA;
