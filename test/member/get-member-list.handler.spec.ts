import { EntityManager } from '@mikro-orm/postgresql';
import { Test } from '@nestjs/testing';
import { GetMemberListQuery } from '../../src/features/member/queries/get-member-list/get-member-list.query';
import { GetMemberListHandler } from '../../src/features/member/queries/get-member-list/get-member-list.handler';
import {
  GetMemberListResponseDto,
  MemberListItemDto,
} from '../../src/features/member/dtos/responses/get-member-list-response.dto';
import { MemberLocationResponseDto } from '../../src/features/common/dtos/member-location-response.dto';
import { Member } from '../../src/domain/member/member.entity';

describe('GetMemberListHandler', () => {
  let handler: GetMemberListHandler;
  let mockedEm: jest.Mocked<EntityManager>;

  beforeEach(async () => {
    mockedEm = {
      findAndCount: jest.fn(),
    } as unknown as jest.Mocked<EntityManager>;

    const module = await Test.createTestingModule({
      providers: [
        GetMemberListHandler,
        { provide: EntityManager, useValue: mockedEm },
      ],
    }).compile();

    handler = module.get(GetMemberListHandler);
  });

  const mockMemberData: Member[] = [
    {
      id: '1',
      handle: 'john-doe',
      fullName: 'John Doe',
      title: 'Software Engineer',
      avatarUrl: 'https://example.com/avatar1.jpg',
      tags: ['javascript', 'react'],
      country: { name: 'United States' },
      city: { name: 'San Francisco' },
    } as Member,
    {
      id: '2',
      handle: 'jane-smith',
      fullName: 'Jane Smith',
      title: 'Product Designer',
      avatarUrl: 'https://example.com/avatar2.jpg',
      tags: ['ui', 'ux'],
      country: { name: 'Canada' },
      city: null,
    } as Member,
  ];

  it('should return paginated list of members with total count', async () => {
    mockedEm.findAndCount.mockResolvedValue([mockMemberData, 100]);

    const query = new GetMemberListQuery({ page: 1 });
    const result = await handler.execute(query);

    expect(result.isSuccess).toBeTruthy();

    const response = result.value;
    expect(response).toBeInstanceOf(GetMemberListResponseDto);
    expect(response.total).toBe(100);
    expect(response.members).toHaveLength(2);

    expect(response.members[0]).toEqual(
      new MemberListItemDto({
        handle: 'john-doe',
        fullName: 'John Doe',
        title: 'Software Engineer',
        avatarUrl: 'https://example.com/avatar1.jpg',
        tags: ['javascript', 'react'],
        location: new MemberLocationResponseDto(
          'United States',
          'San Francisco',
        ),
      }),
    );

    expect(response.members[1]).toEqual(
      new MemberListItemDto({
        handle: 'jane-smith',
        fullName: 'Jane Smith',
        title: 'Product Designer',
        avatarUrl: 'https://example.com/avatar2.jpg',
        tags: ['ui', 'ux'],
        location: new MemberLocationResponseDto('Canada', undefined),
      }),
    );

    expect(mockedEm.findAndCount).toHaveBeenCalledWith(
      Member,
      { qualityScore: { $gt: 40 } },
      expect.objectContaining({
        populate: ['country', 'city'],
        limit: 20,
        offset: 0,
      }),
    );
  });

  it('should handle empty search results', async () => {
    mockedEm.findAndCount.mockResolvedValue([[], 0]);

    const query = new GetMemberListQuery({ search: 'nonexistent' });
    const result = await handler.execute(query);

    expect(result.isSuccess).toBeTruthy();

    const response = result.value;
    expect(response.members).toHaveLength(0);
    expect(response.total).toBe(0);

    expect(mockedEm.findAndCount).toHaveBeenCalledWith(
      Member,
      expect.objectContaining({
        qualityScore: { $gt: 40 },
        searchVector: { $fulltext: 'nonexistent' },
      }),
      expect.any(Object),
    );
  });

  it('should handle country filtering', async () => {
    mockedEm.findAndCount.mockResolvedValue([[mockMemberData[0]], 1]);

    const query = new GetMemberListQuery({ countryId: 1 });
    const result = await handler.execute(query);

    expect(result.isSuccess).toBeTruthy();

    const response = result.value;
    expect(response.members).toHaveLength(1);
    expect(response.members[0].location.country).toBe('United States');

    expect(mockedEm.findAndCount).toHaveBeenCalledWith(
      Member,
      expect.objectContaining({
        qualityScore: { $gt: 40 },
        country_id: 1,
      }),
      expect.any(Object),
    );
  });

  it('should use default page 1 when page is not provided', async () => {
    mockedEm.findAndCount.mockResolvedValue([mockMemberData, 100]);

    const query = new GetMemberListQuery({});
    const result = await handler.execute(query);

    expect(result.isSuccess).toBeTruthy();

    const response = result.value;
    expect(response.members).toHaveLength(2);

    expect(mockedEm.findAndCount).toHaveBeenCalledWith(
      Member,
      expect.any(Object),
      expect.objectContaining({
        limit: 20,
        offset: 0,
      }),
    );
  });

  it('should handle pagination correctly', async () => {
    mockedEm.findAndCount.mockResolvedValue([[mockMemberData[1]], 100]);

    const query = new GetMemberListQuery({ page: 2 });
    const result = await handler.execute(query);

    expect(result.isSuccess).toBeTruthy();

    const response = result.value;
    expect(response.members).toHaveLength(1);
    expect(response.total).toBe(100);
    expect(response.members[0].handle).toBe('jane-smith');

    expect(mockedEm.findAndCount).toHaveBeenCalledWith(
      Member,
      expect.any(Object),
      expect.objectContaining({
        limit: 20,
        offset: 20,
      }),
    );
  });
});
