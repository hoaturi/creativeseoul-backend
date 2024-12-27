import { EntityManager, QueryBuilder } from '@mikro-orm/postgresql';
import { Test } from '@nestjs/testing';
import { GetMemberListQuery } from '../../src/features/member/queries/get-member-list/get-member-list.query';
import { GetMemberListHandler } from '../../src/features/member/queries/get-member-list/get-member-list.handler';
import {
  GetMemberListResponseDto,
  MemberListItemDto,
} from '../../src/features/member/dtos/responses/get-member-list-response.dto';
import { MemberLocationResponseDto } from '../../src/features/common/dtos/member-location-response.dto';
import { Member } from '../../src/domain/member/member.entity';

type MemberQueryResult = {
  id: string;
  handle: string;
  fullName: string;
  title: string;
  avatarUrl?: string;
  tags?: string[];
  country: {
    name: string;
  };
  city?: {
    name: string;
  };
};

describe('GetMemberListHandler', () => {
  let handler: GetMemberListHandler;
  let mockQueryBuilder: jest.Mocked<QueryBuilder<Member>>;

  beforeEach(async () => {
    mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      getResultAndCount: jest.fn(),
    } as unknown as jest.Mocked<QueryBuilder<Member>>;

    const mockedEm = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    const module = await Test.createTestingModule({
      providers: [
        GetMemberListHandler,
        { provide: EntityManager, useValue: mockedEm },
      ],
    }).compile();

    handler = module.get(GetMemberListHandler);
  });

  const mockMemberData: MemberQueryResult[] = [
    {
      id: '1',
      handle: 'john-doe',
      fullName: 'John Doe',
      title: 'Software Engineer',
      avatarUrl: 'https://example.com/avatar1.jpg',
      tags: ['javascript', 'react'],
      country: { name: 'United States' },
      city: { name: 'San Francisco' },
    },
    {
      id: '2',
      handle: 'jane-smith',
      fullName: 'Jane Smith',
      title: 'Product Designer',
      avatarUrl: 'https://example.com/avatar2.jpg',
      tags: ['ui', 'ux'],
      country: { name: 'Canada' },
      city: null,
    },
  ];

  it('should return paginated list of members with total count', async () => {
    mockQueryBuilder.getResultAndCount.mockResolvedValue([
      mockMemberData as unknown as Member[],
      100,
    ]);

    const query = new GetMemberListQuery({ page: 1 });
    const result = await handler.execute(query);

    expect(result.isSuccess).toBeTruthy();
    if (!result.isSuccess) return;

    const response = result.value;
    expect(response).toBeInstanceOf(GetMemberListResponseDto);
    expect(response.total).toBe(100);
    expect(response.members).toHaveLength(2);

    // Verify first member data mapping
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

    // Verify second member without city
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
  });

  it('should handle empty search results', async () => {
    mockQueryBuilder.getResultAndCount.mockResolvedValue([[] as Member[], 0]);

    const query = new GetMemberListQuery({ search: 'nonexistent' });
    const result = await handler.execute(query);

    expect(result.isSuccess).toBeTruthy();
    if (!result.isSuccess) return;

    const response = result.value;
    expect(response.members).toHaveLength(0);
    expect(response.total).toBe(0);
  });

  it('should handle country filtering', async () => {
    mockQueryBuilder.getResultAndCount.mockResolvedValue([
      [mockMemberData[0]] as unknown as Member[],
      1,
    ]);

    const query = new GetMemberListQuery({ countryId: 1 });
    const result = await handler.execute(query);

    expect(result.isSuccess).toBeTruthy();
    if (!result.isSuccess) return;

    const response = result.value;
    expect(response.members).toHaveLength(1);
    expect(response.members[0].location.country).toBe('United States');
  });

  it('should use default page 1 when page is not provided', async () => {
    mockQueryBuilder.getResultAndCount.mockResolvedValue([
      mockMemberData as unknown as Member[],
      100,
    ]);

    const query = new GetMemberListQuery({});
    const result = await handler.execute(query);

    expect(result.isSuccess).toBeTruthy();
    if (!result.isSuccess) return;

    const response = result.value;
    expect(response.members).toHaveLength(2);
  });

  it('should handle pagination correctly', async () => {
    mockQueryBuilder.getResultAndCount.mockResolvedValue([
      [mockMemberData[1]] as unknown as Member[],
      100,
    ]);

    const query = new GetMemberListQuery({ page: 2 });
    const result = await handler.execute(query);

    expect(result.isSuccess).toBeTruthy();
    if (!result.isSuccess) return;

    const response = result.value;
    expect(response.members).toHaveLength(1);
    expect(response.total).toBe(100);
    expect(response.members[0].handle).toBe('jane-smith');
  });
});
