import { Module } from '@nestjs/common';
import { TalentActivityService } from './talent-activity.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register()],
  providers: [TalentActivityService],
  exports: [TalentActivityService],
})
export class TalentActivityModule {}
