import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import { fileToDataURL } from "@/lib/data-url-file";
import { Event } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useEvents } from "@/hooks/client";
import { getCacheBustedUrl } from "@/lib/get-cache-busted-url";
import { dynamicBlurDataUrl } from "@/lib/get-blur-data-url";

export const Images: FC<{ event: Event }> = ({ event }) => {
  const [newThumbnail, setNewThumbnail] = useState<string | null>(null);
  const [newBanner, setNewBanner] = useState<string | null>(null);
  const fileThumbnailInputRef = React.useRef<HTMLInputElement | null>(null);
  const fileBannerInputRef = React.useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [blurThumbnail, setBlurThumbnail] = useState<string | null>(null);
  const [blurBanner, setBlurBanner] = useState<string | null>(null);

  const { updateEvent } = useEvents();

  useEffect(() => {
    async function fetchBlurUrl() {
      if (event) {
        const blurUrlThumbnail = await dynamicBlurDataUrl(event.thumbnail);
        const blurUrlBanner = await dynamicBlurDataUrl(event.banner);
        setBlurThumbnail(blurUrlThumbnail);
        setBlurBanner(blurUrlBanner);
      }
    }
    fetchBlurUrl();
  }, [event]);

  const handleUpdate = async () => {
    if (newBanner || newThumbnail) {
      setIsLoading(true);
      const res = await fetch("/api/v1/events", {
        method: "PUT",
        headers: {
          Authorization: "application/json",
        },
        body: JSON.stringify({
          key: event.key,
          thumbnail: newThumbnail ? newThumbnail : undefined,
          banner: newBanner ? newBanner : undefined,
        }),
      });

      if (res.ok) {
        updateEvent(await res.json());
        toast({
          variant: "default",
          title: "Event Updated Successfully",
          description: "created event details successfully",
          duration: 3000,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error while updating the event",
          description: await res.text(),
          duration: 3000,
        });
      }
      setIsLoading(false);
    } else {
      toast({
        variant: "destructive",
        title: "Can't update the event",
        description: "no any file uploaded!",
        duration: 3000,
      });
    }
  };

  const handleThumbnailButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (newThumbnail) {
      setNewThumbnail(null);
    } else {
      event.preventDefault();
      if (fileThumbnailInputRef.current) {
        fileThumbnailInputRef.current.click();
      }
    }
  };
  const handleBannerButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (newBanner) {
      setNewBanner(null);
    } else {
      event.preventDefault();
      if (fileBannerInputRef.current) {
        fileBannerInputRef.current.click();
      }
    }
  };

  const handleThumbnailFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setNewThumbnail(await fileToDataURL(file));
    } else if (file) {
      alert("File size exceeds 10MB");
    }
  };
  const handleBannerFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setNewBanner(await fileToDataURL(file));
    } else if (file) {
      alert("File size exceeds 10MB");
    }
  };
  return (
    <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-2 pt-4 gap-4">
      <div className=" w-full aspect-video">
        <h1 className=" font-medium mb-2">Event Thumbnail Image</h1>
        <div className=" relative w-full aspect-video ">
          <Image
            className="w-full aspect-video object-cover c-fade-in"
            src={newThumbnail || getCacheBustedUrl(event.thumbnail)}
            alt={event.key}
            width={640}
            height={360}
            placeholder={blurThumbnail ? "blur" : "empty"}
            blurDataURL={blurThumbnail ? blurThumbnail : undefined}
          />
          <Button
            onClick={handleThumbnailButtonClick}
            variant={"outline"}
            className=" absolute top-0 right-0 m-2"
          >
            {newThumbnail ? "Undo" : "Change"}
          </Button>
          <input
            ref={fileThumbnailInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleThumbnailFileChange}
          />
        </div>
      </div>
      <div className=" w-full">
        <h1 className=" font-medium mb-2">Event Banner Image</h1>
        <div className=" relative w-full aspect-video">
          <Image
            className="w-full aspect-video object-cover c-fade-in"
            src={newBanner || getCacheBustedUrl(event.banner)}
            alt={event.key}
            width={640}
            height={360}
            placeholder={blurBanner ? "blur" : "empty"}
            blurDataURL={blurBanner ? blurBanner : undefined}
          />
          <Button
            onClick={handleBannerButtonClick}
            variant={"outline"}
            className=" absolute top-0 right-0 m-2"
          >
            {newBanner ? "Undo" : "Change"}
          </Button>
          <input
            ref={fileBannerInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleBannerFileChange}
          />
        </div>
      </div>
      <Button
        disabled={isLoading || (newThumbnail === null && newBanner === null)}
        onClick={handleUpdate}
        className=" w-full col-span-2 mt-4"
      >
        {isLoading ? <Loader2 className=" size-4 animate-spin" /> : "Save"}
      </Button>
    </div>
  );
};
