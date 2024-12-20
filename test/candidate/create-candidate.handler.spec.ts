import { CreateCandidateHandler } from '../../src/features/candidate/commands/create-cnadidate-profile/create-candidate.handler';
import { EntityManager } from '@mikro-orm/postgresql';
import { Test } from '@nestjs/testing';
import { CreateCandidateCommand } from '../../src/features/candidate/commands/create-cnadidate-profile/create-candidate.command';
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

describe('CreateCandidateProfileHandler', () => {
  let handler: CreateCandidateHandler;
  let em: jest.Mocked<EntityManager>;

  const mockUserId = 'user-id';
  const mockProfileDto = {
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
      { languageId: 1, proficiency: LANGUAGE_PROFICIENCY_LEVELS.ADVANCED },
      { languageId: 2, proficiency: LANGUAGE_PROFICIENCY_LEVELS.NATIVE },
    ],
  };

  beforeEach(async () => {
    const mockedEntityManager = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      flush: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        CreateCandidateHandler,
        {
          provide: EntityManager,
          useValue: mockedEntityManager,
        },
      ],
    }).compile();

    handler = module.get<CreateCandidateHandler>(CreateCandidateHandler);
    em = module.get(EntityManager);

    jest.clearAllMocks();
  });

  it('should successfully create a candidate profile', async () => {
    // Arrange
    const mockUser = {
      id: mockUserId,
      role: UserRole.CANDIDATE,
    } as User;

    const mockCategories = [
      { id: 1, name: 'Category 1' } as JobCategory,
      { id: 2, name: 'Category 2' } as JobCategory,
    ];
    const mockLocationTypes = [
      { id: 1, name: 'Location Type1' } as WorkLocationType,
    ];
    const mockEmploymentTypes = [
      { id: 1, name: 'Type 1' } as EmploymentType,
      { id: 2, name: 'Type 2' } as EmploymentType,
    ];
    const mockStates = [{ id: 1, name: 'State 1' } as State];
    const mockLanguages = [
      { id: 1, name: 'Language 1' } as Language,
      { id: 2, name: 'Language 2' } as Language,
    ];

    em.findOne.mockResolvedValueOnce(mockUser); // User lookup
    em.findOne.mockResolvedValueOnce(null); // No existing profile
    em.find.mockResolvedValueOnce(mockCategories);
    em.find.mockResolvedValueOnce(mockLocationTypes);
    em.find.mockResolvedValueOnce(mockEmploymentTypes);
    em.find.mockResolvedValueOnce(mockStates);
    em.find.mockResolvedValueOnce(mockLanguages);

    const mockCandidate = {
      preferredCategories: { add: jest.fn() },
      preferredWorkLocations: { add: jest.fn() },
      preferredEmploymentTypes: { add: jest.fn() },
      preferredStates: { add: jest.fn() },
      languages: { add: jest.fn() },
    };
    em.create.mockReturnValueOnce(mockCandidate);

    const result = await handler.execute(
      new CreateCandidateCommand(mockUserId, mockProfileDto),
    );

    // Assert
    expect(result.isSuccess).toBeTruthy();
    expect(em.flush).toHaveBeenCalled();
    expect(mockCandidate.preferredCategories.add).toHaveBeenCalledWith(
      mockCategories,
    );
    expect(mockCandidate.preferredWorkLocations.add).toHaveBeenCalledWith(
      mockLocationTypes,
    );
    expect(mockCandidate.preferredEmploymentTypes.add).toHaveBeenCalledWith(
      mockEmploymentTypes,
    );
    expect(mockCandidate.preferredStates.add).toHaveBeenCalledWith(mockStates);
    expect(mockCandidate.languages.add).toHaveBeenCalled();
  });

  it('should throw an exception does not exist', async () => {
    // Arrange
    em.findOne.mockResolvedValueOnce(null);

    // Act & Assert
    await expect(
      handler.execute(new CreateCandidateCommand(mockUserId, mockProfileDto)),
    ).rejects.toThrow(CustomException);
    expect(em.flush).not.toHaveBeenCalled();
  });

  it('should throw an error when user is not a candidate', async () => {
    // Arrange
    const mockUser = { id: mockUserId, role: UserRole.EMPLOYER } as User;
    em.findOne.mockResolvedValueOnce(mockUser);

    // Act & Assert
    await expect(
      handler.execute(new CreateCandidateCommand(mockUserId, mockProfileDto)),
    ).rejects.toThrow(CustomException);
    expect(em.flush).not.toHaveBeenCalled();
  });

  it('should throw an error when profile already exists', async () => {
    // Arrange
    const mockUser = { id: mockUserId, role: UserRole.CANDIDATE } as User;
    em.findOne.mockResolvedValueOnce(mockUser); // User lookup
    em.findOne.mockResolvedValueOnce({ id: 'existing-profile' } as Candidate); // Existing profile

    // Act & Assert
    const result = await handler.execute(
      new CreateCandidateCommand(mockUserId, mockProfileDto),
    );
    expect(result.isSuccess).toBeFalsy();
    expect(result.error).toBe(CandidateError.ProfileAlreadyExists);
    expect(em.flush).not.toHaveBeenCalled();
  });

  it('should handle duplicate preferences in input arrays', async () => {
    // Arrange
    const mockUser = {
      id: mockUserId,
      role: UserRole.CANDIDATE,
    } as User;

    const dtoWithDuplicates = {
      ...mockProfileDto,
      preferredCategories: [1, 1, 2, 2],
      preferredWorkLocations: [1, 1],
      preferredEmploymentTypes: [1, 2],
      preferredStates: [1, 1],
      languages: [
        { languageId: 1, proficiency: LANGUAGE_PROFICIENCY_LEVELS.ADVANCED },
        { languageId: 1, proficiency: LANGUAGE_PROFICIENCY_LEVELS.NATIVE },
      ],
    };

    const mockCategories = [
      { id: 1, name: 'Category 1' } as JobCategory,
      { id: 2, name: 'Category 2' } as JobCategory,
    ];
    const mockLocations = [{ id: 1, name: 'Location 1' } as WorkLocationType];
    const mockEmploymentTypes = [
      { id: 1, name: 'Type 1' } as EmploymentType,
      { id: 2, name: 'Type 2' } as EmploymentType,
    ];
    const mockStates = [{ id: 1, name: 'State 1' } as State];
    const mockLanguages = [{ id: 1, name: 'Language 1' } as Language];

    em.findOne.mockResolvedValueOnce(mockUser);
    em.findOne.mockResolvedValueOnce(null);
    em.find.mockResolvedValueOnce(mockCategories);
    em.find.mockResolvedValueOnce(mockLocations);
    em.find.mockResolvedValueOnce(mockEmploymentTypes);
    em.find.mockResolvedValueOnce(mockStates);
    em.find.mockResolvedValueOnce(mockLanguages);

    const mockCandidate = {
      preferredCategories: { add: jest.fn() },
      preferredWorkLocations: { add: jest.fn() },
      preferredEmploymentTypes: { add: jest.fn() },
      preferredStates: { add: jest.fn() },
      languages: { add: jest.fn() },
    };
    em.create.mockReturnValueOnce(mockCandidate);

    // Act
    const result = await handler.execute(
      new CreateCandidateCommand(mockUserId, dtoWithDuplicates),
    );

    // Assert
    expect(result.isSuccess).toBeTruthy();
    expect(mockCandidate.preferredCategories.add).toHaveBeenCalledWith(
      mockCategories,
    );
    expect(mockCandidate.languages.add).toHaveBeenCalled();
    // Verify only unique values were processed
    expect(em.find).toHaveBeenCalledWith(JobCategory, { id: { $in: [1, 2] } });
    expect(em.find).toHaveBeenCalledWith(Language, {
      id: { $in: [1] },
    });
  });
});
