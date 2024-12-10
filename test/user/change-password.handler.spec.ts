import { ChangePasswordHandler } from '../../src/features/user/commands/change-password/change-password.handler';
import { EntityManager } from '@mikro-orm/postgresql';
import { Test } from '@nestjs/testing';
import { ChangePasswordCommand } from '../../src/features/user/commands/change-password/change-password.command';
import { UserError } from '../../src/features/user/user.error';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('ChangePasswordHandler', () => {
  let handler: ChangePasswordHandler;
  let em: jest.Mocked<EntityManager>;

  const mockEntityManager = {
    findOneOrFail: jest.fn(),
    flush: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ChangePasswordHandler,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    handler = module.get<ChangePasswordHandler>(ChangePasswordHandler);
    em = module.get(EntityManager);

    (em.findOneOrFail as jest.Mock).mockResolvedValue({
      id: '123',
      password: 'hashed-old-password',
    });

    jest.clearAllMocks();
  });

  it('should successfully change the password when current password is correct', async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-new-password');

    const mockCommand = new ChangePasswordCommand('user-id', {
      currentPassword: 'current-password',
      newPassword: 'new-password',
    });

    const result = await handler.execute(mockCommand);

    expect(result.isSuccess).toBe(true);
    expect(bcrypt.compare).toHaveBeenCalledWith(
      'current-password',
      'hashed-old-password',
    );
    expect(bcrypt.hash).toHaveBeenCalledWith('new-password', 10);
    expect(em.flush).toHaveBeenCalled();
  });

  it('should return failure when current password is incorrect', async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const mockCommand = new ChangePasswordCommand('user-id', {
      currentPassword: 'wrong-password',
      newPassword: 'new-password',
    });

    const result = await handler.execute(mockCommand);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBe(UserError.CurrentPasswordMismatch);
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(em.flush).not.toHaveBeenCalled();
  });
});
