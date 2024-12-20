import { ApiProperty } from '@nestjs/swagger';

export class CandidateListItemDto {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly title: string;

  @ApiProperty()
  public readonly bio: string;

  @ApiProperty({
    nullable: true,
  })
  public readonly profilePictureUrl?: string;

  @ApiProperty({ type: [Number] })
  public readonly preferredCategories: number[];

  @ApiProperty({ type: [Number] })
  public readonly preferredWorkLocations: number[];

  @ApiProperty({ type: [Number] })
  public readonly preferredStates: number[];

  @ApiProperty({ type: [Number] })
  public readonly preferredEmploymentTypes: number[];

  @ApiProperty({ type: [Number] })
  public readonly languages: number[];

  public constructor(
    id: string,
    title: string,
    bio: string,
    profilePictureUrl: string,
    preferredCategories: number[],
    preferredWorkLocations: number[],
    preferredStates: number[],
    preferredEmploymentTypes: number[],
    languages: number[],
  ) {
    this.id = id;
    this.title = title;
    this.bio = bio;
    this.profilePictureUrl = profilePictureUrl;
    this.preferredCategories = preferredCategories;
    this.preferredWorkLocations = preferredWorkLocations;
    this.preferredStates = preferredStates;
    this.preferredEmploymentTypes = preferredEmploymentTypes;
    this.languages = languages;
  }
}

export class GetCandidateListResponseDto {
  @ApiProperty({ type: [CandidateListItemDto] })
  public readonly candidates: CandidateListItemDto[];

  @ApiProperty()
  public readonly total: number;
  public constructor(candidates: CandidateListItemDto[], total: number) {
    this.candidates = candidates;
    this.total = total;
  }
}
