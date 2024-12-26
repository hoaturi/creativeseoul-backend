import { ApiProperty } from '@nestjs/swagger';
import { MemberSocialLinks } from '../../../../domain/member/member-social-links.interface';

export class SocialLinksResponseDto {
  @ApiProperty({ required: false })
  public readonly instagram?: string;

  @ApiProperty({ required: false })
  public readonly facebook?: string;

  @ApiProperty({ required: false })
  public readonly tiktok?: string;

  @ApiProperty({ required: false })
  public readonly linkedin?: string;

  @ApiProperty({ required: false })
  public readonly github?: string;

  @ApiProperty({ required: false })
  public readonly behance?: string;

  @ApiProperty({ required: false })
  public readonly twitter?: string;

  @ApiProperty({ required: false })
  public readonly dribbble?: string;

  @ApiProperty({ required: false })
  public readonly youtube?: string;

  @ApiProperty({ required: false })
  public readonly vimeo?: string;

  @ApiProperty({ required: false })
  public readonly artstation?: string;

  @ApiProperty({ required: false })
  public readonly medium?: string;

  @ApiProperty({ required: false })
  public readonly substack?: string;

  @ApiProperty({ required: false })
  public readonly website?: string;

  public constructor(socialLinks?: MemberSocialLinks) {
    Object.assign(this, socialLinks);
  }
}
