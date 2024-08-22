"use client";
import { FC, useEffect, useState } from "react";
import { EventCard } from "./event-card";
import { Event } from "@prisma/client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, SlidersHorizontal } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Skeleton } from "../ui/skeleton";
import { useEvents } from "@/hooks/client";
import { useRouter } from "next/navigation";

export const EventsList: FC<{ title: string; except?: string }> = ({
  title,
  except,
}) => {
  const { events, setEvents } = useEvents();
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);
  const [openDialogFilters, setOpenDialogFilters] = useState(false);
  const router = useRouter();

  const handleFilter = async () => {
    setIsLoading(true);
    setOpenDialogFilters(false);
    const queryParams = new URLSearchParams();

    if (searchTerm) {
      queryParams.append("search", searchTerm);
    }
    if (fromDate) queryParams.append("fromDate", fromDate.toISOString());
    if (toDate) queryParams.append("toDate", toDate.toISOString());
    const url = `/api/v1/events?${queryParams.toString()}`;
    const res = await fetch(url, { method: "GET" });
    if (res.ok) {
      router.push("/portal/dashboard");
      setEvents(await res.json());
    }
    setIsLoading(false);
  };

  useEffect(() => {
    async function fetchEvents() {
      setIsLoading(true);
      const res = await fetch("/api/v1/events", {
        method: "GET",
      });

      if (res.ok) {
        setEvents(await res.json());
      } else {
        setEvents([]);
      }
      setIsLoading(false);
    }
    if (events.length === 0) {
      fetchEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className=" space-y-5">
      <div className=" flex items-center justify-between pr-4">
        <h1 className=" text-3xl font-medium w-full">{title}</h1>
        <Dialog open={openDialogFilters} onOpenChange={setOpenDialogFilters}>
          <DialogTrigger asChild>
            <div className=" flex justify-end w-full">
              <Button variant={"outline"} className=" flex items-center">
                <SlidersHorizontal className=" size-4 mr-1" /> Filters
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filters</DialogTitle>
              <DialogDescription>filters by your need</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pr-4">
              <div className="grid grid-cols-2 gap-2 p-2">
                <Input
                  placeholder="Search by Event ID, Name, or Description"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="col-span-2"
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        " justify-start text-left font-normal",
                        !fromDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate ? (
                        format(fromDate, "PPP")
                      ) : (
                        <span>Pick a fromDate</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={fromDate}
                      onSelect={setFromDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        " justify-start text-left font-normal",
                        !toDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate ? (
                        format(toDate, "PPP")
                      ) : (
                        <span>Pick toDate</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={toDate}
                      onSelect={setToDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button onClick={handleFilter} className="w-full">
                Filter
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <section className=" w-full grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-3">
        {events.length > 0 ? (
          events.map((event, index) => {
            if (event.key !== except) {
              return <EventCard key={`event-card-${index}`} card={event} />;
            }
          })
        ) : isLoading ? (
          Array.from({ length: 9 }).map((_, index) => (
            <Skeleton
              key={`event-card-${index}`}
              className="w-full aspect-video"
            />
          ))
        ) : (
          <div className=" mt-5 w-full text-center col-span-3 text-muted-foreground bg-muted p-2">
            <p>Oooops...</p>
            <p>There are no any events</p>
          </div>
        )}
      </section>
    </section>
  );
};
