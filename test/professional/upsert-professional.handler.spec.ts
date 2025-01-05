import { Test } from '@nestjs/testing';
import { EntityManager } from '@mikro-orm/postgresql';
import { UpsertProfessionalHandler } from '../../src/features/professional/commands/upsert-professional/upsert-professional.handler';
import { UpsertProfessionalRequestDto } from '../../src/features/professional/dtos/upsert-professional-request.dto';
import { Member } from '../../src/domain/member/member.entity';
import { UpsertProfessionalCommand } from '../../src/features/professional/commands/upsert-professional/upsert-professional.command';
import { Professional } from '../../src/domain/professional/professional.entity';

jest.mock('@mikro-orm/postgresql', () => ({
  ...jest.requireActual('@mikro-orm/postgresql'),
  Collection: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    set: jest.fn(),
  })),
}));

describe('UpsertProfessionalHandler', () => {
  let handler: UpsertProfessionalHandler;
  let em: jest.Mocked<EntityManager>;

  const createValidDto = (): UpsertProfessionalRequestDto => ({
    isPublic: true,
    isOpenToWork: true,
    isContactable: true,
    hourlyRateRangeId: 2,
    salaryRangeId: 3,
    employmentTypeIds: [1, 2],
    locationTypeIds: [1, 3],
    experiences: [
      {
        title: 'Senior Developer',
        yearsOfExperience: 3,
        description: 'Led development team',
      },
    ],
    projects: [
      {
        title: 'E-commerce Platform',
        description: 'Built scalable e-commerce solution',
        url: 'https://example.com/project',
      },
    ],
    skills: ['javascript', 'typescript'],
    email: 'test@example.com',
    phone: '+1234567890',
    resumeUrl: 'https://example.com/resume.pdf',
  });

  beforeEach(async () => {
    const mockedEm = {
      findOne: jest.fn(),
      persist: jest.fn(),
      flush: jest.fn(),
      getReference: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        UpsertProfessionalHandler,
        { provide: EntityManager, useValue: mockedEm },
      ],
    }).compile();

    handler = module.get<UpsertProfessionalHandler>(UpsertProfessionalHandler);
    em = module.get<jest.Mocked<EntityManager>>(EntityManager);
  });

  it('should create a new professional when one does not exist', async () => {
    // Arrange
    const dto = createValidDto();
    const profileId = 'test-profile-id';

    em.findOne.mockResolvedValue(null);
    em.getReference.mockImplementation(
      () => new Member('Test User', 'test-handle'),
    );

    // Act
    const result = await handler.execute(
      new UpsertProfessionalCommand(profileId, dto),
    );

    // Assert
    expect(result.isSuccess).toBeTruthy();
    expect(em.persist).toHaveBeenCalledTimes(3); // professional + experiences + projects
    expect(em.flush).toHaveBeenCalled();
  });

  it('should update an existing professional', async () => {
    // Arrange
    const dto = createValidDto();
    const profileId = 'test-profile-id';
    const member = new Member('Test User', 'test-handle');
    const professional = new Professional(member, {
      isPublic: false,
      isOpenToWork: false,
      isContactable: false,
      employmentTypeIds: [1],
      locationTypeIds: [1],
    });

    em.findOne.mockResolvedValue(professional);

    // Act
    const result = await handler.execute(
      new UpsertProfessionalCommand(profileId, dto),
    );

    // Assert
    expect(result.isSuccess).toBeTruthy();
    expect(em.persist).toHaveBeenCalledTimes(2); // experiences + projects
    expect(professional.experiences.set).toHaveBeenCalled();
    expect(professional.projects.set).toHaveBeenCalled();
    expect(em.flush).toHaveBeenCalled();
  });

  it('should handle experiences and projects during creation', async () => {
    // Arrange
    const dto = createValidDto();
    const profileId = 'test-profile-id';
    let capturedProfessional: Professional;

    em.findOne.mockResolvedValue(null);
    em.getReference.mockImplementation(
      () => new Member('Test User', 'test-handle'),
    );
    em.persist.mockImplementation((entity) => {
      if (entity instanceof Professional) {
        capturedProfessional = entity;
      }
      return em;
    });

    // Act
    const result = await handler.execute(
      new UpsertProfessionalCommand(profileId, dto),
    );

    // Assert
    expect(result.isSuccess).toBeTruthy();
    expect(em.persist).toHaveBeenCalled();
    expect(capturedProfessional.experiences.add).toHaveBeenCalled();
    expect(capturedProfessional.projects.add).toHaveBeenCalled();
  });

  it('should update professional data during update', async () => {
    // Arrange
    const dto = createValidDto();
    const profileId = 'test-profile-id';
    const member = new Member('Test User', 'test-handle');
    const professional = new Professional(member, {
      isPublic: false,
      isOpenToWork: false,
      isContactable: false,
      employmentTypeIds: [1],
      locationTypeIds: [1],
    });

    em.findOne.mockResolvedValue(professional);

    // Act
    await handler.execute(new UpsertProfessionalCommand(profileId, dto));

    // Assert
    expect(professional.isPublic).toBe(dto.isPublic);
    expect(professional.isOpenToWork).toBe(dto.isOpenToWork);
    expect(professional.isContactable).toBe(dto.isContactable);
    expect(professional.employmentTypeIds).toEqual(dto.employmentTypeIds);
    expect(professional.locationTypeIds).toEqual(dto.locationTypeIds);
  });
});
