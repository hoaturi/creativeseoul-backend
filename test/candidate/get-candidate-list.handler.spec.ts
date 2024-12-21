import { GetCandidateListHandler } from '../../src/features/candidate/query/get-candidate-list/get-candidate-list.handler';
import { EntityManager } from '@mikro-orm/postgresql';
import { Test } from '@nestjs/testing';
import { GetCandidateListQuery } from '../../src/features/candidate/query/get-candidate-list/get-candidate-list.query';
import { ReferenceDataDto } from '../../src/features/common/dtos/reference-data.dto';
import { LanguageWithLevelDto } from '../../src/features/common/dtos/language-with-level.dto';

describe('GetCandidateListHandler', () => {
  let handler: GetCandidateListHandler;
  let em: jest.Mocked<EntityManager>;

  const defaultReferenceData = {
    category: new ReferenceDataDto(1, 'Engineering', 'engineering'),
    workLocationType: new ReferenceDataDto(1, 'Remote', 'remote'),
    state: new ReferenceDataDto(1, 'Seoul', 'seoul'),
    employmentType: new ReferenceDataDto(1, 'FullTime', 'full-time'),
    language: new LanguageWithLevelDto(1, 'English', 'english', 5),
  };

  const createMockCandidate = (id: number) => ({
    id,
    title: `Software Engineer ${id}`,
    bio: `Experienced developer ${id}`,
    profilePictureUrl: `profile${id}.jpg`,
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
    const mockedEm = {
      findAndCount: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        GetCandidateListHandler,
        { provide: EntityManager, useValue: mockedEm },
      ],
    }).compile();

    handler = module.get<GetCandidateListHandler>(GetCandidateListHandler);
    em = module.get(EntityManager);
  });

  const setupMockResponse = (
    candidates: ReturnType<typeof createMockCandidate>[],
    total: number,
  ) => {
    em.findAndCount.mockResolvedValue([candidates, total]);
  };

  it('should return a list of available candidates', async () => {
    const candidates = [createMockCandidate(1), createMockCandidate(2)];
    setupMockResponse(candidates, 2);

    const result = await handler.execute(new GetCandidateListQuery());

    expect(result.isSuccess).toBe(true);
    const response = result.value;
    expect(response.total).toBe(2);
    expect(response.candidates).toHaveLength(2);
    expect(response.candidates[0].title).toBe('Software Engineer 1');
  });

  it('should return empty list when no candidates match criteria', async () => {
    setupMockResponse([], 0);

    const result = await handler.execute(
      new GetCandidateListQuery(undefined, undefined, [999]),
    );

    expect(result.isSuccess).toBe(true);
    const response = result.value;
    expect(response.total).toBe(0);
    expect(response.candidates).toHaveLength(0);
  });

  it('should return second page of results when requested', async () => {
    const candidates = [createMockCandidate(21), createMockCandidate(22)];
    setupMockResponse(candidates, 42);

    const result = await handler.execute(new GetCandidateListQuery(2));

    expect(result.isSuccess).toBe(true);
    const response = result.value;
    expect(response.candidates[0].id).toBe(21);
    expect(response.total).toBe(42);
  });

  it('should filter candidates by search term', async () => {
    const candidates = [createMockCandidate(1)];
    setupMockResponse(candidates, 1);

    const result = await handler.execute(
      new GetCandidateListQuery(undefined, 'javascript expert'),
    );

    expect(result.isSuccess).toBe(true);
    expect(result.value.total).toBe(1);
  });

  it('should filter candidates by multiple criteria', async () => {
    const candidates = [createMockCandidate(1)];
    setupMockResponse(candidates, 1);

    const result = await handler.execute(
      new GetCandidateListQuery(
        undefined,
        undefined,
        [1, 2],
        [1],
        [1],
        undefined,
        [1],
      ),
    );

    expect(result.isSuccess).toBe(true);
    const response = result.value;
    expect(response.total).toBe(1);

    const candidate = response.candidates[0];
    expect(candidate.preferredCategories).toEqual([
      defaultReferenceData.category,
    ]);
    expect(candidate.preferredWorkLocationTypes).toEqual([
      defaultReferenceData.workLocationType,
    ]);
    expect(candidate.languages).toEqual([defaultReferenceData.language]);
  });

  it('should return candidate with all required fields', async () => {
    setupMockResponse([createMockCandidate(1)], 1);

    const result = await handler.execute(new GetCandidateListQuery());

    expect(result.isSuccess).toBe(true);
    const candidate = result.value.candidates[0];

    expect(candidate).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        title: expect.any(String),
        bio: expect.any(String),
        profilePictureUrl: expect.any(String),
        preferredCategories: [expect.any(ReferenceDataDto)],
        preferredEmploymentTypes: [expect.any(ReferenceDataDto)],
        preferredStates: [expect.any(ReferenceDataDto)],
        preferredWorkLocationTypes: [expect.any(ReferenceDataDto)],
        languages: [expect.any(LanguageWithLevelDto)],
      }),
    );
  });
});
