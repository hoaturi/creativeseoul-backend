import { Test } from '@nestjs/testing';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  VerifyEmailCommand,
  VerifyEmailHandler,
} from '../../src/features/auth/commands';
import { AuthError } from '../../src/features/auth/auth.error';

describe('VerifyEmailHandler', () => {
  let handler: VerifyEmailHandler;
  let em: jest.Mocked<EntityManager>;

  const mockEntityManager = {
    findOne: jest.fn(),
    flush: jest.fn(),
    nativeDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        VerifyEmailHandler,
        { provide: EntityManager, useValue: mockEntityManager },
      ],
    }).compile();

    handler = module.get<VerifyEmailHandler>(VerifyEmailHandler);
    em = module.get(EntityManager);

    jest.clearAllMocks();
  });

  it('should verify user email when token is valid', async () => {
    const mockUser = {
      id: 'user-id',
      isVerified: false,
    };
    const mockVerification = {
      token: 'valid-token',
      usedAt: null,
      expiresAt: new Date(Date.now() + 1000),
      user: mockUser,
    };
    em.findOne.mockResolvedValue(mockVerification);

    const result = await handler.execute(
      new VerifyEmailCommand({ token: 'valid-token' }),
    );

    expect(result.isSuccess).toBe(true);
    expect(mockUser.isVerified).toBe(true);
    expect(mockVerification.usedAt).not.toBeNull();
    expect(em.flush).toHaveBeenCalled();
    expect(em.nativeDelete).toHaveBeenCalled();
  });

  describe('should fail to verify email when', () => {
    it('token does not exist', async () => {
      em.findOne.mockResolvedValue(null);

      const result = await handler.execute(
        new VerifyEmailCommand({ token: 'invalid-token' }),
      );

      expect(result.isSuccess).toBe(false);
      expect(result.error).toBe(AuthError.InvalidToken);
      expect(em.flush).not.toHaveBeenCalled();
      expect(em.nativeDelete).not.toHaveBeenCalled();
    });

    it('user is already verified', async () => {
      const mockUser = {
        id: 'user-id',
        isVerified: true,
      };
      const mockVerification = {
        token: 'valid-token',
        usedAt: null,
        expiresAt: new Date(Date.now() + 1000),
        user: mockUser,
      };
      em.findOne.mockResolvedValue(mockVerification);

      const result = await handler.execute(
        new VerifyEmailCommand({ token: 'valid-token' }),
      );

      expect(result.isSuccess).toBe(false);
      expect(result.error).toBe(AuthError.InvalidToken);
      expect(mockUser.isVerified).toBe(true);
      expect(em.flush).not.toHaveBeenCalled();
      expect(em.nativeDelete).not.toHaveBeenCalled();
    });
  });
});
