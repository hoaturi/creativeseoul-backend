import { GetCandidateListHandler } from '../../src/features/candidate/query/get-candidate-list/get-candidate-list.handler';
import { EntityManager } from '@mikro-orm/postgresql';
import { Test } from '@nestjs/testing';
import { GetCandidateListQuery } from '../../src/features/candidate/query/get-candidate-list/get-candidate-list.query';
import { Collection } from '@mikro-orm/core';

describe('GetCandidateListHandler', () => {
  let handler: GetCandidateListHandler;
  let em: jest.Mocked<EntityManager>;

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

  const mockCandidate = (id: number) => ({
    id,
    title: `Software Engineer ${id}`,
    bio: `Experienced developer ${id}`,
    profilePictureUrl: `profile${id}.jpg`,
    preferredCategories: {
      getIdentifiers: () => [1],
    } as unknown as Collection<any>,
    preferredWorkLocations: {
      getIdentifiers: () => [1],
    } as unknown as Collection<any>,
    preferredStates: {
      getIdentifiers: () => [1],
    } as unknown as Collection<any>,
    preferredEmploymentTypes: {
      getIdentifiers: () => [1],
    } as unknown as Collection<any>,
    languages: [{ language: { id: 1 } }],
  });

  it('should return a list of available candidates', async () => {
    // Given
    const candidates = [mockCandidate(1), mockCandidate(2)];
    em.findAndCount.mockResolvedValue([candidates, 2]);

    // When
    const result = await handler.execute(new GetCandidateListQuery());

    // Then
    expect(result.isSuccess).toBe(true);
    const response = result.value;
    expect(response.total).toBe(2);
    expect(response.candidates).toHaveLength(2);
    expect(response.candidates[0]).toHaveProperty(
      'title',
      'Software Engineer 1',
    );
  });

  it('should return empty list when no candidates match criteria', async () => {
    // Given
    em.findAndCount.mockResolvedValue([[], 0]);

    // When
    const result = await handler.execute(
      new GetCandidateListQuery(undefined, undefined, [999]),
    );

    // Then
    expect(result.isSuccess).toBe(true);
    const response = result.value;
    expect(response.total).toBe(0);
    expect(response.candidates).toHaveLength(0);
  });

  it('should return second page of results when requested', async () => {
    // Given
    const candidates = [mockCandidate(21), mockCandidate(22)];
    em.findAndCount.mockResolvedValue([candidates, 42]);

    // When
    const result = await handler.execute(new GetCandidateListQuery(2));

    // Then
    expect(result.isSuccess).toBe(true);
    const response = result.value;
    expect(response.candidates[0].id).toBe(21);
    expect(response.total).toBe(42);
  });

  it('should filter candidates by search term', async () => {
    // Given
    const candidates = [mockCandidate(1)];
    em.findAndCount.mockResolvedValue([candidates, 1]);

    // When
    const result = await handler.execute(
      new GetCandidateListQuery(undefined, 'javascript expert'),
    );

    // Then
    expect(result.isSuccess).toBe(true);
    expect(result.value.total).toBe(1);
  });

  it('should filter candidates by multiple criteria', async () => {
    // Given
    const candidates = [mockCandidate(1)];
    em.findAndCount.mockResolvedValue([candidates, 1]);

    // When
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

    // Then
    expect(result.isSuccess).toBe(true);
    const response = result.value;
    expect(response.total).toBe(1);
    const candidate = response.candidates[0];
    expect(candidate.preferredCategories).toContain(1);
    expect(candidate.preferredWorkLocations).toContain(1);
    expect(candidate.languages).toContain(1);
  });

  it('should return essential candidate information in results', async () => {
    // Given
    const candidates = [mockCandidate(1)];
    em.findAndCount.mockResolvedValue([candidates, 1]);

    // When
    const result = await handler.execute(new GetCandidateListQuery());

    // Then
    expect(result.isSuccess).toBe(true);
    const candidate = result.value.candidates[0];
    expect(candidate).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        title: expect.any(String),
        bio: expect.any(String),
        profilePictureUrl: expect.any(String),
        preferredCategories: expect.arrayContaining([expect.any(Number)]),
        preferredEmploymentTypes: expect.arrayContaining([expect.any(Number)]),
        preferredStates: expect.arrayContaining([expect.any(Number)]),
        preferredWorkLocations: expect.arrayContaining([expect.any(Number)]),
        languages: expect.arrayContaining([expect.any(Number)]),
      }),
    );
  });
});
