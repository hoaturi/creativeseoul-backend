import { UpdateMemberCommand } from '../../src/features/member/commands/update-candidate/update-member.command';
import { Member } from '../../src/domain/member/member.entity';
import { Country } from '../../src/domain/common/entities/country.entity';
import { Language } from '../../src/domain/common/entities/language.entity';
import { UpdateMemberHandler } from '../../src/features/member/commands/update-candidate/update-member.handler';
import { EntityManager } from '@mikro-orm/postgresql';
import { MemberScoringService } from '../../src/infrastructure/services/member-scoring/member-scoring.service';
import { UpdateMemberRequestDto } from '../../src/features/member/dtos/requests/update-member-request.dto';
import { LANGUAGE_LEVELS } from '../../src/domain/common/constants';
import { Test } from '@nestjs/testing';
import clearAllMocks = jest.clearAllMocks;

jest.mock('@mikro-orm/postgresql', () => ({
  ...jest.requireActual('@mikro-orm/postgresql'),
  Collection: jest.fn().mockImplementation(() => ({
    set: jest.fn(),
  })),
}));

describe('UpdateMemberHandler', () => {
  let handler: UpdateMemberHandler;
  let em: jest.Mocked<EntityManager>;
  let scoringService: jest.Mocked<MemberScoringService>;

  const createValidDto = (): UpdateMemberRequestDto => ({
    handle: 'testhandle',
    fullName: 'Test User',
    title: 'Software Engineer',
    bio: 'Test bio',
    countryId: 1,
    city: 'Test City',
    languages: [
      {
        languageId: 1,
        level: LANGUAGE_LEVELS.FLUENT,
      },
    ],
    tags: ['javascript', 'typescript'],
    avatarUrl: 'https://example.com/avatar.jpg',
    socialLinks: {
      twitter: 'https://twitter.com/handle',
      github: 'https://github.com/handle',
    },
  });

  beforeEach(async () => {
    const mockedEm = {
      findOne: jest.fn(),
      create: jest.fn(),
      flush: jest.fn(),
      getReference: jest.fn(),
    };

    const mockedScoringService = {
      calculateProfileScore: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        UpdateMemberHandler,
        { provide: EntityManager, useValue: mockedEm },
        { provide: MemberScoringService, useValue: mockedScoringService },
      ],
    }).compile();

    handler = module.get<UpdateMemberHandler>(UpdateMemberHandler);
    em = module.get<jest.Mocked<EntityManager>>(EntityManager);
    scoringService =
      module.get<jest.Mocked<MemberScoringService>>(MemberScoringService);

    clearAllMocks();
  });

  it('should update member basic information', async () => {
    // Arrange
    const dto = createValidDto();
    const profileId = 'test-profile-id';
    const member = new Member('Old Name', 'old-handle');

    em.findOne.mockResolvedValue(member);
    scoringService.calculateProfileScore.mockReturnValue(85);

    // Act
    const result = await handler.execute(
      new UpdateMemberCommand(profileId, dto),
    );

    // Assert
    expect(result.isSuccess).toBeTruthy();
    expect(member.handle).toBe(dto.handle);
    expect(member.fullName).toBe(dto.fullName);
    expect(member.title).toBe(dto.title);
    expect(member.bio).toBe(dto.bio);
    expect(member.tags).toEqual(dto.tags);
    expect(member.socialLinks).toEqual(dto.socialLinks);
  });

  it('should handle city creation when city does not exist', async () => {
    // Arrange
    const dto = createValidDto();
    const profileId = 'test-profile-id';
    const member = new Member('Test User', 'test-handle');
    const country = new Country('Test Country', 'test-country');

    em.findOne
      .mockResolvedValueOnce(member) // First call for member
      .mockResolvedValueOnce(null); // Second call for city
    em.getReference.mockReturnValue(country);
    em.create.mockImplementation((_, city) => city);

    // Act
    const result = await handler.execute(
      new UpdateMemberCommand(profileId, dto),
    );

    // Assert
    expect(result.isSuccess).toBeTruthy();
    expect(em.create).toHaveBeenCalled();
    expect(member.city).toBeDefined();
    expect(member.country).toBeDefined();
  });

  it('should update member languages', async () => {
    // Arrange
    const dto = createValidDto();
    const profileId = 'test-profile-id';
    const member = new Member('Test User', 'test-handle');
    const language = new Language('English', 'en');

    em.findOne.mockResolvedValue(member);
    em.getReference.mockReturnValue(language);

    // Act
    const result = await handler.execute(
      new UpdateMemberCommand(profileId, dto),
    );

    // Assert
    expect(result.isSuccess).toBeTruthy();
    expect(member.languages.set).toHaveBeenCalled();
  });

  it('should update promotion timestamp only after cooldown period', async () => {
    // Arrange
    const dto = createValidDto();
    const profileId = 'test-profile-id';
    const member = new Member('Test User', 'test-handle');

    // Set last promotion to 15 days ago (beyond cooldown)
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
    member.promotedAt = fifteenDaysAgo;

    em.findOne.mockResolvedValue(member);

    // Act
    const result = await handler.execute(
      new UpdateMemberCommand(profileId, dto),
    );

    // Assert
    expect(result.isSuccess).toBeTruthy();
    expect(member.promotedAt).not.toEqual(fifteenDaysAgo);
  });

  it('should not update promotion timestamp within cooldown period', async () => {
    // Arrange
    const dto = createValidDto();
    const profileId = 'test-profile-id';
    const member = new Member('Test User', 'test-handle');

    // Set last promotion to 13 days ago (within cooldown)
    const thirteenDaysAgo = new Date();
    thirteenDaysAgo.setDate(thirteenDaysAgo.getDate() - 13);
    member.promotedAt = thirteenDaysAgo;

    em.findOne.mockResolvedValue(member);

    // Act
    const result = await handler.execute(
      new UpdateMemberCommand(profileId, dto),
    );

    // Assert
    expect(result.isSuccess).toBeTruthy();
    expect(member.promotedAt).toEqual(thirteenDaysAgo);
  });

  it('should update quality score after member update', async () => {
    // Arrange
    const dto = createValidDto();
    const profileId = 'test-profile-id';
    const member = new Member('Test User', 'test-handle');
    const expectedScore = 85;

    em.findOne.mockResolvedValue(member);
    scoringService.calculateProfileScore.mockReturnValue(expectedScore);

    // Act
    const result = await handler.execute(
      new UpdateMemberCommand(profileId, dto),
    );

    // Assert
    expect(result.isSuccess).toBeTruthy();
    expect(scoringService.calculateProfileScore).toHaveBeenCalledWith(member);
    expect(member.qualityScore).toBe(expectedScore);
  });
});
