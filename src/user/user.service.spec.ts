import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { SchedulerManager } from 'src/scheduler/scheduler.manager';
import { EmailService } from 'src/email/email.service';

const mockUserRepository = {
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        SchedulerManager,
        EmailService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const mockUsers = [{ id: '1', first_name: 'John', last_name: 'Doe' }];

      mockUserRepository.find.mockReturnValueOnce(mockUsers);

      const users = await userService.getAllUsers();

      expect(users).toEqual(mockUsers);
    });
  });

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      const createUserDto: CreateUserDto = {
        first_name: 'John',
        last_name: 'Doe',
        birthday: '1990-01-01',
        location: 'Some Location',
      };

      const mockCreatedUser = { ...createUserDto, id: '1' };

      mockUserRepository.create.mockReturnValueOnce(mockCreatedUser);
      mockUserRepository.save.mockReturnValueOnce(mockCreatedUser);

      const createdUser = await userService.createUser(createUserDto);

      expect(createdUser).toEqual(mockCreatedUser);
    });
  });
});
