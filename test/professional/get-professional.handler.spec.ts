import { GetProfessionalHandler } from '../../src/features/professional/queries/get-professional/get-professional.handler';
import { EntityManager } from '@mikro-orm/postgresql';
import { Test } from '@nestjs/testing';
import { UserRole } from '../../src/domain/user/user-role.enum';
import { Collection } from '@mikro-orm/core';
import { LANGUAGE_LEVELS } from '../../src/domain/common/constants';
import { AuthenticatedUser } from '../../src/infrastructure/security/authenticated-user.interface';
import { GetProfessionalQuery } from '../../src/features/professional/queries/get-professional/get-professional.query';
import { ProfessionalError } from '../../src/features/professional/professional.error';

describe('GetProfessionalHandler', () => {
  let handler: GetProfessionalHandler;
  let em: jest.Mocked<EntityManager>;

  beforeEach(async () => {
    const mockedEm = {
      findOne: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        GetProfessionalHandler,
        { provide: EntityManager, useValue: mockedEm },
      ],
    }).compile();

    handler = module.get(GetProfessionalHandler);
    em = module.get(EntityManager);
  });

  const createMockProfessional = (
    isPublic: boolean,
    memberId: string,
    handle = 'johndoe',
  ) => ({
    isPublic,
    member: {
      id: memberId,
      handle,
      country: { name: 'USA' },
      city: { name: 'New York' },
      languages: new Collection(
        this,
        [{ language: { name: 'English' }, level: LANGUAGE_LEVELS.NATIVE }],
        true,
      ),
      fullName: 'John Doe',
      title: 'Software Engineer',
      bio: 'Test bio',
      avatarUrl: 'test.jpg',
      tags: ['nodejs'],
      socialLinks: { github: 'github.com/johndoe' },
    },
    isOpenToWork: true,
    salaryRangeId: 1,
    hourlyRateRangeId: 1,
    locationTypeIds: [1],
    employmentTypeIds: [1],
    skills: ['JavaScript'],
    resumeUrl: 'resume.pdf',
    email: 'john@example.com',
    phone: '1234567890',
    experiences: new Collection(
      this,
      [
        {
          title: 'Senior Dev',
          yearsOfExperience: 5,
          description: 'Led team',
        },
      ],
      true,
    ),
    projects: new Collection(
      this,
      [
        {
          title: 'Project X',
          description: 'Cool project',
          url: 'project.com',
        },
      ],
      true,
    ),
  });

  const createAuthUser = (
    id: string,
    role: UserRole,
    profileId: string,
  ): AuthenticatedUser => ({
    id,
    role,
    profileId,
  });

  it('should return NotFound when professional does not exist', async () => {
    // Arrange
    jest.spyOn(em, 'findOne').mockResolvedValue(null);
    const authUser = createAuthUser('1', UserRole.MEMBER, '1');
    const query = new GetProfessionalQuery(authUser, 'nonexistent');

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.error).toBe(ProfessionalError.NotFound);
  });

  it('should allow admin to access private profile', async () => {
    // Arrange
    const professional = createMockProfessional(false, '1');
    jest.spyOn(em, 'findOne').mockResolvedValue(professional);
    const authUser = createAuthUser('1', UserRole.ADMIN, '2');
    const query = new GetProfessionalQuery(authUser, 'johndoe');

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.value.member.handle).toBe('johndoe');
  });

  it('should allow owner to access their private profile', async () => {
    // Arrange
    const professional = createMockProfessional(false, '1');
    jest.spyOn(em, 'findOne').mockResolvedValue(professional);
    const authUser = createAuthUser('2', UserRole.MEMBER, '1');
    const query = new GetProfessionalQuery(authUser, 'johndoe');

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.value.member.handle).toBe('johndoe');
  });

  it('should not allow non-owner member to access private profile', async () => {
    // Arrange
    const professional = createMockProfessional(false, '1');
    jest.spyOn(em, 'findOne').mockResolvedValue(professional);
    const authUser = createAuthUser('2', UserRole.MEMBER, '2');
    const query = new GetProfessionalQuery(authUser, 'johndoe');

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.error).toBe(ProfessionalError.NotFound);
  });

  it('should allow company to access public profile', async () => {
    // Arrange
    const professional = createMockProfessional(true, '1');
    jest.spyOn(em, 'findOne').mockResolvedValue(professional);
    const authUser = createAuthUser('2', UserRole.COMPANY, '2');
    const query = new GetProfessionalQuery(authUser, 'johndoe');

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.value.member.handle).toBe('johndoe');
  });

  it('should not allow member to access public profile', async () => {
    // Arrange
    const professional = createMockProfessional(true, '1');
    jest.spyOn(em, 'findOne').mockResolvedValue(professional);
    const authUser = createAuthUser('2', UserRole.MEMBER, '2');
    const query = new GetProfessionalQuery(authUser, 'johndoe');

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.error).toBe(ProfessionalError.NotFound);
  });

  it('should correctly map professional data', async () => {
    // Arrange
    const professional = createMockProfessional(true, '1');
    jest.spyOn(em, 'findOne').mockResolvedValue(professional);
    const authUser = createAuthUser('1', UserRole.ADMIN, '2');
    const query = new GetProfessionalQuery(authUser, 'johndoe');

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result.isSuccess).toBe(true);
    const value = result.value;
    expect(value.member.handle).toBe('johndoe');
    expect(value.member.fullName).toBe('John Doe');
    expect(value.member.location.country).toBe('USA');
    expect(value.member.location.city).toBe('New York');
    expect(value.member.languages[0].name).toBe('English');
    expect(value.isOpenToWork).toBe(true);
    expect(value.skills).toEqual(['JavaScript']);
    expect(value.experiences[0].title).toBe('Senior Dev');
    expect(value.projects[0].title).toBe('Project X');
  });
});
