// src/models/userB.ts

import { DataTypes, Model, Sequelize } from 'sequelize';
import UserA from './userA';
import { User } from './users';

interface UserBAttributes {
  id: number;
  user_id: number;
  userAId: number; // Foreign key referencing UserA table
  name: string;
  imageName: string;
  imageUrl: string;
  uploadedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

class UserB extends Model<UserBAttributes> implements UserBAttributes {
  public id!: number;
  public user_id!: number;
  public userAId!: number;
  public name!: string;
  public imageName!: string;
  public imageUrl!: string;
  public uploadedAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initialize(sequelize: Sequelize) {
    UserB.init(
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
        userAId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: UserA,
            key: 'id',
          },
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        imageName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        imageUrl: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        uploadedAt: {
          type: DataTypes.DATE,
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
        tableName: 'userb',
        modelName: 'UserB',
        timestamps: true,
        underscored: true,
      },
    );
  }
  static associate(models: any) {
    UserB.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    UserB.belongsTo(models.UserA, {
      foreignKey: 'userAId',
      as: 'userA',
    });
  }
}

export default UserB;
