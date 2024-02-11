import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './users';

@Table({ tableName: 'account', timestamps: false })
export class Account extends Model<Account> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  user_id: number;

  @Column({ allowNull: false, field: 'companyname' })
  companyName: string;

  @Column({ allowNull: false, field: 'numberofusers' })
  numberOfUsers: number;

  @Column({ allowNull: false, field: 'numberofproducts' })
  numberOfProducts: number;

  @Column({ allowNull: false })
  percentage: number;

  @Column({ allowNull: true, field: 'imagename' })
  imageName: string;

  @Column(DataType.BLOB)
  image: Buffer;

  @Column({ allowNull: false, field: 'createdat', defaultValue: DataType.NOW })
  createdAt: Date;

  @Column({ allowNull: false, field: 'updatedat', defaultValue: DataType.NOW })
  updatedAt: Date;

  @BelongsTo(() => User)
  user: User;
}
