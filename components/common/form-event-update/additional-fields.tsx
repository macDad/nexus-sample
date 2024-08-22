"use client";
import { CustomFields } from "@/components/pages/portal/create-event-form/custom-fields";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { defaultFieldTypes } from "@/data/default-event-form-fields";
import { useEvents } from "@/hooks/client";
import { FieldType } from "@/typings";
import { Event } from "@prisma/client";
import { Loader2 } from "lucide-react";
import React, { FC, useEffect, useState } from "react";

export const AdditionalFields: FC<{ event: Event }> = ({ event }) => {
  const [field, setField] = React.useState<string>(defaultFieldTypes[0].value);
  const [text, setText] = React.useState<string>("");
  const [optionText, setOptionText] = React.useState<string>("");
  const [options, setOptions] = React.useState<string[]>([]);
  const [editingField, setEditingField] = React.useState<FieldType | null>(
    null
  );
  const [editingOptionIndex, setEditingOptionIndex] = React.useState<
    number | null
  >(null);
  const [allFields, setAllFields] = React.useState<FieldType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { updateEvent } = useEvents();

   // Initialize allFields with the default values from event.additional_fields
   useEffect(() => {
    if (event.additional_fields && event.additional_fields.length > 0) {
      const initializedFields = event.additional_fields.map((field) => ({
        ...field,
        options: field.options || [], // Ensure options is always an array
      }));
      setAllFields(initializedFields);
    }
  }, [event.additional_fields]);

  const onSubmit = async () => {
    setIsLoading(true);
    const res = await fetch("/api/v1/events", {
      method: "PUT",
      headers: {
        Authorization: "application/json",
      },
      body: JSON.stringify({
        key: event.key,
        additional_fields: allFields,
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
      options: options, // Options will always be an array
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
    <>
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
      <Button
        disabled={isLoading}
        onClick={handleSubmitFields}
        variant={"secondary"}
        type="button"
        className="mt-2 w-full"
      >
        {editingField ? "Update Field" : "Add Field"}
      </Button>
      <Button
        disabled={isLoading}
        onClick={onSubmit}
        type="submit"
        className=" w-full mt-2"
      >
        {isLoading ? <Loader2 className=" size-4 animate-spin" /> : "Save"}
      </Button>
    </>
  );
};
