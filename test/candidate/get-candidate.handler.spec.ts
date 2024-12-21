import { EntityManager } from '@mikro-orm/postgresql';
import { Test } from '@nestjs/testing';
import { GetCandidateHandler } from '../../src/features/candidate/query/get-candidate/get-candidate.handler';
import { GetCandidateQuery } from '../../src/features/candidate/query/get-candidate/get-candidate.query';
import { CandidateError } from '../../src/features/candidate/candidate.error';
import { ReferenceDataDto } from '../../src/features/common/dtos/reference-data.dto';
import { LanguageWithLevelDto } from '../../src/features/common/dtos/language-with-level.dto';

describe('GetCandidateHandler', () => {
  let handler: GetCandidateHandler;
  let em: jest.Mocked<EntityManager>;

  const defaultReferenceData = {
    category: new ReferenceDataDto(1, 'Engineering', 'engineering'),
    workLocationType: new ReferenceDataDto(1, 'Remote', 'remote'),
    state: new ReferenceDataDto(1, 'Seoul', 'seoul'),
    employmentType: new ReferenceDataDto(1, 'FullTime', 'full-time'),
    language: new LanguageWithLevelDto(1, 'English', 'english', 5),
  };

  const createMockCandidate = (
    params: { isAvailable?: boolean; userId?: string } = {},
  ) => ({
    id: 'test-id',
    fullName: 'John Doe',
    title: 'Software Engineer',
    bio: 'Test bio',
    profilePictureUrl: 'test-url',
    resumeUrl: 'test-resume',
    isAvailable: params.isAvailable ?? true,
    user: { id: params.userId || 'default-user' },
    preferredCategories: {
      getItems: () => [defaultReferenceData.category],
    },
    preferredWorkLocationTypes: {
      getItems: () => [defaultReferenceData.workLocationType],
    },
    preferredStates: {
      getItems: () => [defaultReferenceData.state],
    },
    preferredEmploymentTypes: {
      getItems: () => [defaultReferenceData.employmentType],
    },
    languages: {
      getItems: () => [{ language: defaultReferenceData.language, level: 5 }],
    },
  });

  beforeEach(async () => {
    const mockEm = {
      findOne: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        GetCandidateHandler,
        { provide: EntityManager, useValue: mockEm },
      ],
    }).compile();

    handler = module.get<GetCandidateHandler>(GetCandidateHandler);
    em = module.get<jest.Mocked<EntityManager>>(EntityManager);
  });

  const setupMockResponse = (
    candidate: ReturnType<typeof createMockCandidate> | null,
  ) => {
    em.findOne.mockResolvedValue(candidate);
  };

  it('should return all required profile fields', async () => {
    const mockCandidate = createMockCandidate();
    setupMockResponse(mockCandidate);

    const result = await handler.execute(
      new GetCandidateQuery('test-id', 'user-id'),
    );

    expect(result.isSuccess).toBe(true);
    const response = result.value;

    expect(response).toEqual(
      expect.objectContaining({
        id: mockCandidate.id,
        fullName: mockCandidate.fullName,
        title: mockCandidate.title,
        bio: mockCandidate.bio,
        profilePictureUrl: mockCandidate.profilePictureUrl,
        resumeUrl: mockCandidate.resumeUrl,
        preferredCategories: [defaultReferenceData.category],
        preferredWorkLocationTypes: [defaultReferenceData.workLocationType],
        preferredStates: [defaultReferenceData.state],
        preferredEmploymentTypes: [defaultReferenceData.employmentType],
        languages: [defaultReferenceData.language],
      }),
    );
  });

  it('should not allow viewing an unavailable profile as a different user', async () => {
    const unavailableProfile = createMockCandidate({
      isAvailable: false,
      userId: 'owner-id',
    });
    setupMockResponse(unavailableProfile);

    const result = await handler.execute(
      new GetCandidateQuery('any-id', 'different-user'),
    );

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBe(CandidateError.ProfileNotAvailable);
  });

  it('should allow owners to view their unavailable profile', async () => {
    const ownerId = 'owner-id';
    const unavailableProfile = createMockCandidate({
      isAvailable: false,
      userId: ownerId,
    });
    setupMockResponse(unavailableProfile);

    const result = await handler.execute(
      new GetCandidateQuery('any-id', ownerId),
    );

    expect(result.isSuccess).toBe(true);
  });

  it('should handle non-existent profiles', async () => {
    setupMockResponse(null);

    const result = await handler.execute(
      new GetCandidateQuery('non-existent', 'any-user'),
    );

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBe(CandidateError.ProfileNotFound);
  });
});
