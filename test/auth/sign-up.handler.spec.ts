import { Test } from '@nestjs/testing';
import { EntityManager } from '@mikro-orm/postgresql';
import { Queue } from 'bullmq';
import * as bcrypt from 'bcrypt';

import { Result } from '../../src/common/result/result';
import { SignUpCommand } from '../../src/features/auth/commands/signUp/sign-up.command';
import { User, UserRole } from '../../src/domain/user/user.entity';
import { UserErrors } from '../../src/features/user/errors/user.errors';
import { SignUpHandler } from '../../src/features/auth/commands/signUp/sign-up.handler';
import { QueueType } from '../../src/infrastructure/queue/queue-type.enum';
import { getQueueToken } from '@nestjs/bullmq';
import { EmailJobType } from '../../src/infrastructure/queue/email/email-job.type.enum';

jest.mock('bcrypt');

describe('SignUpHandler', () => {
  let handler: SignUpHandler;
  let entityManager: jest.Mocked<EntityManager>;
  let emailQueue: jest.Mocked<Queue>;

  beforeEach(async () => {
    const entityManagerMock = {
      findOne: jest.fn(),
      create: jest.fn(),
      flush: jest.fn(),
    };

    const queueMock = {
      add: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        SignUpHandler,
        {
          provide: EntityManager,
          useValue: entityManagerMock,
        },
        {
          provide: getQueueToken(QueueType.EMAIL),
          useValue: queueMock,
        },
      ],
    }).compile();

    handler = moduleRef.get<SignUpHandler>(SignUpHandler);
    entityManager = moduleRef.get(EntityManager);
    emailQueue = moduleRef.get(getQueueToken(QueueType.EMAIL));

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

    it('should create user and queue verification email', async () => {
      // Arrange
      entityManager.findOne.mockResolvedValue(null);

      const mockVerificationToken = crypto.randomUUID();
      const mockVerificationTokenExpiresAt = new Date();
      jest.spyOn(crypto, 'randomUUID').mockReturnValue(mockVerificationToken);
      jest
        .spyOn(Date, 'now')
        .mockReturnValue(mockVerificationTokenExpiresAt.getTime());

      const mockUser = new User(
        mockCommand.user.fullName,
        mockCommand.user.email,
        UserRole[mockCommand.user.role],
        'hashedPassword',
        mockVerificationToken,
        mockVerificationTokenExpiresAt,
      );
      entityManager.create.mockReturnValue(mockUser);

      // Act
      const result = await handler.execute(mockCommand);

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(entityManager.findOne).toHaveBeenCalledWith(
        User,
        { email: mockCommand.user.email },
        { fields: ['id'] },
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(mockCommand.user.password, 10);
      expect(entityManager.create).toHaveBeenCalledWith(
        User,
        expect.objectContaining({
          email: mockCommand.user.email,
          fullName: mockCommand.user.fullName,
          password: 'hashedPassword',
          role: UserRole[mockCommand.user.role],
          verificationToken: mockVerificationToken,
          verificationTokenExpiresAt: expect.any(Date),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
      expect(entityManager.flush).toHaveBeenCalled();
      expect(emailQueue.add).toHaveBeenCalledWith(
        EmailJobType.VERIFY_EMAIL,
        {
          userId: mockUser.id,
          email: mockUser.email,
          fullName: mockUser.fullName,
          verificationToken: mockUser.verificationToken,
        },
        expect.any(Object),
      );
    });

    it('should not queue verification email if user creation fails', async () => {
      // Arrange
      entityManager.findOne.mockResolvedValue(null);
      entityManager.flush.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(handler.execute(mockCommand)).rejects.toThrow(
        'Database error',
      );
      expect(emailQueue.add).not.toHaveBeenCalled();
    });

    it('should return failure when email already exists without queueing email', async () => {
      // Arrange
      entityManager.findOne.mockResolvedValue(
        new User(
          'Test User',
          'john@example.com',
          UserRole.CANDIDATE,
          'password',
        ),
      );

      // Act
      const result = await handler.execute(mockCommand);

      // Assert
      expect(result).toEqual(Result.failure(UserErrors.EmailAlreadyExists));
      expect(entityManager.create).not.toHaveBeenCalled();
      expect(entityManager.flush).not.toHaveBeenCalled();
      expect(emailQueue.add).not.toHaveBeenCalled();
    });
  });
});
