import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

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

  @CreatedAt
  createdat: Date;

  @UpdatedAt
  updatedat: Date;
}
