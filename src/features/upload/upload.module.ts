import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { GeneratePresignedUrlHandler } from './commands/generate-presigned-url.handler';
import { StorageModule } from '../../infrastructure/services/storage/storage.module';
import { StorageService } from '../../infrastructure/services/storage/storage.service';

@Module({
  imports: [StorageModule],
  controllers: [UploadController],
  providers: [GeneratePresignedUrlHandler, StorageService],
})
export class UploadModule {}
