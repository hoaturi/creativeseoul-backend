import { ApiProperty } from '@nestjs/swagger';

export class CandidateListItemDto {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly title: string;

  @ApiProperty()
  public readonly bio: string;

  @ApiProperty()
  public readonly profilePictureUrl?: string;

  @ApiProperty()
  public readonly preferredCategories: number[];

  @ApiProperty()
  public readonly preferredWorkLocations: number[];

  @ApiProperty()
  public readonly preferredStates: number[];

  @ApiProperty()
  public readonly preferredEmploymentTypes: number[];

  @ApiProperty()
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
  public constructor(
    public readonly candidates: CandidateListItemDto[],
    public readonly total: number,
  ) {}
}
