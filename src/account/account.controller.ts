import {
  Controller,
  Post,
  Body,
  Put,
  Get,
  Param,
  UseGuards,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Response } from 'express';
import { AccountService } from './account.service';
import { CreateAccountDto } from '../dto/account.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserAGuard } from 'src/guard/usera.guard';
import { UserViewGuard } from 'src/guard/user-view.guard';
import { UserBGuard } from 'src/guard/userb.guide';

@Controller({ path: 'account' })
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('create')
  @UseGuards(AuthGuard, UserAGuard)
  async createAccount(
    @Body()
    createAccountDto: CreateAccountDto,
    @Res() res: Response,
  ) {
    const { user_id, companyName, numberOfUsers, numberOfProducts } =
      createAccountDto;
    try {
      const account = await this.accountService.createAccount(
        user_id,
        companyName,
        numberOfUsers,
        numberOfProducts,
      );

      res.status(200).json({
        message: 'Account successfully created',
        data: account,
      });
    } catch (error) {
      res.status(400).json({
        message: 'Account not successfully created',
        error: error.message,
      });
    }
  }

  @Put('update-account')
  @UseGuards(AuthGuard, UserAGuard)
  async updateAccount(
    @Body() updateAccountDto: CreateAccountDto,
    @Res() res: Response,
  ) {
    const { user_id, companyName, numberOfUsers, numberOfProducts } =
      updateAccountDto;
    try {
      const account = await this.accountService.updateAccount(
        user_id,
        companyName,
        numberOfUsers,
        numberOfProducts,
      );
      res.status(200).json({
        message: 'Account successfully updated',
        data: account,
      });
    } catch (error) {
      res.status(400).json({
        message: 'Account not successfully updated',
        error: error.message,
      });
    }
  }

  @Get('view-data/:user_id')
  @UseGuards(AuthGuard, UserViewGuard)
  async viewAccountData(
    @Param('user_id') user_id: number,
    @Res() res: Response,
  ) {
    try {
      const account = await this.accountService.viewAccountData(user_id);

      res.status(200).json({
        message: 'Account Data successfully retrieved',
        data: account,
      });
    } catch (error) {
      res.status(400).json({
        message: 'Error retrieving data',
        error: error.message,
      });
    }
  }

  @Put('upload/:account_id')
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AuthGuard, UserBGuard)
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('account_id') account_id: number,
    @Res() res: Response,
  ) {
    const image = file.buffer;
    try {
      const account = await this.accountService.uploadImage(
        account_id,
        image,
        file.originalname,
      );
      res.status(200).json({
        message: 'Image successfully uploaded',
        data: account,
      });
    } catch (error) {
      res.status(400).json({
        message: 'Image not successfully uploaded',
        error: error.message,
      });
    }
  }
}
