import { GetMemberHandler } from '../../src/features/member/queries/get-member/get-member.handler';
import { EntityManager } from '@mikro-orm/postgresql';
import { Test } from '@nestjs/testing';
import { GetMemberQuery } from '../../src/features/member/queries/get-member/get-member-query';
import { Member } from '../../src/domain/member/member.entity';
import { MemberError } from '../../src/features/member/member.error';
import { MemberLanguageProficiencyResponseDto } from '../../src/features/common/dtos/member-language-proficiency-response.dto';
import { MemberLocationResponseDto } from '../../src/features/common/dtos/member-location-response.dto';
import { MemberSocialLinksResponseDto } from '../../src/features/member/dtos/responses/member-social-links-response.dto';
import { GetMemberResponseDto } from '../../src/features/member/dtos/responses/get-member-response.dto';
import { LANGUAGE_LEVELS } from '../../src/domain/common/constants';

describe('GetMemberHandler', () => {
  let handler: GetMemberHandler;
  let em: jest.Mocked<EntityManager>;

  const createMockMember = (overrides = {}) =>
    ({
      handle: 'test-handle',
      fullName: 'Test User',
      title: 'Developer',
      bio: 'Test bio',
      avatarUrl: 'https://example.com/avatar.jpg',
      tags: ['tag1', 'tag2'],
      languages: {
        getItems: jest
          .fn()
          .mockReturnValue([
            { language: { name: 'English' }, level: LANGUAGE_LEVELS.NATIVE },
          ]),
      },
      country: { name: 'Country' },
      city: { name: 'City' },
      socialLinks: {
        instagram: 'https://example.com/social',
      },
      professional: {
        isOpenToWork: true,
      },
      ...overrides,
    }) as unknown as Member;

  beforeEach(async () => {
    const mockedEm = {
      findOne: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        GetMemberHandler,
        { provide: EntityManager, useValue: mockedEm },
      ],
    }).compile();

    handler = module.get(GetMemberHandler);
    em = module.get(EntityManager);

    jest.clearAllMocks();
  });

  it('should return a successful result with complete member profile', async () => {
    const mockMember = createMockMember();
    const query = new GetMemberQuery('test-handle');

    em.findOne.mockResolvedValueOnce(mockMember);

    const result = await handler.execute(query);

    expect(result.isSuccess).toBeTruthy();
    expect(result.value).toEqual(
      new GetMemberResponseDto({
        handle: 'test-handle',
        fullName: 'Test User',
        title: 'Developer',
        bio: 'Test bio',
        avatarUrl: 'https://example.com/avatar.jpg',
        tags: ['tag1', 'tag2'],
        languages: [
          new MemberLanguageProficiencyResponseDto(
            'English',
            LANGUAGE_LEVELS.NATIVE,
          ),
        ],
        location: new MemberLocationResponseDto('Country', 'City'),
        socialLinks: new MemberSocialLinksResponseDto({
          instagram: 'https://example.com/social',
        }),
        isOpenToWork: true,
      }),
    );
  });

  it('should handle member without city', async () => {
    const mockMember = createMockMember({ city: null });
    const query = new GetMemberQuery('test-handle');

    em.findOne.mockResolvedValueOnce(mockMember);

    const result = await handler.execute(query);

    expect(result.isSuccess).toBeTruthy();
    expect(result.value.location).toEqual(
      new MemberLocationResponseDto('Country', undefined),
    );
    expect(result.value.isOpenToWork).toBe(true);
  });

  it('should handle member without languages', async () => {
    const mockMember = createMockMember({
      languages: { getItems: jest.fn().mockReturnValue([]) },
    });
    const query = new GetMemberQuery('test-handle');

    em.findOne.mockResolvedValueOnce(mockMember);

    const result = await handler.execute(query);

    expect(result.isSuccess).toBeTruthy();
    expect(result.value.languages).toEqual([]);
    expect(result.value.isOpenToWork).toBe(true);
  });

  it('should handle member without professional information', async () => {
    const mockMember = createMockMember({
      professional: null,
    });
    const query = new GetMemberQuery('test-handle');

    em.findOne.mockResolvedValueOnce(mockMember);

    const result = await handler.execute(query);

    expect(result.isSuccess).toBeTruthy();
    expect(result.value.isOpenToWork).toBe(undefined);
  });

  it('should return a failure result when member is not found', async () => {
    const query = new GetMemberQuery('non-existent-handle');

    em.findOne.mockResolvedValueOnce(null);

    const result = await handler.execute(query);

    expect(result.isSuccess).toBeFalsy();
    expect(result.error).toBe(MemberError.NotFound);
  });
});
