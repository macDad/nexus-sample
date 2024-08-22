"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
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
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TimePicker } from "@/components/common/ui/ttime-picker";
import { FC } from "react";
import { StepProps } from "./create-event-form";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const formSchemaStep01 = z.object({
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
});

export type Step1Data = z.infer<typeof formSchemaStep01>;

export const Step_01: FC<StepProps<Step1Data>> = ({
  onNext,
  defaultValues,
  isLoading,
}) => {
  const formStep01 = useForm<Step1Data>({
    resolver: zodResolver(formSchemaStep01),
    defaultValues,
  });

  const onSubmit: SubmitHandler<Step1Data> = (values) => onNext(values);

  return (
    <ScrollArea className=" h-[60vh] sm:px-0 sm:h-full">
      <Form {...formStep01}>
        <form
          onSubmit={formStep01.handleSubmit(onSubmit)}
          className={cn("space-y-8 px-4 pb-2 sm:pb-0 sm:px-2")}
        >
          <FormField
            control={formStep01.control}
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
                <FormDescription>
                  This is your public event name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStep01.control}
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
                    rows={5}
                  />
                </FormControl>
                <FormDescription>Explain briefly about event</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStep01.control}
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
          <Accordion
            type="single"
            collapsible
            className="w-full relative bottom-4"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="hover:no-underline hover:text-primary">
                Advanced configurations
              </AccordionTrigger>
              <AccordionContent className=" grid grid-cols-2 gap-4 items-center p-2">
                <FormField
                  control={formStep01.control}
                  name="to_date_time"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
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
                            <TimePicker
                              setDate={field.onChange}
                              date={field.value}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formStep01.control}
                  name="subscription_count"
                  render={({ field }) => (
                    <FormItem>
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Button disabled={isLoading} className="w-full" type="submit">
            Next
          </Button>
        </form>
      </Form>
    </ScrollArea>
  );
};
