import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import KSUID from "ksuid";

import { Meal } from "@application/entities/Meal";
import { HeadObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from "@infra/clients/s3Client";
import { Injectable } from "@kernel/decorators/Injectable";
import { AppConfig } from "@shared/config/AppConfig";
import { minutesToSeconds } from '@shared/utils/mintesToSeconds';

@Injectable()
export class MealsFileStorageGatway {
  constructor(private readonly config: AppConfig) {}

  static generateInputFileKey({
    accountId,
    inputType
  }: MealsFileStorageGatway.GenerateInputFileKeyParams ): string {
    const extension = inputType === Meal.InputTYpe.AUDIO ? 'm4a': 'jpeg';
    const filename = `${KSUID.randomSync().string}.${extension}`;

    return `${accountId}/${filename}`
  }

  getFileUrl(fileKey: string) {
    const cdn = this.config.cdns.mealsCDN;

    return `https://${cdn}/${fileKey}`
  }

  async createPOST({
    accountId,
    mealId,
    file,
  }: MealsFileStorageGatway.CreatePOSTParams): Promise<MealsFileStorageGatway.CreatePOSTResult> {
    const bucket = this.config.storage.mealsBucket;
    const contentType = file.inputType === Meal.InputTYpe.AUDIO ? 'audio/m4a': 'image/jpeg';

    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: bucket,
      Key: file.key,
      Expires: minutesToSeconds(5),
      Conditions: [
        { bucket },
        ['eq', '$key', file.key],
        ['eq', '$Content-Type', contentType],
        ['content-length-range', file.size, file.size],
      ],
      Fields: {
        'x-amz-meta-mealid': mealId,
        'X-amz-meta-accountid': accountId,
      },
    });

    const uploadSignature = Buffer.from(JSON.stringify({ url, fields: {
      ...fields,
      'Content-Type': contentType,
    } })).toString('base64')

    return {
      uploadSignature,
    }
  }

  async getFileMetadata({ fileKey }: MealsFileStorageGatway.GetFileMetadataParams): Promise<MealsFileStorageGatway.GetFileMetadataResult> {
    const command =  new HeadObjectCommand({
      Bucket: this.config.storage.mealsBucket,
      Key: fileKey,
    });

    const { Metadata = {} } = await s3Client.send(command)

    if (!Metadata.accountid || !Metadata.mealid) {
      throw new Error(`[getFileMetadata] Cannot Process File "${fileKey}"`);
    }

    return {
      accountId: Metadata.accountid,
      mealId: Metadata.mealid
    }
  }
}

export namespace MealsFileStorageGatway {
  export type GenerateInputFileKeyParams = {
    accountId: string;
    inputType: Meal.InputTYpe;
  };

  export type CreatePOSTParams = {
    accountId: string;
    mealId: string;
    file: {
      key: string;
      size: number;
      inputType: Meal.InputTYpe;
    };
  };

  export type CreatePOSTResult = {
    uploadSignature: string,
  };

  export type GetFileMetadataParams = {
    fileKey: string;
  };

  export type GetFileMetadataResult = {
    accountId: string;
    mealId: string;
  };
}
