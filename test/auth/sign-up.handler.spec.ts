import { Test } from '@nestjs/testing';
import { EntityManager } from '@mikro-orm/postgresql';

import * as bcrypt from 'bcrypt';

import { Result } from '../../src/common/result/result';
import { SignUpCommand } from '../../src/features/auth/commands/signUp/sign-up.command';
import { User, UserRole } from '../../src/domain/user/user.entity';
import { UserErrors } from '../../src/features/user/errors/user.errors';
import { SignUpHandler } from '../../src/features/auth/commands/signUp/sign-up.handler';

jest.mock('bcrypt');

describe('SignUpHandler', () => {
  let handler: SignUpHandler;
  let entityManager: jest.Mocked<EntityManager>;

  beforeEach(async () => {
    const entityManagerMock = {
      findOne: jest.fn(),
      create: jest.fn(),
      flush: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        SignUpHandler,
        {
          provide: EntityManager,
          useValue: entityManagerMock,
        },
      ],
    }).compile();

    handler = moduleRef.get<SignUpHandler>(SignUpHandler);
    entityManager = moduleRef.get(EntityManager);

    // Mock bcrypt hash
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const mockCommand = new SignUpCommand({
      fullName: 'John Doe',
      email: 'jane@example.com',
      password: 'password123',
      role: 'CANDIDATE',
    });

    it('should successfully create a new user when email does not exist', async () => {
      // Arrange
      entityManager.findOne.mockResolvedValue(null);

      // Act
      const result = await handler.execute(mockCommand);

      // Assert
      expect(result).toEqual(Result.success());
      expect(entityManager.findOne).toHaveBeenCalledWith(
        User,
        { email: mockCommand.user.email },
        { fields: ['id'] },
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(mockCommand.user.password, 10);
      expect(entityManager.create).toHaveBeenCalledWith(
        User,
        expect.objectContaining({
          fullName: mockCommand.user.fullName,
          email: mockCommand.user.email,
          role: UserRole.CANDIDATE,
          password: 'hashedPassword',
        }),
      );
      expect(entityManager.flush).toHaveBeenCalled();
    });

    it('should return failure when email already exists', async () => {
      // Arrange
      entityManager.findOne.mockResolvedValue(
        new User('Test User', 'john@example.com', UserRole.CANDIDATE),
      );

      // Act
      const result = await handler.execute(mockCommand);

      // Assert
      expect(result).toEqual(Result.failure(UserErrors.EmailAlreadyExists));
      expect(entityManager.create).not.toHaveBeenCalled();
      expect(entityManager.flush).not.toHaveBeenCalled();
    });

    it('should create user with correct role when specified', async () => {
      // Arrange
      entityManager.findOne.mockResolvedValue(null);
      const adminCommand = new SignUpCommand({
        fullName: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'CANDIDATE',
      });

      // Act
      const result = await handler.execute(adminCommand);

      // Assert
      expect(result).toEqual(Result.success());
      expect(entityManager.create).toHaveBeenCalledWith(
        User,
        expect.objectContaining({
          role: UserRole.CANDIDATE,
        }),
      );
    });

    it('should properly hash the password', async () => {
      // Arrange
      entityManager.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('specificHashedValue');

      // Act
      await handler.execute(mockCommand);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith(mockCommand.user.password, 10);
      expect(entityManager.create).toHaveBeenCalledWith(
        User,
        expect.objectContaining({
          password: 'specificHashedValue',
        }),
      );
    });
  });
});
