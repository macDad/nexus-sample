import { S3Client } from "@aws-sdk/client-s3";

export class s3Client {
  private static client: S3Client;

  private constructor() {}

  public static getInstance(): S3Client {
    if (!s3Client.client) {
      s3Client.client = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
      });
    }
    return s3Client.client;
  }
}
