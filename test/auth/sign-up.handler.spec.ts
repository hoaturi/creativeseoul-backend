import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { SignUpCommand, SignUpHandler } from '../../src/features/auth/commands';
import { EntityManager } from '@mikro-orm/postgresql';
import { Queue } from 'bullmq';
import { getQueueToken } from '@nestjs/bullmq';
import { QueueType } from '../../src/infrastructure/queue/queue-type.enum';
import { User, UserRole } from '../../src/domain/user/user.entity';
import { EmailJobType } from '../../src/infrastructure/queue/email/email-job.type.enum';
import { AuthError } from '../../src/features/auth/auth.error';
import { EmailVerificationToken } from '../../src/domain/auth/email-verification-token.entity';

jest.mock('bcrypt');

describe('SignUpHandler', () => {
  let handler: SignUpHandler;
  let em: jest.Mocked<EntityManager>;
  let emailQueue: jest.Mocked<Queue>;

  const mockEntityManager = {
    findOne: jest.fn(),
    create: jest.fn(),
    flush: jest.fn(),
  };

  const mockQueue = {
    add: jest.fn(),
  };

  const mockCommand = new SignUpCommand({
    email: 'test@example.com',
    fullName: 'Test User',
    password: 'password123',
    role: 'CANDIDATE',
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignUpHandler,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
        {
          provide: getQueueToken(QueueType.EMAIL),
          useValue: mockQueue,
        },
      ],
    }).compile();

    handler = module.get<SignUpHandler>(SignUpHandler);
    em = module.get(EntityManager);
    emailQueue = module.get(getQueueToken(QueueType.EMAIL));

    // Reset all mocks before each test
    jest.clearAllMocks();

    // Mock bcrypt hash
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
  });

  it('should create user, email verification and queue verify email job', async () => {
    // Arrange
    em.findOne.mockResolvedValue(null);

    const mockUser = new User(
      mockCommand.user.fullName,
      mockCommand.user.email,
      UserRole.CANDIDATE,
      'hashedPassword',
    );
    const mockVerificationToken = new EmailVerificationToken(
      mockUser,
      'mockedVerificationToken',
      new Date(),
    );

    em.create.mockImplementation((Entity, data) => {
      if (Entity === EmailVerificationToken) return mockVerificationToken;
      return data;
    });

    // Act
    const result = await handler.execute(mockCommand);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(em.findOne).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalled();
    expect(em.create).toHaveBeenCalledTimes(2);
    expect(em.flush).toHaveBeenCalled();
    expect(emailQueue.add).toHaveBeenCalled();
  });

  it('should return failure when email already exists', async () => {
    // Arrange
    em.findOne.mockResolvedValue(
      new User('existing', 'test@example.com', UserRole.CANDIDATE, 'hash'),
    );

    // Act
    const result = await handler.execute(mockCommand);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.error).toBe(AuthError.EmailAlreadyExists);
    expect(em.create).not.toHaveBeenCalled();
    expect(em.flush).not.toHaveBeenCalled();
    expect(emailQueue.add).not.toHaveBeenCalled();
  });

  it('should create user with correct data', async () => {
    // Arrange
    em.findOne.mockResolvedValue(null);
    let capturedUser: User | null = null;

    em.create.mockImplementation((Entity: any, data: User) => {
      if (Entity === User) {
        capturedUser = data;
      }
      return data;
    });

    // Act
    await handler.execute(mockCommand);

    // Assert
    expect(capturedUser).toBeTruthy();
    expect(capturedUser?.email).toBe(mockCommand.user.email);
    expect(capturedUser?.fullName).toBe(mockCommand.user.fullName);
    expect(capturedUser?.role).toBe(UserRole[mockCommand.user.role]);
  });

  it('should create email verification with correct expiration time', async () => {
    // Arrange
    jest.useFakeTimers();
    const now = new Date('2024-01-01T00:00:00Z');
    jest.setSystemTime(now);

    em.findOne.mockResolvedValue(null);
    let capturedExpirationTime: Date | undefined;

    em.create.mockImplementation((Entity: any, data: any) => {
      if (Entity === EmailVerificationToken) {
        capturedExpirationTime = data.expiresAt;
      }
      return data;
    });

    // Act
    await handler.execute(mockCommand);

    // Assert
    expect(capturedExpirationTime).toEqual(
      new Date(now.getTime() + 30 * 60 * 1000),
    );
  });

  it('should queue verification email after successful user creation', async () => {
    // Arrange
    em.findOne.mockResolvedValue(null);
    const mockUser = new User(
      mockCommand.user.fullName,
      mockCommand.user.email,
      UserRole.CANDIDATE,
      'hashedPassword',
    );
    const mockVerificationToken = new EmailVerificationToken(
      mockUser,
      'mockedVerificationToken',
      new Date(),
    );

    em.create.mockImplementation((Entity, data) => {
      if (Entity === EmailVerificationToken) return mockVerificationToken;
      return mockUser;
    });

    // Act
    await handler.execute(mockCommand);

    // Assert
    expect(emailQueue.add).toHaveBeenCalledWith(
      EmailJobType.VERIFY_EMAIL,
      expect.any(Object),
      expect.any(Object),
    );
  });
});
