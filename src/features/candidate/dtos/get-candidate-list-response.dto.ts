import { ApiProperty } from '@nestjs/swagger';
import { WorkLocationType } from '../../../domain/common/entities/work-location-type.entity';
import { JobCategory } from '../../../domain/common/entities/job-category.entity';
import { State } from '../../../domain/common/entities/state.entity';
import { EmploymentType } from '../../../domain/common/entities/employment-type.entity';
import { ReferenceDataDto } from '../../common/dtos/reference-data.dto';
import { LanguageWithLevelDto } from '../../common/dtos/language-with-level.dto';

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

  @ApiProperty({ type: [ReferenceDataDto] })
  public readonly preferredCategories: ReferenceDataDto[];

  @ApiProperty({ type: [ReferenceDataDto] })
  public readonly preferredWorkLocationTypes: ReferenceDataDto[];

  @ApiProperty({ type: [ReferenceDataDto] })
  public readonly preferredStates: ReferenceDataDto[];

  @ApiProperty({ type: [ReferenceDataDto] })
  public readonly preferredEmploymentTypes: ReferenceDataDto[];

  @ApiProperty({ type: [LanguageWithLevelDto] })
  public readonly languages: LanguageWithLevelDto[];

  public constructor(
    id: string,
    title: string,
    bio: string,
    profilePictureUrl: string,
    preferredCategories: JobCategory[],
    preferredWorkLocationTypes: WorkLocationType[],
    preferredStates: State[],
    preferredEmploymentTypes: EmploymentType[],
    languages: LanguageWithLevelDto[],
  ) {
    this.id = id;
    this.title = title;
    this.bio = bio;
    this.profilePictureUrl = profilePictureUrl;
    this.preferredCategories = preferredCategories;
    this.preferredWorkLocationTypes = preferredWorkLocationTypes;
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
