import { EntityManager } from '@mikro-orm/postgresql';
import { Test } from '@nestjs/testing';
import { User, UserRole } from '../../src/domain/user/user.entity';
import { JobCategory } from '../../src/domain/common/entities/job-category.entity';
import { WorkLocationType } from '../../src/domain/common/entities/work-location-type.entity';
import { EmploymentType } from '../../src/domain/common/entities/employment-type.entity';
import { Language } from '../../src/domain/common/entities/language.entity';
import { LANGUAGE_PROFICIENCY_LEVELS } from '../../src/domain/common/constants';
import { CustomException } from '../../src/common/exceptions/custom.exception';
import { CandidateError } from '../../src/features/candidate/candidate.error';
import { Candidate } from '../../src/domain/candidate/candidate.entity';
import { State } from '../../src/domain/common/entities/state.entity';
import { CreateCandidateHandler } from '../../src/features/candidate/commands/create-candidate/create-candidate.handler';
import { CreateCandidateCommand } from '../../src/features/candidate/commands/create-candidate/create-candidate.command';

describe('CreateCandidateProfileHandler', () => {
  let handler: CreateCandidateHandler;
  let em: jest.Mocked<EntityManager>;

  const mockUserId = 'user-id';

  const createMockDto = (partial = {}) => ({
    fullName: 'John Doe',
    title: 'Software Engineer',
    bio: 'Experienced developer',
    isAvailable: true,
    profilePictureUrl: 'https://example.com/photo.jpg',
    resumeUrl: 'https://example.com/resume.pdf',
    preferredCategories: [1, 2],
    preferredWorkLocations: [1],
    preferredEmploymentTypes: [1, 2],
    preferredStates: [1],
    languages: [
      { languageId: 1, proficiencyLevel: LANGUAGE_PROFICIENCY_LEVELS.ADVANCED },
      { languageId: 2, proficiencyLevel: LANGUAGE_PROFICIENCY_LEVELS.NATIVE },
    ],
    ...partial,
  });

  const createMockEntities = () => ({
    categories: [
      { id: 1, name: 'Category 1' },
      { id: 2, name: 'Category 2' },
    ] as JobCategory[],
    locationTypes: [{ id: 1, name: 'Location Type1' }] as WorkLocationType[],
    employmentTypes: [
      { id: 1, name: 'Type 1' },
      { id: 2, name: 'Type 2' },
    ] as EmploymentType[],
    states: [{ id: 1, name: 'State 1' }] as State[],
    languages: [
      { id: 1, name: 'Language 1' },
      { id: 2, name: 'Language 2' },
    ] as Language[],
  });

  const createMockUser = (role = UserRole.CANDIDATE) =>
    ({
      id: mockUserId,
      role,
    }) as User;

  const createMockCandidate = () => ({
    preferredCategories: { add: jest.fn() },
    preferredWorkLocations: { add: jest.fn() },
    preferredEmploymentTypes: { add: jest.fn() },
    preferredStates: { add: jest.fn() },
    languages: { add: jest.fn() },
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateCandidateHandler,
        {
          provide: EntityManager,
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            flush: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<CreateCandidateHandler>(CreateCandidateHandler);
    em = module.get(EntityManager);
    jest.clearAllMocks();
  });

  describe('successful profile creation', () => {
    beforeEach(() => {
      const mockUser = createMockUser();
      const mockEntities = createMockEntities();
      const mockCandidate = createMockCandidate();

      em.findOne
        .mockResolvedValueOnce(mockUser) // User lookup
        .mockResolvedValueOnce(null); // No existing profile

      em.find
        .mockResolvedValueOnce(mockEntities.categories)
        .mockResolvedValueOnce(mockEntities.locationTypes)
        .mockResolvedValueOnce(mockEntities.employmentTypes)
        .mockResolvedValueOnce(mockEntities.states)
        .mockResolvedValueOnce(mockEntities.languages);

      em.create.mockReturnValue(mockCandidate);
    });

    it('should successfully create a candidate profile with all preferences', async () => {
      const result = await handler.execute(
        new CreateCandidateCommand(mockUserId, createMockDto()),
      );

      expect(result.isSuccess).toBeTruthy();
      expect(em.flush).toHaveBeenCalled();

      // Verify all collections were added
      const candidate = em.create.mock.results[0].value;
      const collections = [
        'preferredCategories',
        'preferredWorkLocations',
        'preferredEmploymentTypes',
        'preferredStates',
        'languages',
      ];

      collections.forEach((collection) => {
        expect(candidate[collection].add).toHaveBeenCalled();
      });
    });

    it('should handle duplicate preferences in input arrays', async () => {
      const dtoWithDuplicates = createMockDto({
        preferredCategories: [1, 1, 2, 2],
        preferredWorkLocations: [1, 1],
        preferredEmploymentTypes: [1, 2],
        preferredStates: [1, 1],
      });

      const result = await handler.execute(
        new CreateCandidateCommand(mockUserId, dtoWithDuplicates),
      );

      expect(result.isSuccess).toBeTruthy();

      const candidate = em.create.mock.results[0].value;
      expect(candidate.preferredCategories.add).toHaveBeenCalled();

      expect(em.find).toHaveBeenCalledWith(JobCategory, {
        id: { $in: [1, 2] },
      });
    });

    describe('validation failures', () => {
      it('should throw an exception when user does not exist', async () => {
        em.findOne.mockResolvedValue(null);

        await expect(
          handler.execute(
            new CreateCandidateCommand(mockUserId, createMockDto()),
          ),
        ).rejects.toThrow(CustomException);

        expect(em.flush).not.toHaveBeenCalled();
      });

      it('should throw an error when user is not a candidate', async () => {
        const mockUser = createMockUser(UserRole.EMPLOYER);
        em.findOne.mockResolvedValue(mockUser);

        await expect(
          handler.execute(
            new CreateCandidateCommand(mockUserId, createMockDto()),
          ),
        ).rejects.toThrow(CustomException);

        expect(em.flush).not.toHaveBeenCalled();
      });

      it('should return failure when profile already exists', async () => {
        const mockUser = createMockUser();
        const existingProfile = { id: 'existing-profile' } as Candidate;

        em.findOne
          .mockResolvedValueOnce(mockUser)
          .mockResolvedValueOnce(existingProfile);

        const result = await handler.execute(
          new CreateCandidateCommand(mockUserId, createMockDto()),
        );

        expect(result.isSuccess).toBeFalsy();
        expect(result.error).toBe(CandidateError.ProfileAlreadyExists);
        expect(em.flush).not.toHaveBeenCalled();
      });
    });
  });
});
