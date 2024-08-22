"use server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3-client";

export async function deleteFromS3(
  filename: string,
  dir: "user-details/" | "kyc-uploads/" | "user-details/events/"
) {
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: `${dir}${filename}`,
  };
  const command = new DeleteObjectCommand(params);
  try {
    const client = s3Client.getInstance();
    await client.send(command);
    return `Object ${params.Key} deleted successfully.`;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
