import { Injectable } from '@nestjs/common';
import { Collection } from '@mikro-orm/core';
import { Member } from '../../../domain/member/member.entity';
import { MemberLanguage } from '../../../domain/member/member-language.entity';

@Injectable()
export class MemberScoringService {
  private readonly SCORING_CONFIG = {
    TOP_QUALITY_THRESHOLD: 0.8, // Profiles scoring above this are considered top quality
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
      avatar: member.avatarUrl ? 1 : 0,
      bio: this.calculateBioScore(member.bio),
      tags: this.calculateTagsScore(member.tags),
      languages: this.calculateLanguagesScore(member.languages),
      city: member.city ? 1 : 0,
    };

    const weightedScore = Object.entries(scores).reduce(
      (total, [field, score]) => {
        return total + score * (this.SCORING_CONFIG.WEIGHTS[field] / 100);
      },
      0,
    );

    // If score is above threshold, normalize it to 1.0
    return weightedScore >= this.SCORING_CONFIG.TOP_QUALITY_THRESHOLD
      ? 1.0
      : weightedScore;
  }

  private calculateBioScore(bio: string): number {
    if (!bio) return 0;

    const length = bio.trim().length;
    const { min, optimal } = this.SCORING_CONFIG.CRITERIA.bio;

    if (length < min) return 0.3;
    if (length <= optimal) return length / optimal;
    return 1;
  }

  private calculateTagsScore(tags: string[] | undefined): number {
    if (!tags?.length) return 0;

    const count = tags.length;
    const { min, optimal } = this.SCORING_CONFIG.CRITERIA.tags;

    if (count < min) return 0.3;
    if (count <= optimal) return count / optimal;
    return 1;
  }

  private calculateLanguagesScore(
    languages: Collection<MemberLanguage>,
  ): number {
    const count = languages.length;
    if (count >= 3) return 1;
    return 0.3 + count * 0.3;
  }
}
