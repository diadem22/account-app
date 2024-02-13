import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from '../../account/account.controller';
import { AccountService } from '../../account/account.service';
import { Response } from 'express';
import { Sequelize } from 'sequelize-typescript';
import { UserAGuard } from '../../guard/usera.guard';
import { BadRequestException } from '@nestjs/common';
import SequelizeMock from 'sequelize-mock';

class MockSequelize {}

describe('AccountController', () => {
  let controller: AccountController;
  let accountService: AccountService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let guard: UserAGuard;
  let sequelizeMock;
  let Account;

  beforeAll(() => {
    sequelizeMock = new SequelizeMock();
    Account = sequelizeMock.define('Account', {
      id: 1,
      user_id: 1,
      companyName: 'NewCompany',
      numberOfUsers: 20,
      numberOfProducts: 10,
      percentage: 200,
    });
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: AccountService,
          useValue: {
            createAccount: jest.fn(),
            updateAccount: jest.fn(),
            viewAccountData: jest.fn(),
            uploadImage: jest.fn(),
          },
        },
        UserAGuard,
        { provide: Sequelize, useClass: MockSequelize },
      ],
    }).compile();

    guard = module.get<UserAGuard>(UserAGuard);
    controller = module.get<AccountController>(AccountController);
    accountService = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createAccount', () => {
    it('should create an account', async () => {
      const userId = 1;
      const accountDto = {
        userId,
        companyName: 'Company',
        numberOfUsers: 20,
        numberOfProducts: 10,
      };
      const createdAccount = { ...accountDto };

      Account.$queueResult(Account.build(accountDto));

      jest
        .spyOn(accountService, 'createAccount')
        .mockResolvedValueOnce(accountDto as any);

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.createAccount(userId, accountDto, res as Response);

      expect(accountService.createAccount).toHaveBeenCalledWith(
        userId,
        accountDto.companyName,
        accountDto.numberOfUsers,
        accountDto.numberOfProducts,
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Account successfully created',
        data: createdAccount,
      });
    });

    it('should handle create account failure', async () => {
      const userId = 1;
      const accountDto = {
        companyName: 'Company',
        numberOfUsers: 10,
        numberOfProducts: 5,
      };
      const errorMessage = 'Failed to create account';

      jest
        .spyOn(accountService, 'createAccount')
        .mockRejectedValueOnce(new Error(errorMessage));

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.createAccount(userId, accountDto, res as Response);

      expect(accountService.createAccount).toHaveBeenCalledWith(
        userId,
        accountDto.companyName,
        accountDto.numberOfUsers,
        accountDto.numberOfProducts,
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Account not successfully created',
        error: errorMessage,
      });
    });
  });

  describe('updateAccount', () => {
    it('should update an account successfully', async () => {
      const account_id = 1;
      const updateAccountDto = {
        companyName: 'NewCompany',
        numberOfUsers: 20,
        numberOfProducts: 10,
      };
      const updatedAccount = { id: account_id, ...updateAccountDto };

      jest
        .spyOn(accountService, 'updateAccount')
        .mockResolvedValueOnce(updatedAccount as any);

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.updateAccount(
        account_id,
        updateAccountDto,
        res as Response,
      );

      expect(accountService.updateAccount).toHaveBeenCalledWith(
        account_id,
        updateAccountDto.companyName,
        updateAccountDto.numberOfUsers,
        updateAccountDto.numberOfProducts,
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Account successfully updated',
        data: updatedAccount,
      });
    });

    it('should handle update account failure', async () => {
      const account_id = 1;
      const updateAccountDto = {
        companyName: 'InvalidCompanyName',
        numberOfUsers: 20,
        numberOfProducts: 10,
      };
      const errorMessage = 'Invalid company name';

      jest
        .spyOn(accountService, 'updateAccount')
        .mockRejectedValueOnce(new Error(errorMessage));

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.updateAccount(
        account_id,
        updateAccountDto,
        res as Response,
      );

      expect(accountService.updateAccount).toHaveBeenCalledWith(
        account_id,
        updateAccountDto.companyName,
        updateAccountDto.numberOfUsers,
        updateAccountDto.numberOfProducts,
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Account not successfully updated',
        error: errorMessage,
      });
    });
  });

  describe('viewAccountData', () => {
    it('should retrieve account data successfully', async () => {
      const account_id = 1;

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.viewAccountData(account_id, res as Response);

      expect(accountService.viewAccountData).toHaveBeenCalledWith(account_id);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle account not found error', async () => {
      const account_id = 75;
      const errorMessage = 'Account not found';
      const accountDto = {
        id: 2,
        user_id: 2,
        companyName: 'Company',
        numberOfUsers: 20,
        numberOfProducts: 10,
      };

      Account.$queueResult(Account.build(accountDto));

      jest
        .spyOn(accountService, 'viewAccountData')
        .mockRejectedValueOnce(new Error(errorMessage));

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.viewAccountData(account_id, res as Response);

      expect(accountService.viewAccountData).toHaveBeenCalledWith(account_id);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error retrieving data',
        error: errorMessage,
      });
    });
  });

  describe('uploadImage', () => {
    it('should upload an image successfully', async () => {
      const account_id = 1;
      const file: any = {
        buffer: Buffer.from('mock-image-data'),
        originalname: 'image.jpg',
        mimetype: 'image/jpeg',
      };

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.uploadImage(file, account_id, res as Response);

      expect(accountService.uploadImage).toHaveBeenCalledWith(
        account_id,
        file.buffer,
        file.originalname,
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle missing or invalid image file', async () => {
      const account_id = 1;
      const file: any = null;

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      try {
        await controller.uploadImage(file, account_id, res as Response);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('Only image files are allowed.');
      }

      expect(accountService.uploadImage).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
