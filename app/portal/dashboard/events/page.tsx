"use client";
import { WithPermissions } from "@/components/common/auth/with-permissions-client";
import { EventsList } from "@/components/common/events-list";
import { FormEventEdit } from "@/components/common/form-event-update/update-event";
import { WithPreVerifier } from "@/components/pre-verifier-client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import { useEvents, useMediaQuery } from "@/hooks/client";
import { dynamicBlurDataUrl } from "@/lib/get-blur-data-url";
import { getCacheBustedUrl } from "@/lib/get-cache-busted-url";
import { Event } from "@prisma/client";
import { Clock, Edit, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

type Props = {
  searchParams: {
    key: string;
  };
};

export default function EventPage({ searchParams: { key } }: Props) {
  const [event, setEvent] = useState<Event[] | null>(null);
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const { events, deleteEvent } = useEvents();
  const [blurThumbnail, setBlurThumbnail] = useState<string | null>(null);
  const [blurBanner, setBlurBanner] = useState<string | null>(null);
  const [updateCount, setUpdateCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [openDeleteDialog, setopenDeleteDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function getEvent() {
      const res = await fetch(`/api/v1/events?key=${key}`);
      if (res.ok) {
        const data = await res.json();
        setEvent(data);
        setUpdateCount((prev) => prev + 1);
      }
    }
    if (key) {
      setEvent(null);
      getEvent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useMemo(() => {
    if (events.length > 0) {
      setEvent(events.filter((obj) => obj.key == key));
    }
  }, [events, key]);

  useEffect(() => {
    async function fetchBlurUrl() {
      if (event) {
        const blurUrlThumbnail = await dynamicBlurDataUrl(event[0].thumbnail);
        const blurUrlBanner = await dynamicBlurDataUrl(event[0].banner);
        setBlurThumbnail(blurUrlThumbnail);
        setBlurBanner(blurUrlBanner);
      }
    }
    if (key) {
      fetchBlurUrl();
    }
  }, [event, key]);

  const handleDelete = async () => {
    setIsLoading(true);
    const res = await fetch("/api/v1/events", {
      method: "DELETE",
      body: JSON.stringify({
        key,
      }),
    });

    if (res.ok) {
      router.push("/portal/dashboard/events");
      deleteEvent(key);
      setopenDeleteDialog(false);
      toast({
        variant: "destructive",
        title: "Event Deleted Successfully",
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
  };

  return (
    <WithPreVerifier>
      {key && (
        <section className="w-full">
          {event && event.length > 0 ? (
            <>
              <div className="relative">
                {event[0].banner && (
                  <Image
                    key={`banner-${updateCount}`}
                    src={getCacheBustedUrl(event[0].banner)}
                    alt=""
                    className="c-fade-in aspect-video object-cover bg-background object-bottom lg:aspect-[3.8/1.5]"
                    width={1366}
                    height={768}
                    placeholder={blurBanner ? "blur" : "empty"}
                    blurDataURL={blurBanner ? blurBanner : undefined}
                  />
                )}
                <div className="absolute top-0 left-0 w-full h-full sm:grid sm:grid-cols-2 lg:grid-cols-3 bg-black/40">
                  <div className="text-white w-full h-full sm:flex items-end sm:items-start sm:justify-end p-4 space-y-2 grid grid-cols-2 gap-x-2 sm:flex-col">
                    <div>
                      <h1 className="font-medium text-3xl sm:text-4xl mb-2">
                        {event[0].event_name}
                      </h1>
                      <div className="space-y-1 font-medium text-xs">
                        <p className="flex items-center">
                          FROM : <Clock className="size-4 mx-1" />
                          {new Date(event[0].from_date_time).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                        {event[0].to_date_time && (
                          <p className="flex items-center">
                            TO : <Clock className="size-4 mx-1" />
                            {new Date(event[0].to_date_time).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                        )}
                        {event[0].subscription_count && (
                          <p className="text-sm">
                            Subcriptions : {event[0].subscription_count}
                          </p>
                        )}
                      </div>
                    </div>
                    {event[0].thumbnail && (
                      <Image
                        key={`thumbnail-${updateCount}`}
                        src={getCacheBustedUrl(event[0].thumbnail)}
                        alt=""
                        className="aspect-video object-cover bg-background object-top h-fit c-fade-in"
                        width={640}
                        height={360}
                        placeholder={blurThumbnail ? "blur" : "empty"}
                        blurDataURL={blurThumbnail ? blurThumbnail : undefined}
                      />
                    )}
                    <WithPermissions roles={["company"]}>
                      {isDesktop ? (
                        <div className=" flex items-center space-x-2 absolute top-2 right-4">
                          <TooltipProvider>
                            <Tooltip>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant={"secondary"}
                                      size={"icon"}
                                      className=""
                                    >
                                      <Edit className="size-4" />
                                    </Button>
                                  </TooltipTrigger>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[90vw] lg:max-w-[60vw]">
                                  <DialogHeader>
                                    <DialogTitle>Edit Event</DialogTitle>
                                    <DialogDescription>
                                      Make changes to the event here. Click save
                                      when you are done.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <FormEventEdit event={event[0]} />
                                </DialogContent>
                              </Dialog>
                              <TooltipContent>
                                <p>Edit</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <AlertDialog
                                open={openDeleteDialog}
                                onOpenChange={setopenDeleteDialog}
                              >
                                <AlertDialogTrigger>
                                  <TooltipTrigger asChild>
                                    <Button
                                      disabled={isLoading}
                                      variant={"secondary"}
                                      size={"icon"}
                                    >
                                      {isLoading ? (
                                        <Loader2 className=" size-4 text-red-500 animate-spin" />
                                      ) : (
                                        <Trash2 className=" size-4 text-red-500" />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Are you absolutely sure?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete this event from
                                        everywhere
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel
                                        onClick={() =>
                                          setopenDeleteDialog(false)
                                        }
                                      >
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction asChild>
                                        <Button
                                          disabled={isLoading}
                                          className=" flex items-center w-24"
                                          onClick={handleDelete}
                                        >
                                          {isLoading ? (
                                            <>
                                              <Loader2 className=" size-4 animate-spin" />
                                            </>
                                          ) : (
                                            <>
                                              <Trash2 className=" size-4 mr-1" />
                                              Delete
                                            </>
                                          )}
                                        </Button>
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialogTrigger>
                              </AlertDialog>
                              <TooltipContent>
                                <p>Delete</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      ) : (
                        <Drawer>
                          <DrawerTrigger>
                            <Button
                              variant={"secondary"}
                              size={"icon"}
                              className="absolute top-2 right-4 p-2"
                              asChild
                            >
                              <Edit className="size-4" />
                            </Button>
                          </DrawerTrigger>
                          <DrawerContent className="h-[90vh]">
                            <DrawerHeader className="text-left">
                              <DrawerTitle>Edit Event</DrawerTitle>
                              <DrawerDescription>
                                Make changes to the event here. Click save when
                                you are done.
                              </DrawerDescription>
                            </DrawerHeader>
                            <div className="p-2">
                              <FormEventEdit event={event[0]} />
                            </div>
                          </DrawerContent>
                        </Drawer>
                      )}
                    </WithPermissions>
                  </div>
                </div>
              </div>
              {event[0].description && (
                <Accordion type="single" collapsible>
                  <AccordionItem value="item">
                    <AccordionTrigger>Description</AccordionTrigger>
                    <AccordionContent>
                      <p className="mt-5 text-muted-foreground">
                        Description: {event[0].description}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </>
          ) : (
            <Skeleton className="w-full aspect-video lg:aspect-[3.8/1.5]" />
          )}
        </section>
      )}
      <div className="mt-10">
        <EventsList key={key} title="Recent Events" except={key} />
      </div>
    </WithPreVerifier>
  );
}
