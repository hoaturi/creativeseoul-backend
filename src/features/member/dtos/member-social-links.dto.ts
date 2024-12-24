import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUrl } from 'class-validator';

export class MemberSocialLinksDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly instagram?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly facebook?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly tiktok?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly linkedin?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly behance?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly gitHub?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly twitter?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly dribbble?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly youtube?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly vimeo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly artStation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly medium?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly subStack?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly website?: string;

  public constructor(
    instagram?: string,
    facebook?: string,
    tiktok?: string,
    linkedin?: string,
    behance?: string,
    gitHub?: string,
    twitter?: string,
    dribbble?: string,
    youtube?: string,
    vimeo?: string,
    artStation?: string,
    medium?: string,
    subStack?: string,
    website?: string,
  ) {
    this.instagram = instagram;
    this.facebook = facebook;
    this.tiktok = tiktok;
    this.linkedin = linkedin;
    this.behance = behance;
    this.gitHub = gitHub;
    this.twitter = twitter;
    this.dribbble = dribbble;
    this.youtube = youtube;
    this.vimeo = vimeo;
    this.artStation = artStation;
    this.medium = medium;
    this.subStack = subStack;
    this.website = website;
  }
}
