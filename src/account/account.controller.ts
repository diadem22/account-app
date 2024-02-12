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
  BadRequestException,
  UsePipes,
} from '@nestjs/common';
import { Response } from 'express';
import { AccountService } from './account.service';
import { AccountDto } from '../dto/account.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserAGuard } from 'src/guard/usera.guard';
import { UserViewGuard } from 'src/guard/user-view.guard';
import { UserBGuard } from 'src/guard/userb.guide';
import { JoiValidationPipe } from '../joi/joi-validation.pipe';
import {
  createAccountSchema,
  updateAccountSchema,
} from '../schemas/account-schema';

@Controller({ path: 'account' })
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('create/:user_id')
  @UsePipes(new JoiValidationPipe(createAccountSchema))
  @UseGuards(AuthGuard, UserAGuard)
  async createAccount(
    @Param('user_id') user_id: number,
    @Body() createAccountDto: AccountDto,
    @Res() res: Response,
  ) {
    const { companyName, numberOfUsers, numberOfProducts } = createAccountDto;
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

  @Put('update/:user_id')
  @UsePipes(new JoiValidationPipe(updateAccountSchema))
  @UseGuards(AuthGuard, UserAGuard)
  async updateAccount(
    @Param('user_id') user_id: number,
    @Body() updateAccountDto: AccountDto,
    @Res() res: Response,
  ) {
    const { companyName, numberOfUsers, numberOfProducts } = updateAccountDto;
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
    if (!file || !file.buffer || !file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed.');
    }
    try {
      const account = await this.accountService.uploadImage(
        account_id,
        file.buffer,
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
