import { Injectable } from '@nestjs/common';
import { Collection } from '@mikro-orm/core';
import { Member } from '../../../domain/member/member.entity';
import { MemberLanguage } from '../../../domain/member/member-language.entity';

@Injectable()
export class MemberScoringService {
  private readonly SCORING_CONFIG = {
    WEIGHTS: {
      avatar: 20,
      bio: 30,
      tags: 25,
      languages: 15,
      city: 10,
    },
    CRITERIA: {
      bio: {
        min: 50,
        optimal: 300,
      },
      tags: {
        min: 2,
        optimal: 5,
      },
    },
  };

  public calculateProfileScore(member: Member): number {
    const scores = {
      avatar: member.avatarUrl ? 100 : 0,
      bio: this.calculateBioScore(member.bio),
      tags: this.calculateTagsScore(member.tags),
      languages: this.calculateLanguagesScore(member.languages),
      city: member.city ? 100 : 0,
    };

    return Math.round(
      Object.entries(scores).reduce((total, [field, score]) => {
        return total + score * (this.SCORING_CONFIG.WEIGHTS[field] / 100);
      }, 0),
    );
  }

  private calculateBioScore(bio: string): number {
    if (!bio) return 0;

    const length = bio.trim().length;
    const { min, optimal } = this.SCORING_CONFIG.CRITERIA.bio;

    if (length < min) return 30;
    if (length <= optimal) return Math.round((length / optimal) * 100);
    return 100;
  }

  private calculateTagsScore(tags: string[] | undefined): number {
    if (!tags?.length) return 0;

    const count = tags.length;
    const { min, optimal } = this.SCORING_CONFIG.CRITERIA.tags;

    if (count < min) return 30;
    if (count <= optimal) return Math.round((count / optimal) * 100);
    return 100;
  }

  private calculateLanguagesScore(
    languages: Collection<MemberLanguage>,
  ): number {
    const count = languages.length;
    if (count >= 3) return 100;
    return Math.round(30 + count * 30);
  }
}
