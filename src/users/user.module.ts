// user.module.ts

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { User } from '../models/users';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
