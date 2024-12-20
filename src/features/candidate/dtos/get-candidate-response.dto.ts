import { ApiProperty } from '@nestjs/swagger';

export class CandidateLanguageListItemDto {
  @ApiProperty()
  public readonly languageId: number;

  @ApiProperty()
  public readonly proficiencyLevel: number;

  public constructor(languageId: number, proficiency: number) {
    this.languageId = languageId;
    this.proficiencyLevel = proficiency;
  }
}

export class GetCandidateResponseDto {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly fullName: string;

  @ApiProperty()
  public readonly title: string;

  @ApiProperty()
  public readonly bio: string;

  @ApiProperty({
    nullable: true,
  })
  public readonly profilePictureUrl?: string;

  @ApiProperty({
    nullable: true,
  })
  public readonly resumeUrl?: string;

  @ApiProperty({
    type: [Number],
  })
  public readonly preferredCategories: number[];

  @ApiProperty({
    type: [Number],
  })
  public readonly preferredWorkLocationTypes: number[];

  @ApiProperty({
    type: [Number],
  })
  public readonly preferredStates: number[];

  @ApiProperty({
    type: [Number],
  })
  public readonly preferredEmploymentTypes: number[];

  @ApiProperty({
    type: [CandidateLanguageListItemDto],
  })
  public readonly languages: CandidateLanguageListItemDto[];

  public constructor(
    id: string,
    fullName: string,
    title: string,
    bio: string,
    profilePictureUrl: string,
    resumeUrl: string,
    preferredCategories: number[],
    preferredWorkLocationTypes: number[],
    preferredStates: number[],
    preferredEmploymentTypes: number[],
    languages: CandidateLanguageListItemDto[],
  ) {
    this.id = id;
    this.fullName = fullName;
    this.title = title;
    this.bio = bio;
    this.profilePictureUrl = profilePictureUrl;
    this.resumeUrl = resumeUrl;
    this.preferredCategories = preferredCategories;
    this.preferredWorkLocationTypes = preferredWorkLocationTypes;
    this.preferredStates = preferredStates;
    this.preferredEmploymentTypes = preferredEmploymentTypes;
    this.languages = languages;
  }
}
