import { ApiProperty } from '@nestjs/swagger';
import { LanguageWithLevelDto } from '../../common/dtos/language-with-level.dto';
import { LocationDto } from '../../common/dtos/location.dto';

export class GetMemberResponseDto {
  @ApiProperty()
  public readonly fullName: string;

  @ApiProperty()
  public readonly title: string;

  @ApiProperty()
  public readonly bio: string;

  @ApiProperty({
    required: true,
  })
  public readonly avatarUrl?: string;

  @ApiProperty()
  public readonly location: LocationDto;

  @ApiProperty()
  public readonly languages: LanguageWithLevelDto[];

  public constructor(
    fullName: string,
    title: string,
    bio: string,
    location: LocationDto,
    languages: LanguageWithLevelDto[],
    avatarUrl?: string,
  ) {
    this.fullName = fullName;
    this.title = title;
    this.bio = bio;
    this.location = location;
    this.languages = languages;
    this.avatarUrl = avatarUrl;
  }
}
