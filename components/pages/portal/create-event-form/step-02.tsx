"use client";
import { FC } from "react";
import { z } from "zod";
import { StepProps } from "./create-event-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/common/dropzone/file-uploader";

export const formSchemaStep02 = z.object({
  thumbnail: z
    .array(z.instanceof(File))
    .min(1, { message: "banner is required!" }),
  banner: z
    .array(z.instanceof(File))
    .min(1, { message: "banner is required!" }),
});

export type Step2Data = z.infer<typeof formSchemaStep02>;

export const Step_02: FC<StepProps<Step2Data>> = ({
  isLoading,
  defaultValues,
  onNext,
  onBack,
  step,
}) => {
  const form = useForm<Step2Data>({
    resolver: zodResolver(formSchemaStep02),
    defaultValues,
  });

  const onSubmit: SubmitHandler<Step2Data> = (values) => onNext(values);

  return (
    <ScrollArea className=" h-full sm:px-0">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(" px-4 pb-2 sm:pb-0 sm:px-2 grid grid-cols-2 gap-4")}
        >
          <FormField
            control={form.control}
            name="thumbnail"
            render={({ field }) => (
              <div className="space-y-6">
                <FormItem className="w-full">
                  <FormLabel>Thumbnail</FormLabel>
                  <FormControl>
                    <FileUploader
                      value={field.value}
                      onValueChange={field.onChange}
                      maxFileCount={1}
                      maxSize={10 * 1024 * 1024}
                      step={step}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
            )}
          />
          <FormField
            control={form.control}
            name="banner"
            render={({ field }) => (
              <div className="space-y-6">
                <FormItem className="w-full">
                  <FormLabel>Banner</FormLabel>
                  <FormControl>
                    <FileUploader
                      value={field.value}
                      onValueChange={field.onChange}
                      maxFileCount={1}
                      maxSize={10 * 1024 * 1024}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
            )}
          />
          <Button
            disabled={isLoading}
            className="w-full col-span-2"
            type="submit"
          >
            Next
          </Button>
          <Button
            disabled={isLoading}
            className="w-full col-span-2"
            type="button"
            onClick={onBack}
            variant={"secondary"}
          >
            Back
          </Button>
        </form>
      </Form>
    </ScrollArea>
  );
};
