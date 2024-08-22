"use client";
import React, { FC } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { cn } from "@/lib/utils";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../../ui/calendar";
import { TimePicker } from "../ui/ttime-picker";
import { Checkbox } from "../../ui/checkbox";
import { defaultFields } from "@/data";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "../../ui/use-toast";
import { Event } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/hooks/client";

const formSchema = z.object({
  event_name: z.string().min(2, {
    message: "Event Name must be at least 5 characters.",
  }),
  description: z.string().optional(),
  from_date_time: z.date({
    message:
      "It's necessary to provide the date and time that event will be held on",
  }),
  to_date_time: z.date().optional(),
  subscription_count: z.string().optional(),
  fields: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You have to select at least one item.",
  }),
});

export type EventForm = z.infer<typeof formSchema>;

export const BioForm: FC<{ event: Event }> = ({ event }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const { updateEvent } = useEvents();

  const form = useForm<EventForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      event_name: event.event_name,
      description: event.description || undefined,
      from_date_time: new Date(event.from_date_time),
      to_date_time:
        (event.to_date_time && new Date(event.to_date_time)) || undefined,
      subscription_count: event.subscription_count?.toString() || undefined,
      fields: event.fields || undefined,
    },
  });

  const onSubmit = async (values: EventForm) => {
    setIsLoading(true);
    const res = await fetch("/api/v1/events", {
      method: "PUT",
      headers: {
        Authorization: "application/json",
      },
      body: JSON.stringify({
        ...values,
        key: event.key,
        subscription_count:
          values.subscription_count && parseInt(values.subscription_count),
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
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-8 px-4 pb-2 sm:pb-0 sm:px-2")}
      >
        <FormField
          control={form.control}
          name="event_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  placeholder="event name"
                  {...field}
                />
              </FormControl>
              <FormDescription>This is your public event name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  disabled={isLoading}
                  placeholder="tell us about the event"
                  className="resize-none"
                  {...field}
                  rows={10}
                />
              </FormControl>
              <FormDescription>Explain briefly about event</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="from_date_time"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-left">Date and Time</FormLabel>
              <Popover>
                <FormControl>
                  <PopoverTrigger asChild>
                    <Button
                      disabled={isLoading}
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP HH:mm:ss")
                      ) : (
                        <span>pick when will held on</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                </FormControl>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    disabled={isLoading}
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                  <div className="p-3 border-t border-border">
                    <TimePicker setDate={field.onChange} date={field.value} />
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        {event.to_date_time && (
          <FormField
            control={form.control}
            name="to_date_time"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-left">To Date and Time</FormLabel>
                <Popover>
                  <FormControl>
                    <PopoverTrigger asChild>
                      <Button
                        disabled={isLoading}
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP HH:mm:ss")
                        ) : (
                          <span>pick when to start</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                  </FormControl>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      disabled={isLoading}
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                    <div className="p-3 border-t border-border">
                      <TimePicker setDate={field.onChange} date={field.value} />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {event.subscription_count && (
          <FormField
            control={form.control}
            name="subscription_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-left">Subscription count</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled={isLoading}
                    placeholder="Subscription count"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="sm:flex flex-col">
          <h1 className=" font-medium mb-6 sm:mb-2">Default fields</h1>
          <div className=" w-full grid grid-cols-2 sm:grid-cols-3">
            {defaultFields.map((df) => {
              return (
                <FormField
                  key={df.id}
                  control={form.control}
                  name="fields"
                  render={({ field }) => {
                    return (
                      <FormItem key={df.id} className="flex space-x-2">
                        <FormControl>
                          <Checkbox
                            disabled={isLoading}
                            checked={field.value?.includes(df.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, df.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== df.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal relative bottom-1.5">
                          {df.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              );
            })}
          </div>
        </div>
        <Button disabled={isLoading} className="w-full" type="submit">
          {isLoading ? <Loader2 className=" animate-spin size-4" /> : "Save"}
        </Button>
      </form>
    </Form>
  );
};
