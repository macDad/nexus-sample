"use client";
import { z } from "zod";
import { StepProps } from "./create-event-form";
import React, { FC } from "react";
import { defaultFields } from "@/data";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CustomFieldsProps, FieldType } from "@/typings";
import { toast } from "@/components/ui/use-toast";
import { CustomFields } from "./custom-fields";

export const stepSchemaStep03 = z.object({
  fields: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You have to select at least one item.",
  }),
});

export type Step3Data = z.infer<typeof stepSchemaStep03>;

export const Step_03: FC<StepProps<Step3Data>> = ({
  onNext,
  onBack,
  defaultValues,
  isLoading,
  customProps,
}) => {
  const defaultFieldIds = defaultFields.map((field) => field.id);
  const form = useForm<Step3Data>({
    resolver: zodResolver(stepSchemaStep03),
    defaultValues: {
      fields: defaultValues.fields ?? defaultFieldIds,
    },
  });

  const {
    field,
    setField,
    text,
    setText,
    optionText,
    setOptionText,
    options,
    setOptions,
    allFields,
    setAllFields,
    editingField,
    setEditingField,
    editingOptionIndex,
    setEditingOptionIndex,
  } = customProps as CustomFieldsProps;

  const onSubmit: SubmitHandler<Step3Data> = (values) => onNext(values);

  const handleSubmitFields = () => {
    if (text.trim() === "") {
      toast({ variant: "destructive", title: "Field name cannot be empty." });
      return;
    }
    if (
      field !== "text_field" &&
      options.length < (field === "radio_group" ? 2 : 1)
    ) {
      toast({
        variant: "destructive",
        title:
          field === "radio_group"
            ? "Radio group must have at least two options."
            : "Checkbox must have at least one option.",
      });
      return;
    }

    const newValue: FieldType = {
      type: field,
      value: text,
      options: options.length > 0 ? options : undefined,
    };

    setAllFields((prevFields) => {
      if (editingField) {
        const updatedFields = prevFields.map((f) =>
          f === editingField ? newValue : f
        );
        return updatedFields;
      } else {
        return [...prevFields, newValue];
      }
    });

    setText("");
    setOptions([]);
    setEditingField(null);
  };

  return (
    <div className=" min-h-fit max-h-[60vh] sm:px-0 sm:h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("space-y-8 pb-2 sm:pb-0 sm:pr-0 pr-4")}
        >
          <div>
            <FormField
              control={form.control}
              name="fields"
              render={() => (
                <FormItem>
                  <div className=" px-2 my-4">
                    <FormLabel className="text-base">
                      User verification form fields
                    </FormLabel>
                    <FormDescription>
                      Please choose what fields you want with user verification.
                    </FormDescription>
                  </div>
                  <div className=" sm:grid sm:grid-cols-4 min-h-fit max-h-60 gap-4">
                    <ScrollArea className="h-full p-2 sm:h-64">
                      <div className="grid grid-cols-2 sm:flex flex-col">
                        <h1 className=" font-medium mb-2 underline">
                          Default fields
                        </h1>
                        {defaultFields.map((df) => (
                          <FormField
                            key={df.id}
                            control={form.control}
                            name="fields"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={df.id}
                                  className="flex space-x-2"
                                >
                                  <FormControl>
                                    <Checkbox
                                      disabled={isLoading}
                                      checked={field.value?.includes(df.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              df.id,
                                            ])
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
                        ))}
                      </div>
                    </ScrollArea>
                    <CustomFields
                      field={field}
                      setField={setField}
                      text={text}
                      setText={setText}
                      optionText={optionText}
                      setOptionText={setOptionText}
                      options={options}
                      setOptions={setOptions}
                      allFields={allFields}
                      setAllFields={setAllFields}
                      editingField={editingField}
                      setEditingField={setEditingField}
                      editingOptionIndex={editingOptionIndex}
                      setEditingOptionIndex={setEditingOptionIndex}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <div className="w-full col-span-2 bg-background">
              <Button
                onClick={handleSubmitFields}
                variant={"secondary"}
                type="button"
                className="mt-2 w-full"
              >
                {editingField ? "Update Field" : "Add Field"}
              </Button>
            </div>
            <Button disabled={isLoading} className="w-full" type="submit">
              {isLoading ? (
                <Loader2 className=" size-4 animate-spin" />
              ) : (
                "Create Event"
              )}
            </Button>
            {onBack && (
              <Button
                disabled={isLoading}
                onClick={onBack}
                variant={"secondary"}
                className="w-full"
                type="button"
              >
                Back
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};
