import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserType } from '../models/users';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async createUser(
    username: string,
    password: string,
    email: string,
    userType: UserType,
    uuid: string,
  ) {
    try {
      const user = await this.userModel.create({
        username,
        password,
        email,
        userType,
        uuid,
      });
      return user;
    } catch (ex) {
      console.error('Error creating user: ', ex);
      throw ex;
    }
  }

  async login(email: string, password: string) {
    try {
      const result = await this.userModel.findOne({
        attributes: ['username', 'email', 'uuid'],
        where: { email, password },
      });
      return result;
    } catch (error) {
      console.error('Login failed:', error.message);
      throw error;
    }
  }
}
