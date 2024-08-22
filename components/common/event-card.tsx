"use client";
import { Event } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Clock } from "lucide-react";
import { dynamicBlurDataUrl } from "@/lib/get-blur-data-url";

export const EventCard: FC<{ card: Event }> = ({ card }) => {
  const [blurThumbnail, setBlurThumbnail] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlurUrl() {
      if (card) {
        const blurUrl = await dynamicBlurDataUrl(card.thumbnail);
        setBlurThumbnail(blurUrl);
      }
    }
    fetchBlurUrl();
  }, [card]);

  if (!blurThumbnail) {
    return <Skeleton className="w-full aspect-video my-10" />;
  }

  return (
    <Link
      href={`/portal/dashboard/events?key=${card.key}`}
      className="w-full aspect-video relative rounded-md my-10"
    >
      {card ? (
        <div className="rounded-md border absolute top-0 left-0 w-full h-full">
          <Image
            className="object-cover object-center w-full h-full rounded-md"
            src={card.thumbnail}
            alt={card.thumbnail}
            width={640}
            height={360}
            placeholder="blur"
            blurDataURL={blurThumbnail}
          />

          <div>
            <h1 className="font-medium max-w-full">{card.event_name}</h1>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {card.description}
            </p>
          </div>
          <div className="flex justify-between items-end w-full">
            <p className="text-xs text-muted-foreground flex items-center">
              <Clock className="size-4 mr-1" />
              {new Date(card.from_date_time).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      ) : (
        <Skeleton className="h-full w-full" />
      )}
    </Link>
  );
};
