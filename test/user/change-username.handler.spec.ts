import { ChangeUsernameHandler } from '../../src/features/user/commands/change-username/change-username.handler';
import { EntityManager } from '@mikro-orm/postgresql';
import { Test } from '@nestjs/testing';
import { ChangeUsernameCommand } from '../../src/features/user/commands/change-username/change-username.command';

describe('ChangeUsernameHandler', () => {
  let handler: ChangeUsernameHandler;
  let em: jest.Mocked<EntityManager>;

  beforeEach(async () => {
    const mockedEntityManger = {
      findOneOrFail: jest.fn(),
      flush: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        ChangeUsernameHandler,
        {
          provide: EntityManager,
          useValue: mockedEntityManger,
        },
      ],
    }).compile();

    handler = module.get<ChangeUsernameHandler>(ChangeUsernameHandler);
    em = module.get(EntityManager);

    jest.clearAllMocks();
  });

  it('should successfully change the username', async () => {
    const mockUser = {
      id: 'user-id',
      username: 'old-username',
    };

    (em.findOneOrFail as jest.Mock).mockResolvedValue(mockUser);

    await handler.execute(new ChangeUsernameCommand('user-id', 'new-username'));

    expect(mockUser.username).toBe('new-username');
    expect(em.flush).toHaveBeenCalled();
  });
});
