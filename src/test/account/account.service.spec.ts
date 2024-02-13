import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from '../../account/account.service';
import { Account } from '../../models/account';
import { getModelToken } from '@nestjs/sequelize';
import SequelizeMock from 'sequelize-mock';

describe('AccountService', () => {
  let service: AccountService;
  let accountModelMock: typeof Account;
  let sequelizeMock;
  let BuildAccount;

  beforeAll(() => {
    sequelizeMock = new SequelizeMock();
    BuildAccount = sequelizeMock.define('Account', {
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
      providers: [
        AccountService,
        {
          provide: getModelToken(Account),
          useValue: createMock<typeof Account>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<AccountService>(AccountService);
    accountModelMock = module.get<typeof Account>(getModelToken(Account));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAccount', () => {
    it('should create an account', async () => {
      const mockAccountData = {
        user_id: 1,
        companyName: 'NewCompany',
        numberOfUsers: 10,
        numberOfProducts: 5,
        percentage: 200,
      };

      BuildAccount.$queueResult(BuildAccount.build(mockAccountData));

      await accountModelMock.create({
        user_id: 1,
        companyName: 'NewCompany',
        numberOfUsers: 10,
        numberOfProducts: 5,
        percentage: 200,
      });

      await service.createAccount(
        mockAccountData.user_id,
        mockAccountData.companyName,
        mockAccountData.numberOfUsers,
        mockAccountData.numberOfProducts,
      );

      expect(service).toBeDefined();

      expect(accountModelMock.create).toHaveBeenCalledWith({
        user_id: 1,
        companyName: 'NewCompany',
        numberOfUsers: 10,
        numberOfProducts: 5,
        percentage: 200,
      });
    });
  });

  describe('updateAccount', () => {
    it('should update an account', async () => {
      const account_id = 1;
      const companyName = 'Test Company';
      const numberOfUsers = 10;
      const numberOfProducts = 5;

      accountModelMock.update(
        {
          numberOfProducts: numberOfProducts,
          numberOfUsers: numberOfUsers,
          companyName: companyName,
          percentage: (numberOfProducts / numberOfUsers) * 100,
        },
        { where: { id: account_id }, returning: true },
      );

      await service.updateAccount(
        account_id,
        companyName,
        numberOfUsers,
        numberOfProducts,
      );
      expect(accountModelMock.update).toHaveBeenCalledWith(
        {
          numberOfProducts,
          numberOfUsers,
          companyName,
          percentage: (numberOfProducts / numberOfUsers) * 100,
        },
        { where: { id: account_id }, returning: true },
      );
    });
  });

  describe('viewAccountData', () => {
    it('should retrieve account data successfully', async () => {
      const account_id = 1;

      await accountModelMock.findOne({
        where: { id: account_id },
      });

      await service.viewAccountData(account_id);

      expect(accountModelMock.findOne).toHaveBeenCalledWith({
        where: { id: account_id },
      });
    });
  });

  describe('uploadImage', () => {
    it('should upload an image successfully', async () => {
      const account_id = 1;
      const image = Buffer.from('mock-image-data');
      const imageName = 'image.jpg';
      accountModelMock.update(
        {
          image: image,
          imageName: imageName,
        },
        { where: { id: account_id }, returning: true },
      );

      await service.uploadImage(account_id, image, imageName);
      expect(accountModelMock.update).toHaveBeenCalledWith(
        { image, imageName },
        { where: { id: account_id }, returning: true },
      );
    });
  });
});
