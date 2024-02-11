import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Account } from 'src/models/account';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account)
    private readonly accountModel: typeof Account,
  ) {}

  async createAccount(
    user_id: number,
    companyName: string,
    numberOfUsers: number,
    numberOfProducts: number,
  ) {
    try {
      const percentage = (numberOfUsers / numberOfProducts) * 100;

      const account = await this.accountModel.create({
        numberOfProducts,
        numberOfUsers,
        companyName,
        user_id,
        percentage,
      });

      return account;
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  async updateAccount(
    user_id: number,
    companyName: string,
    numberOfUsers: number,
    numberOfProducts: number,
  ) {
    try {
      const updatedAccount = await this.accountModel.update(
        {
          numberOfProducts: numberOfProducts,
          numberOfUsers: numberOfUsers,
          companyName: companyName,
          percentage: (numberOfProducts / numberOfUsers) * 100,
        },
        { where: { user_id: user_id }, returning: true },
      );

      return updatedAccount;
    } catch (error) {
      console.error('Error updating accounting:', error);
      throw error;
    }
  }

  async viewAccountData(user_id: number) {
    try {
      const accountData = await this.accountModel.findAll({
        where: { user_id },
      });
      return accountData;
    } catch (error) {
      console.error('Error retrieving account data:', error);
      throw error;
    }
  }

  async uploadImage(account_id, image, imageName) {
    try {
      console.log(imageName);
      const upload = await this.accountModel.update(
        {
          image: image,
          imageName: imageName,
        },
        { where: { id: account_id }, returning: true },
      );
      console.log(upload[1]);
      return upload;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
}
