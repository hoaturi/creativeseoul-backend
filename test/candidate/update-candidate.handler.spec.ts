import { LANGUAGE_LEVELS } from '../../src/domain/common/constants';
import { UpdateCandidateHandler } from '../../src/features/candidate/commands/update-candidate/update-candidate.handler';
import { Collection, EntityManager } from '@mikro-orm/postgresql';
import { Test } from '@nestjs/testing';
import { User, UserRole } from '../../src/domain/user/user.entity';
import { Candidate } from '../../src/domain/candidate/candidate.entity';
import { UpdateCandidateCommand } from '../../src/features/candidate/commands/update-candidate/update-candidate.command';
import { CustomException } from '../../src/common/exceptions/custom.exception';
import { CandidateError } from '../../src/features/candidate/candidate.error';

jest.mock('@mikro-orm/postgresql', () => ({
  ...jest.requireActual('@mikro-orm/postgresql'),
  Collection: jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    add: jest.fn(),
    remove: jest.fn(),
    contains: jest.fn(),
  })),
}));

describe('UpdateCandidateHandler', () => {
  let handler: UpdateCandidateHandler;
  let em: jest.Mocked<EntityManager>;

  const mockUserId = 'user-id';
  const createMockDto = (partial = {}) => ({
    fullName: 'John Doe',
    title: 'Software Engineer',
    bio: 'Experienced developer',
    isAvailable: true,
    profilePictureUrl: 'https://example.com/photo.jpg',
    resumeUrl: 'https://example.com/resume.pdf',
    preferredCategoryIds: [1, 2],
    preferredWorkLocationTypeIds: [1],
    preferredEmploymentTypeIds: [1, 2],
    preferredStateIds: [1],
    languages: [
      { languageId: 1, level: LANGUAGE_LEVELS.FLUENT },
      { languageId: 2, level: LANGUAGE_LEVELS.NATIVE },
    ],
    ...partial,
  });

  const createMockCandidate = (user: User) => {
    const candidate = new Candidate(
      user,
      'Original Name',
      'Original Title',
      'Original Bio',
      false,
      'original-photo.jpg',
      'original-resume.pdf',
    );

    const collections = [
      'languages',
      'preferredCategories',
      'preferredWorkLocationTypes',
      'preferredStates',
      'preferredEmploymentTypes',
    ];

    collections.forEach((collection) => {
      candidate[collection] = new Collection<any>(candidate);
    });

    return candidate;
  };

  const createMockUser = (role = UserRole.CANDIDATE) =>
    ({
      id: mockUserId,
      role,
    }) as User;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UpdateCandidateHandler,
        {
          provide: EntityManager,
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            flush: jest.fn(),
            getReference: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<UpdateCandidateHandler>(UpdateCandidateHandler);
    em = module.get<jest.Mocked<EntityManager>>(EntityManager);
    jest.clearAllMocks();
  });

  describe('successful updates', () => {
    let mockUser: User;
    let mockCandidate: Candidate;

    beforeEach(() => {
      mockUser = createMockUser();
      mockCandidate = createMockCandidate(mockUser);

      em.findOne.mockImplementation(async (entityClass: any) => {
        if (entityClass === User) return mockUser;
        if (entityClass === Candidate) return mockCandidate;
        return null;
      });
    });

    it('should update all fields when full dto is provided', async () => {
      const command = new UpdateCandidateCommand(mockUserId, createMockDto());
      const result = await handler.execute(command);

      expect(result.isSuccess).toBeTruthy();
      expect(em.flush).toHaveBeenCalled();

      const expectedUpdates = [
        'fullName',
        'title',
        'bio',
        'isAvailable',
        'profilePictureUrl',
        'resumeUrl',
      ];
      expectedUpdates.forEach((field) => {
        expect(mockCandidate[field]).toBe(createMockDto()[field]);
      });
    });

    it('should update only provided fields in partial update', async () => {
      const partialDto = createMockDto({ fullName: 'New Name' });
      const command = new UpdateCandidateCommand(mockUserId, {
        fullName: 'New Name',
      });

      const result = await handler.execute(command);

      expect(result.isSuccess).toBeTruthy();
      expect(mockCandidate.fullName).toBe(partialDto.fullName);
      expect(mockCandidate.title).toBe('Original Title');
      expect(mockCandidate.bio).toBe('Original Bio');
    });

    it('should update all collections', async () => {
      const command = new UpdateCandidateCommand(mockUserId, createMockDto());
      const result = await handler.execute(command);

      expect(result.isSuccess).toBeTruthy();

      const collections = [
        'preferredCategories',
        'preferredWorkLocationTypes',
        'preferredStates',
        'preferredEmploymentTypes',
        'languages',
      ];
      collections.forEach((collection) => {
        expect(mockCandidate[collection].set).toHaveBeenCalled();
      });
    });
  });

  describe('validation failures', () => {
    it('should throw exception when user is not found', async () => {
      em.findOne.mockResolvedValue(null);
      const command = new UpdateCandidateCommand(mockUserId, createMockDto());

      await expect(handler.execute(command)).rejects.toThrow(CustomException);
    });

    it('should throw exception when user is not a candidate', async () => {
      const mockUser = createMockUser(UserRole.EMPLOYER);
      em.findOne.mockResolvedValueOnce(mockUser);

      const command = new UpdateCandidateCommand(mockUserId, createMockDto());

      await expect(handler.execute(command)).rejects.toThrow(CustomException);
    });

    it('should return failure when candidate profile is not found', async () => {
      const mockUser = createMockUser();
      em.findOne.mockResolvedValueOnce(mockUser).mockResolvedValueOnce(null);

      const command = new UpdateCandidateCommand(mockUserId, createMockDto());
      const result = await handler.execute(command);

      expect(result.isSuccess).toBeFalsy();
      expect(result.error).toBe(CandidateError.ProfileNotFound);
    });
  });
});
