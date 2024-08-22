"use server";

import { getSession } from "@auth0/nextjs-auth0";
import { UploadToS3 } from "./uploadToS3";
import { FileWithPreview } from "@/components/pages/settings/account/form";

export async function UpdateProfilePicture(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized!");
  const picture = formData.get("pic") as FileWithPreview;
  if (!picture) throw new Error("Can't find picture");
  const url = await UploadToS3(picture, session.user.email, "user-details/");
  return url;
}
