import { Inject, Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigType } from '@nestjs/config';
import { applicationConfig } from '../../../config/application.config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GenerateImagePresignedUrlRequestDto } from '../../../features/upload/dtos/generate-image-presigned-url-request.dto';

@Injectable()
export class StorageService {
  private readonly S3Client: S3Client;

  public constructor(
    @Inject(applicationConfig.KEY)
    private readonly appConfig: ConfigType<typeof applicationConfig>,
  ) {
    this.S3Client = new S3Client({
      region: appConfig.cloudflare.r2.region,
      endpoint: appConfig.cloudflare.r2.endpoint,
      credentials: {
        accessKeyId: appConfig.cloudflare.r2.accessKey,
        secretAccessKey: appConfig.cloudflare.r2.secretAccessKey,
      },
    });
  }

  public async generatePresignedUrl(
    fileName: string,
    dto: GenerateImagePresignedUrlRequestDto,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.appConfig.cloudflare.r2.bucket,
      Key: fileName,
      ContentType: dto.mimeType,
      ContentLength: dto.compressedFileSize,
    });

    return await getSignedUrl(this.S3Client, command);
  }
}
