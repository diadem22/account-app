import { Table, Column, Model, DataType } from 'sequelize-typescript';

export enum UserType {
  A = 'A',
  B = 'B',
}

@Table({ tableName: 'users', timestamps: false })
export class User extends Model<User> {
  @Column({ allowNull: false })
  uuid: string;

  @Column({ allowNull: false })
  username: string;

  @Column({ allowNull: false })
  email: string;

  @Column({ allowNull: false })
  password: string;

  @Column({ allowNull: false, field: 'usertype' })
  userType: UserType;

  @Column({ allowNull: false, field: 'createdat', defaultValue: DataType.NOW })
  createdat: Date;

  @Column({ allowNull: false, field: 'createdat', defaultValue: DataType.NOW })
  updatedat: Date;
}
