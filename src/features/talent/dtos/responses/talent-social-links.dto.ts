import { ApiPropertyOptional } from '@nestjs/swagger';
import { TalentSocialLinks } from '../../../../domain/talent/talent-social-links.interface';

export class TalentSocialLinksDto {
  @ApiPropertyOptional()
  public readonly instagram?: string;

  @ApiPropertyOptional()
  public readonly facebook?: string;

  @ApiPropertyOptional()
  public readonly linkedin?: string;

  @ApiPropertyOptional()
  public readonly github?: string;

  @ApiPropertyOptional()
  public readonly behance?: string;

  @ApiPropertyOptional()
  public readonly twitter?: string;

  @ApiPropertyOptional()
  public readonly dribbble?: string;

  @ApiPropertyOptional()
  public readonly youtube?: string;

  @ApiPropertyOptional()
  public readonly vimeo?: string;

  @ApiPropertyOptional()
  public readonly artstation?: string;

  @ApiPropertyOptional()
  public readonly medium?: string;

  @ApiPropertyOptional()
  public readonly website?: string;

  public constructor(socialLinks?: TalentSocialLinks) {
    Object.assign(this, socialLinks);
  }
}
