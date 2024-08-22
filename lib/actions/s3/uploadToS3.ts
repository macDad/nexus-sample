"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3-client";

export async function UploadToS3(
  file: File,
  filename: string,
  dir: "user-details/" | "kyc-uploads/" | "user-details/events/"
) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: `${dir}${filename}`,
    Body: buffer,
    ContentType: file.type,
  };
  const command = new PutObjectCommand(params);
  try {
    const client = s3Client.getInstance();
    await client.send(command);
    const objectUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
    return objectUrl;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
