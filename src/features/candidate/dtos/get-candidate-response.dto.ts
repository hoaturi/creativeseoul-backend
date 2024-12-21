import { ApiProperty } from '@nestjs/swagger';
import { ReferenceDataDto } from '../../common/dtos/reference-data.dto';
import { LanguageWithLevelDto } from '../../common/dtos/language-with-level.dto';

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
    type: [ReferenceDataDto],
  })
  public readonly preferredCategories: ReferenceDataDto[];

  @ApiProperty({
    type: [ReferenceDataDto],
  })
  public readonly preferredWorkLocationTypes: ReferenceDataDto[];

  @ApiProperty({
    type: [ReferenceDataDto],
  })
  public readonly preferredStates: ReferenceDataDto[];

  @ApiProperty({
    type: [ReferenceDataDto],
  })
  public readonly preferredEmploymentTypes: ReferenceDataDto[];

  @ApiProperty({
    type: [LanguageWithLevelDto],
  })
  public readonly languages: LanguageWithLevelDto[];

  public constructor(
    id: string,
    fullName: string,
    title: string,
    bio: string,
    profilePictureUrl: string,
    resumeUrl: string,
    preferredCategories: ReferenceDataDto[],
    preferredWorkLocationTypes: ReferenceDataDto[],
    preferredStates: ReferenceDataDto[],
    preferredEmploymentTypes: ReferenceDataDto[],
    languages: LanguageWithLevelDto[],
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
