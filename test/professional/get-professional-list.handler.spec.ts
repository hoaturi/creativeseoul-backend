import { EntityManager } from '@mikro-orm/postgresql';
import { Test } from '@nestjs/testing';
import { GetProfessionalListHandler } from '../../src/features/professional/queries/get-professional-list/get-professional-list.handler';
import { Professional } from '../../src/domain/professional/professional.entity';
import { GetProfessionalListQuery } from '../../src/features/professional/queries/get-professional-list/get-professional-list.query';
import {
  GetProfessionalListResponseDto,
  ProfessionalListItemDto,
} from '../../src/features/professional/dtos/responses/get-professional-list-response.dto';

describe('GetProfessionalListHandler', () => {
  let handler: GetProfessionalListHandler;
  let mockedEm: jest.Mocked<EntityManager>;

  beforeEach(async () => {
    mockedEm = {
      findAndCount: jest.fn(),
    } as unknown as jest.Mocked<EntityManager>;

    const module = await Test.createTestingModule({
      providers: [
        GetProfessionalListHandler,
        { provide: EntityManager, useValue: mockedEm },
      ],
    }).compile();

    handler = module.get(GetProfessionalListHandler);
  });

  const mockProfessionalData = [
    {
      isPublic: true,
      isOpenToWork: true,
      requiresVisaSponsorship: false,
      skills: ['javascript', 'react'],
      member: {
        handle: 'john-doe',
        fullName: 'John Doe',
        title: 'Software Engineer',
        bio: 'Experienced developer',
        avatarUrl: 'https://example.com/avatar1.jpg',
        country: { name: 'United States' },
        city: { name: 'San Francisco' },
      },
    } as Professional,
    {
      isPublic: true,
      isOpenToWork: false,
      requiresVisaSponsorship: true,
      skills: ['python', 'django'],
      member: {
        handle: 'jane-smith',
        fullName: 'Jane Smith',
        title: 'Backend Developer',
        bio: 'Python expert',
        avatarUrl: 'https://example.com/avatar2.jpg',
        country: { name: 'Canada' },
        city: { name: 'Toronto' },
      },
    } as Professional,
  ];

  it('should return paginated list of professionals with total count', async () => {
    mockedEm.findAndCount.mockResolvedValue([mockProfessionalData, 100]);

    const query = new GetProfessionalListQuery({ page: 1 });
    const result = await handler.execute(query);

    expect(result.isSuccess).toBeTruthy();

    const response = result.value;
    expect(response).toBeInstanceOf(GetProfessionalListResponseDto);
    expect(response.total).toBe(100);
    expect(response.professionals).toHaveLength(2);

    expect(response.professionals[0]).toEqual(
      new ProfessionalListItemDto({
        handle: 'john-doe',
        fullName: 'John Doe',
        title: 'Software Engineer',
        bio: 'Experienced developer',
        avatarUrl: 'https://example.com/avatar1.jpg',
        location: {
          country: 'United States',
          city: 'San Francisco',
        },
        isOpenToWork: true,
        requiresVisaSponsorship: false,
        skills: ['javascript', 'react'],
      }),
    );

    expect(mockedEm.findAndCount).toHaveBeenCalledWith(
      Professional,
      {
        isPublic: true,
        member: {
          qualityScore: { $gte: 40 },
        },
      },
      expect.objectContaining({
        populateWhere: { member: { country: {}, city: {} } },
        fields: expect.arrayContaining([
          'isOpenToWork',
          'requiresVisaSponsorship',
          'skills',
          'member.handle',
          'member.fullName',
        ]),
        limit: 20,
        offset: 0,
      }),
    );
  });

  it('should handle search filtering', async () => {
    mockedEm.findAndCount.mockResolvedValue([[mockProfessionalData[0]], 1]);

    const query = new GetProfessionalListQuery({
      search: 'javascript developer',
    });
    const result = await handler.execute(query);

    expect(result.isSuccess).toBeTruthy();

    const response = result.value;
    expect(response.professionals).toHaveLength(1);

    expect(mockedEm.findAndCount).toHaveBeenCalledWith(
      Professional,
      expect.objectContaining({
        isPublic: true,
        member: {
          qualityScore: { $gte: 40 },
        },
        $and: [
          { searchVector: { $fulltext: 'javascript & developer' } },
          {
            member: {
              searchVector: { $fulltext: 'javascript & developer' },
            },
          },
        ],
      }),
      expect.any(Object),
    );
  });

  it('should handle multiple filters', async () => {
    mockedEm.findAndCount.mockResolvedValue([[mockProfessionalData[0]], 1]);

    const query = new GetProfessionalListQuery({
      countryId: 1,
      employmentTypeIds: [1, 2],
      locationTypeIds: [1],
      isOpenToWork: true,
    });
    const result = await handler.execute(query);

    expect(result.isSuccess).toBeTruthy();

    expect(mockedEm.findAndCount).toHaveBeenCalledWith(
      Professional,
      expect.objectContaining({
        isPublic: true,
        member: {
          qualityScore: { $gte: 40 },
          country: { id: 1 },
        },
        employmentTypeIds: { $contains: [1, 2] },
        locationTypeIds: { $contains: [1] },
        isOpenToWork: true,
      }),
      expect.any(Object),
    );
  });

  it('should handle empty search results', async () => {
    mockedEm.findAndCount.mockResolvedValue([[], 0]);

    const query = new GetProfessionalListQuery({ search: 'nonexistent' });
    const result = await handler.execute(query);

    expect(result.isSuccess).toBeTruthy();

    const response = result.value;
    expect(response.professionals).toHaveLength(0);
    expect(response.total).toBe(0);
  });

  it('should use default page 1 when page is not provided', async () => {
    mockedEm.findAndCount.mockResolvedValue([mockProfessionalData, 100]);

    const query = new GetProfessionalListQuery({});
    const result = await handler.execute(query);

    expect(result.isSuccess).toBeTruthy();

    expect(mockedEm.findAndCount).toHaveBeenCalledWith(
      Professional,
      expect.any(Object),
      expect.objectContaining({
        limit: 20,
        offset: 0,
      }),
    );
  });

  it('should handle pagination correctly', async () => {
    mockedEm.findAndCount.mockResolvedValue([[mockProfessionalData[1]], 100]);

    const query = new GetProfessionalListQuery({ page: 2 });
    const result = await handler.execute(query);

    expect(result.isSuccess).toBeTruthy();

    const response = result.value;
    expect(response.professionals).toHaveLength(1);
    expect(response.total).toBe(100);
    expect(response.professionals[0].handle).toBe('jane-smith');

    expect(mockedEm.findAndCount).toHaveBeenCalledWith(
      Professional,
      expect.any(Object),
      expect.objectContaining({
        limit: 20,
        offset: 20,
      }),
    );
  });
});
