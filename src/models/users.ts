import { DataTypes, Model, Sequelize } from 'sequelize';

enum UserType {
  A = 'A',
  B = 'B',
}

interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  userType: UserType;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public userType!: UserType;

  static initialize(sequelize: Sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        userType: {
          type: DataTypes.ENUM(...Object.values(UserType)),
          allowNull: false,
          defaultValue: UserType.A,
        },
      },
      {
        sequelize,
        tableName: 'users',
        modelName: 'User',
        timestamps: false,
      },
    );
  }

  static associate(models: any) {
    User.hasOne(models.UserA);
    User.hasOne(models.UserB);
  }
}

export { User, UserType };
