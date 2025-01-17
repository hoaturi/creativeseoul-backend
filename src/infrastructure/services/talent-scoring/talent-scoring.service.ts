import { Injectable } from '@nestjs/common';
import { Collection } from '@mikro-orm/core';
import { TalentLanguage } from '../../../domain/talent/entities/talent-language.entity';
import { Talent } from '../../../domain/talent/entities/talent.entity';

@Injectable()
export class TalentScoringService {
  private readonly SCORING_CONFIG = {
    WEIGHTS: {
      avatar: 25,
      bio: 35,
      languages: 25,
      city: 15,
    },
    CRITERIA: {
      bio: {
        min: 250,
        good: 500,
        optimal: 1024,
        max: 2048,
      },
    },
  };

  public calculateProfileScore(talent: Talent): number {
    const scores = {
      avatar: talent.avatarUrl ? 100 : 0,
      bio: this.calculateBioScore(talent.bio),
      languages: this.calculateLanguagesScore(talent.languages),
      city: talent.city ? 100 : 0,
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
    const { min, good, optimal } = this.SCORING_CONFIG.CRITERIA.bio;

    if (length < min) {
      // For bios shorter than minimum, score scales from 0-50
      return Math.round((length / min) * 50);
    }

    if (length < good) {
      // For bios between min and good, score scales from 50-75
      return Math.round(50 + ((length - min) / (good - min)) * 25);
    }

    if (length < optimal) {
      // For bios between good and optimal, score scales from 75-100
      return Math.round(75 + ((length - good) / (optimal - good)) * 25);
    }

    // Any bio length >= optimal gets full score
    return 100;
  }

  private calculateLanguagesScore(
    languages: Collection<TalentLanguage>,
  ): number {
    const count = languages.length;
    if (count >= 3) return 100;
    return Math.round(30 + count * 30);
  }
}
