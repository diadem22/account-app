import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

export enum UserType {
  A = 'A',
  B = 'B',
}

@Table({ tableName: 'users', timestamps: false })
export class User extends Model<User> {
  @Column
  uuid: string;

  @Column
  username: string;

  @Column
  email: string;

  @Column
  password: string;

  @Column(DataType.ENUM(UserType.A, UserType.B))
  userType: UserType;

  @CreatedAt
  createdDatetime: Date;

  @UpdatedAt
  updatedDatetime: Date;
}
