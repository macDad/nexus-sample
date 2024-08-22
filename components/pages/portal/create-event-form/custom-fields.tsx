"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { defaultFieldTypes } from "@/data/default-event-form-fields";
import { cn } from "@/lib/utils";
import { CustomFieldsProps, FieldType } from "@/typings";
import { Pencil, Plus, X } from "lucide-react";
import React, { ChangeEvent, FC } from "react";

export const CustomFields: FC<CustomFieldsProps> = ({
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
}) => {
  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleOptionsChange = (event: ChangeEvent<HTMLInputElement>) => {
    setOptionText(event.target.value);
  };

  const handleAddOptions = () => {
    if (optionText.trim() === "") {
      toast({ variant: "destructive", title: "Option text cannot be empty." });
      return;
    }

    setOptions((prevOptions) => {
      if (editingOptionIndex !== null) {
        const updatedOptions = [...prevOptions];
        updatedOptions[editingOptionIndex] = optionText;
        setEditingOptionIndex(null);
        return updatedOptions;
      } else {
        return [...prevOptions, optionText];
      }
    });

    setOptionText("");
  };

  const handleRemoveField = (fld: FieldType) => {
    setAllFields((prevArray) => prevArray.filter((item) => item !== fld));
    setOptions([]);
  };

  const handleRemoveOption = (opt: string) => {
    setOptions((prevArray) => prevArray.filter((item) => item !== opt));
  };

  const handleEditField = (fld: FieldType) => {
    setEditingField(fld);
    setField(fld.type);
    setText(fld.value);
    setOptions(fld.options || []);
  };

  const handleEditOption = (opt: string, index: number) => {
    setOptionText(opt);
    setEditingOptionIndex(index);
  };

  return (
    <ScrollArea className="w-full col-span-3 h-64">
      <div className=" p-2 grid grid-cols-2 relative">
        <div className="h-fit pr-4">
          <h1 className="font-medium underline mb-2">Fields that you want</h1>
          <RadioGroup
            defaultValue={defaultFieldTypes[0].value}
            className="mt-2 px-2"
            onValueChange={setField}
            value={field}
          >
            {defaultFieldTypes.map((fld, index) => (
              <div key={`def-field-${index}`} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={fld.value} id={fld.value} />
                  <Label
                    htmlFor={fld.value}
                    className={cn(
                      "capitalize flex items-center cursor-pointer",
                      field === fld.value
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {fld.type}
                  </Label>
                </div>
              </div>
            ))}
          </RadioGroup>
          <section className="mt-4 px-2 pb-2">
            {field === "text_field" && (
              <Input
                value={text}
                onChange={handleTextChange}
                placeholder="Field Name"
                className=""
              />
            )}
            {(field === "check_box" || field === "radio_group") && (
              <div className="space-y-2">
                <Input
                  value={text}
                  onChange={handleTextChange}
                  placeholder="Field Name"
                  className="px-2"
                />
                <div className="w-full flex gap-2">
                  <Input
                    value={optionText}
                    onChange={handleOptionsChange}
                    placeholder="Option"
                    className="w-full flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAddOptions}
                    size={"icon"}
                    className=""
                  >
                    {editingField ? (
                      <Pencil className="size-4" />
                    ) : (
                      <Plus className="size-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </section>
          <section className="w-full flex flex-wrap gap-2">
            {options.map((opt, index) => (
              <div
                key={`show-option-data-${index}`}
                className="flex items-center p-1 bg-muted px-2 justify-between rounded cursor-pointer"
                onClick={() => handleEditOption(opt, index)}
              >
                <p className="text-muted-foreground text-sm font-medium">
                  {opt}
                </p>
                <X
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveOption(opt);
                  }}
                  className="size-4 text-muted-foreground hover:text-red-500 cursor-pointer"
                />
              </div>
            ))}
          </section>
        </div>

        <div className="h-fit pr-4 w-full col-span-1">
          <div className={cn("w-full flex flex-wrap gap-2 pl-2" , allFields.length === 0 && "h-60 bg-muted flex items-center justify-center w-full px-4 rounded-md")}>
          {allFields.length > 0 && <p className=" font-medium leading-4 underline"> Custom fields</p>}
            
            {allFields.map((fld, index) => (
              <div
                key={`show-field-data-${index}`}
                className="flex p-1 bg-muted w-full h-fit px-2 justify-between rounded cursor-pointer"
                onClick={() => handleEditField(fld)}
              >
                <div>
                  <div className="text-muted-foreground text-sm font-medium">
                    <div className=" space-y-1">
                      <p className="font-medium text-foreground flex flex-col">
                        Field : {fld.value}
                      </p>
                      <p className="font-normal text-foreground flex flex-col">
                        Type : {fld.type.replace("_", " ")}
                      </p>
                    </div>

                    {fld.options && (
                      <div className="mt-1 flex flex-wrap space-x-2">
                        {fld.options.map((opt, optIndex) => (
                          <p className="text-xs" key={`fld-opt-${optIndex}`}>
                            {opt}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <X
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveField(fld);
                  }}
                  className="size-4 top-1 relative text-muted-foreground hover:text-red-500 cursor-pointer"
                />
              </div>
            ))}
            {allFields.length === 0 && <p className=" font-medium leading-4 text-muted-foreground text-center"> There are no any custom fields added yet...</p>}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};
