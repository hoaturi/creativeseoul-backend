import { EntityManager } from '@mikro-orm/postgresql';
import { Test } from '@nestjs/testing';
import { GetCandidateHandler } from '../../src/features/candidate/query/get-candidate/get-candidate.handler';
import { GetCandidateQuery } from '../../src/features/candidate/query/get-candidate/get-candidate.query';
import { CandidateError } from '../../src/features/candidate/candidate.error';
import { LANGUAGE_LEVELS } from '../../src/domain/common/constants';

describe('GetCandidateHandler', () => {
  let handler: GetCandidateHandler;
  let em: jest.Mocked<EntityManager>;

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

  it('should return all required profile fields', async () => {
    // Arrange
    const profile = {
      id: 'test-id',
      fullName: 'John Doe',
      title: 'Software Engineer',
      bio: 'Test bio',
      profilePictureUrl: 'test-url',
      resumeUrl: 'test-resume',
      isAvailable: true,
      user: { id: 'user-id' },
      preferredCategories: { getIdentifiers: () => ['category-1'] },
      preferredWorkLocationTypes: { getIdentifiers: () => ['location-1'] },
      preferredStates: { getIdentifiers: () => ['state-1'] },
      preferredEmploymentTypes: { getIdentifiers: () => ['type-1'] },
      languages: {
        getItems: () => [
          {
            language: { id: 1 },
            proficiencyLevel: LANGUAGE_LEVELS.ADVANCED,
          },
        ],
      },
    };
    em.findOne.mockResolvedValue(profile);

    // Act
    const result = await handler.execute(
      new GetCandidateQuery('test-id', 'user-id'),
    );

    // Assert
    expect(result.isSuccess).toBeTruthy();
    const responseDto = result.value;

    expect(responseDto).toEqual(
      expect.objectContaining({
        id: profile.id,
        fullName: profile.fullName,
        title: profile.title,
        bio: profile.bio,
        profilePictureUrl: profile.profilePictureUrl,
        resumeUrl: profile.resumeUrl,
        preferredCategories: ['category-1'],
        preferredWorkLocationTypes: ['location-1'],
        preferredStates: ['state-1'],
        preferredEmploymentTypes: ['type-1'],
        languages: [
          {
            languageId: 1,
            proficiencyLevel: LANGUAGE_LEVELS.ADVANCED,
          },
        ],
      }),
    );
  });

  it('should not allow viewing an unavailable profile as a different user', async () => {
    // Arrange
    const unavailableProfile = createTestCandidate({
      isAvailable: false,
      userId: 'owner-id',
    });
    em.findOne.mockResolvedValue(unavailableProfile);

    // Act
    const result = await handler.execute(
      new GetCandidateQuery('any-id', 'different-user'),
    );

    // Assert
    expect(result.isSuccess).toBeFalsy();
    expect(result.error).toBe(CandidateError.ProfileNotAvailable);
  });

  it('should allow owners to view their unavailable profile', async () => {
    // Arrange
    const ownerId = 'owner-id';
    const unavailableProfile = createTestCandidate({
      isAvailable: false,
      userId: ownerId,
    });
    em.findOne.mockResolvedValue(unavailableProfile);

    // Act
    const result = await handler.execute(
      new GetCandidateQuery('any-id', ownerId),
    );

    // Assert
    expect(result.isSuccess).toBeTruthy();
  });

  it('should handle non-existent profiles', async () => {
    // Arrange
    em.findOne.mockResolvedValue(null);

    // Act
    const result = await handler.execute(
      new GetCandidateQuery('non-existent', 'any-user'),
    );

    // Assert
    expect(result.isSuccess).toBeFalsy();
    expect(result.error).toBe(CandidateError.ProfileNotFound);
  });
});

function createTestCandidate(params: {
  isAvailable: boolean;
  userId?: string;
}) {
  return {
    id: 'test-id',
    isAvailable: params.isAvailable,
    user: { id: params.userId || 'default-user' },
    preferredCategories: { getIdentifiers: () => [] },
    preferredWorkLocationTypes: { getIdentifiers: () => [] },
    preferredStates: { getIdentifiers: () => [] },
    preferredEmploymentTypes: { getIdentifiers: () => [] },
    languages: { getItems: () => [] },
  };
}
