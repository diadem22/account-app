import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../users/users.controller';
import { UserService } from '../../users/users.service';
import { Response } from 'express';
import { CreateUserDto } from '../../dto/create-user.dto';
import * as admin from 'firebase-admin';
import { UserType } from '../../models/users';
import { HttpException } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import SequelizeMock from 'sequelize-mock';

class MockSequelize {}

const mockLoginUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
};

jest.mock('firebase/auth', () => {
  return {
    getAuth: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
  };
});
jest.mock('firebase-admin', () => {
  return {
    auth: jest.fn(() => ({
      createUser: jest.fn(),
    })),
  };
});

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;
  let sequelizeMock;
  let User;

  beforeAll(() => {
    sequelizeMock = new SequelizeMock();
    User = sequelizeMock.define('User', {
      id: 1,
      uuid: 'user-uuid',
      username: 'testuser',
      password: 'testpassword',
      email: 'test@example.com',
      userType: UserType.A,
    });
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
            login: jest.fn(),
          },
        },
        { provide: Sequelize, useClass: MockSequelize },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const createUserDto = {
        username: 'testuser',
        password: 'testpassword',
        email: 'test@example.com',
        userType: UserType.A,
      };

      const user = {
        email: 'test@example.com',
        password: 'testpassword',
      };

      User.$queueResult(User.build(createUserDto));

      jest.spyOn(admin.auth(), 'createUser').mockResolvedValue(user as any);

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await admin.auth().createUser(user);
      await controller.register(createUserDto, res as Response);
      await userService.createUser(
        createUserDto.username,
        createUserDto.password,
        createUserDto.email,
        createUserDto.userType,
        'user-uuid',
      );

      expect(userService.createUser).toHaveBeenCalledWith(
        createUserDto.username,
        createUserDto.password,
        createUserDto.email,
        createUserDto.userType,
        'user-uuid',
      );
    });

    it('should handle registration failure', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'testpassword',
        email: 'test@example.com',
        userType: UserType.A,
      };

      const errorMessage =
        "Cannot read properties of undefined (reading 'uid')";

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.register(createUserDto, res as Response);

      jest
        .spyOn(admin.auth(), 'createUser')
        .mockRejectedValue(new Error(errorMessage));

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User not created',
        error: errorMessage,
      });
    });
  });

  describe('login', () => {
    it('should log in a user successfully', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(userService, 'login').mockResolvedValue(mockLoginUser as any);

      const auth = getAuth();

      (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
        auth,
        loginData,
      });
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        cookie: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.login(loginData, res as Response);

      expect(userService.login).toHaveBeenCalledWith(
        loginData.email,
        loginData.password,
      );
    });

    it('should handle login failure due to user not found', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(userService, 'login').mockResolvedValue(null);

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.login(loginData, res as Response);

      expect(userService.login).toHaveBeenCalledWith(
        loginData.email,
        loginData.password,
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login failed',
        error: 'User not found',
      });
    });

    it('should handle login failure due to other errors', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const errorMessage = 'Internal server error';
      jest
        .spyOn(userService, 'login')
        .mockRejectedValue(new HttpException(errorMessage, 500));

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.login(loginData, res as Response);

      expect(userService.login).toHaveBeenCalledWith(
        loginData.email,
        loginData.password,
      );
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login failed',
        error: errorMessage,
      });
    });
  });
});
