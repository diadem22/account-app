import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { Account } from '../models/account';

@Module({
  imports: [SequelizeModule.forFeature([Account])],
  providers: [AccountService],
  controllers: [AccountController],
})
export class AccountModule {}
