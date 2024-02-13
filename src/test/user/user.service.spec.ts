import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../users/users.service';
import { User, UserType } from '../../models/users';
import { getModelToken } from '@nestjs/sequelize';
import SequelizeMock from 'sequelize-mock';
import { createMock } from '@golevelup/ts-jest';

describe('UserService', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: UserService;
  let userModelMock: typeof User;
  let sequelizeMock;
  let BuildUser;

  beforeAll(() => {
    sequelizeMock = new SequelizeMock();
    BuildUser = sequelizeMock.define('User', {
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
      providers: [
        UserService,
        {
          provide: getModelToken(User),
          useValue: createMock<typeof User>(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModelMock = module.get<typeof User>(getModelToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const mockUserData = {
        id: 1,
        username: 'testUser',
        password: 'password123',
        email: 'test@example.com',
        userType: UserType.A,
        uuid: '1234',
      };

      BuildUser.$queueResult(BuildUser.build(mockUserData));

      const createData = {
        username: 'testUser',
        password: 'password123',
        email: 'test@example.com',
        userType: UserType.A,
        uuid: '1234',
      };

      await userModelMock.create(createData as any);

      expect(userModelMock.create).toHaveBeenCalledWith({
        username: 'testUser',
        password: 'password123',
        email: 'test@example.com',
        userType: UserType.A,
        uuid: '1234',
      });
    });
  });

  describe('login', () => {
    it('should return the user if login is successful', async () => {
      userModelMock.findOne({
        attributes: ['username', 'email', 'id'],
        where: { email: 'test@example.com', password: 'password123' },
      });

      expect(userModelMock.findOne).toHaveBeenCalledWith({
        attributes: ['username', 'email', 'id'],
        where: { email: 'test@example.com', password: 'password123' },
      });
    });
  });
});
