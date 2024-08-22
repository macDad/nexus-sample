"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { FC, useEffect, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { ImageCropper } from "@/components/pages/settings/account/profile-picture";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { UserMetdataJSON } from "@/typings";
import { setUserMetaData } from "@/lib/actions/auth0/management-api";
import { Camera, Loader2, User2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { UpdateProfilePicture } from "@/lib/actions/s3/update-profile-picture";
import { dataURLtoFile } from "@/lib/data-url-file";
import { useUser } from "@auth0/nextjs-auth0/client";
import useImageExists from "@/hooks/client/use-image-exists";

export type FileWithPreview = FileWithPath & {
  preview: string;
};

const formSchema = z.object({
  secondary_email: z.string().email().min(2, {
    message: "Email must be provided.",
  }),
  company_name: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  bio: z.string().optional(),
  address: z.string().min(2, {
    message: "Address line 1 must be at least 2 characters.",
  }),
  lane: z.string().min(2, {
    message: "Address lane must be at least 2 characters.",
  }),
  country: z.string().min(2, {
    message: "Country must be at least 2 characters.",
  }),
});

const accept = {
  "image/*": [],
};

export const AccountForm: FC = () => {
  const { user, isLoading, checkSession } = useUser();
  const { toast } = useToast();
  const [isUpdatingPP, setisUpdatingPP] = useState<boolean>(false);
  const [croppedImageUrl, setCroppedImageUrl] = React.useState<string>("");
  const [selectedFile, setSelectedFile] =
    React.useState<FileWithPreview | null>(null);
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [userProfileData, setUserProfileData] = useState<
    UserMetdataJSON | undefined
  >(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const { exists, checking } = useImageExists();
  const [dpCount, setDpCount] = useState(0);

  const form = useForm<UserMetdataJSON>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      bio: "",
      company_name: "",
      country: "",
      lane: "",
      secondary_email: "",
    },
  });

  useEffect(() => {
    if (user) {
      setUserProfileData(user.user_metadata as UserMetdataJSON);
    }
  }, [user]);

  useEffect(() => {
    if (userProfileData) {
      form.reset(userProfileData);
    }
  }, [userProfileData, form]);

  async function onSubmit(metadata: UserMetdataJSON) {
    setIsSaving(true);
    await setUserMetaData({ metadata });
    setIsSaving(false);
    toast({
      title: "User Profile Updated Successfully",
      description: "Company details updated",
      duration: 3000,
      className: "bg-green-500 text-white",
    });
  }
  const onDrop = React.useCallback((acceptedFiles: FileWithPath[]) => {
    const file = acceptedFiles[0];
    if (!file) {
      alert("Selected image is too large!");
      return;
    }

    const fileWithPreview = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });

    setSelectedFile(fileWithPreview);
    setDialogOpen(true);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
  });

  const handleProfilePic = async () => {
    setisUpdatingPP(true);
    try {
      if (selectedFile) {
        const formData = new FormData();
        const img = dataURLtoFile(croppedImageUrl, selectedFile.name);

        if (img.size < 2 * 1024 * 1024) {
          formData.append("pic", img);
          const url = await UpdateProfilePicture(formData);
          await setUserMetaData({ picture: url });
          setSelectedFile(null);
          await checkSession();
          toast({
            title: "Profile updated Successfully",
            variant: "default",
            duration: 3000,
            className: "bg-green-500 text-background",
          });
          await checkSession();
          setDpCount((prev) => prev + 1);
        } else {
          toast({
            title: "Image must be less than 2 Mb",
            variant: "destructive",
            duration: 3000,
          });
        }
      }
    } catch (error: any) {
      toast({ title: error.message, variant: "destructive" });
    } finally {
      setisUpdatingPP(false);
    }
  };

  return (
    <Form {...form}>
      <div className="relative mb-8 sm:pt-4 sm:pl-1">
        {selectedFile ? (
          <div className=" flex items-end space-x-4">
            <ImageCropper
              croppedImageUrl={croppedImageUrl}
              setCroppedImageUrl={setCroppedImageUrl}
              dialogOpen={isDialogOpen}
              setDialogOpen={setDialogOpen}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
            />
            <div className=" w-48 relative bottom-2">
              <p className=" font-medium text-sm">
                Update your company image to new one
              </p>
              <Button
                disabled={isUpdatingPP}
                onClick={handleProfilePic}
                variant={"outline"}
                className="w-16"
              >
                {isUpdatingPP ? (
                  <Loader2 className=" size-4 animate-spin duration-1000" />
                ) : (
                  "save"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <Avatar
            {...getRootProps()}
            className=" size-28 sm:size-36 cursor-pointer ring-offset-2 ring-2 ring-slate-200"
          >
            <input {...getInputProps()} />
            <div className="absolute left-0 w-full flex items-end justify-center h-full bottom-0 bg-transparent hover:bg-gradient-to-t hover:from-primary hover:to-transparent hover:from-5% hover:to-80% transition-all duration-300 group">
              <Camera className="size-6 -translate-y-4 opacity-0 group-hover:opacity-100 text-white" />
            </div>

            {exists && user && (
              <AvatarImage
                key={`${dpCount}`}
                className=" object-cover aspect-square"
                src={croppedImageUrl || (user.picture as string)}
                alt="dp"
              />
            )}
            <AvatarFallback>
              {isLoading || checking ? (
                <Skeleton className=" w-full h-full" />
              ) : (
                !exists &&
                !croppedImageUrl && (
                  <User2 className=" size-[60%] sm:size-[80%] text-primary" />
                )
              )}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-2">
        <div className=" flex w-full justify-center  space-y-3 flex-col">
          <FormLabel className=" text-muted-foreground">
            Primary Email
          </FormLabel>
          {user && (
            <Input
              disabled
              value={user.email as any}
              placeholder="email address"
            />
          )}
        </div>
        <FormField
          control={form.control}
          name="secondary_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Email </FormLabel>
              <FormControl>
                <Input placeholder="email address" {...field} />
              </FormControl>
              <FormDescription>
                Company email address for further contacts
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about company"
                  className="resize-none"
                  {...field}
                  rows={6}
                />
              </FormControl>
              <FormDescription>
                Something about your organization
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name </FormLabel>
              <FormControl>
                <Input placeholder="name of the company" {...field} />
              </FormControl>
              <FormDescription>This will display on</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 1 </FormLabel>
              <FormControl>
                <Input placeholder="line 1" {...field} />
              </FormControl>
              <FormDescription>This is for physical contacts.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lane"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address line 2 </FormLabel>
              <FormControl>
                <Input placeholder="lane number or name" {...field} />
              </FormControl>
              <FormDescription>This is for physical contacts.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country </FormLabel>
              <FormControl>
                <Input placeholder="Singapore" {...field} />
              </FormControl>
              <FormDescription>Region name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isSaving} className=" w-24" type="submit">
          {isSaving ? <Loader2 className=" size-4 animate-spin" /> : "Save"}
        </Button>
      </form>
    </Form>
  );
};
