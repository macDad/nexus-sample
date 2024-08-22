"use client";

import { FC } from "react";
import * as React from "react";
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
import { useEvents, useMediaQuery } from "@/hooks/client";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formSchemaStep01, Step1Data, Step_01 } from "./step-01";
import { Step3Data, Step_03, stepSchemaStep03 } from "./step-03";
import { CustomFieldsProps, FieldType } from "@/typings";
import { defaultFieldTypes } from "@/data/default-event-form-fields";
import { formSchemaStep02, Step2Data, Step_02 } from "./step-02";
import { fileToDataURL } from "@/lib/data-url-file";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
const formSchema = formSchemaStep01.merge(
  formSchemaStep02.merge(stepSchemaStep03)
);

type FinalData = z.infer<typeof formSchema>;

export interface StepProps<T> {
  onNext: (data: T) => void;
  onBack?: () => void;
  defaultValues: Partial<T>;
  isLoading?: boolean;
  customProps?: CustomFieldsProps;
  step?: number;
}

export const FormCreateEvent: FC<React.PropsWithChildren> = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const [isLoading, setIsLoading] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState<Partial<FinalData>>({});
  const [banner, setBanner] = React.useState<File | null>(null);
  const [thumbnail, setThumbnail] = React.useState<File | null>(null);
  const [allFields, setAllFields] = React.useState<FieldType[]>([]);
  const [tab, setTab] = React.useState<string>("step-01");
  const { addEvent } = useEvents();

  const form = useForm<FinalData>({
    resolver: zodResolver(formSchema),
  });

  const handleNextStep = (data: Partial<FinalData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    const current = parseInt(tab.split("-")[1]);
    setStep(current + 1);
    setTab(`step-0${current + 1}`);
  };

  const handleBackStep = () => {
    const current = parseInt(tab.split("-")[1]);
    if (current !== 0) {
      setStep(current - 1);
      setTab(`step-0${current - 1}`);
    }
  };

  const handleResetStep = () => {
    setStep(1);
    setTab(`step-01`);
    form.reset();
    setFormData({});
  };

  const handleFinalSubmit = async (data: Step3Data) => {
    setIsLoading(true);
    setFormData((prev) => ({ ...prev, ...data }));

    if (formData.banner && formData.thumbnail) {
      const thumbnailDataURL = await fileToDataURL(formData.thumbnail[0]);
      const bannerDataURL = await fileToDataURL(formData.banner[0]);

      const res = await fetch("/api/v1/events", {
        method: "POST",
        headers: {
          Authorization: "application/json",
        },
        body: JSON.stringify({
          ...formData,
          ...data,
          subscription_count:
            formData.subscription_count &&
            parseInt(formData.subscription_count),
          thumbnail: thumbnailDataURL,
          banner: bannerDataURL,
          additional_fields: allFields,
        }),
      });

      if (res.ok) {
        addEvent(await res.json());
        handleResetStep();
        setOpen(false);
        toast({
          variant: "default",
          title: "Event Created Successfully",
          description: "created event details successfully",
          duration: 3000,
          className: "bg-green-600 text-white",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error while creating the event",
          description: await res.text(),
          duration: 3000,
          className: "bg-primary text-white",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Error while creating the event",
        description: "Missing Thumbnail or banner",
        duration: 3000,
        className: "bg-primary text-white",
      });
    }

    setIsLoading(false);
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[90vw] lg:max-w-[50vw]">
          <DialogHeader>
            <DialogTitle>Create new Event</DialogTitle>
            <DialogDescription>
              You can create new event in here.
            </DialogDescription>
          </DialogHeader>
          <FormEvent
            tab={tab}
            step={step}
            banner={banner}
            setTab={setTab}
            setStep={setStep}
            formData={formData}
            allFields={allFields}
            setBanner={setBanner}
            thumbnail={thumbnail}
            isLoading={isLoading}
            setFormData={setFormData}
            setAllFields={setAllFields}
            setThumbnail={setThumbnail}
            handleBackStep={handleBackStep}
            handleNextStep={handleNextStep}
            handleFinalSubmit={handleFinalSubmit}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <ScrollArea>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Create new Event</DrawerTitle>
            <DrawerDescription>
              You can create new event in here.
            </DrawerDescription>
          </DrawerHeader>
          <FormEvent
            className="px-4"
            tab={tab}
            step={step}
            banner={banner}
            setTab={setTab}
            setStep={setStep}
            formData={formData}
            allFields={allFields}
            setBanner={setBanner}
            thumbnail={thumbnail}
            isLoading={isLoading}
            setFormData={setFormData}
            setAllFields={setAllFields}
            setThumbnail={setThumbnail}
            handleBackStep={handleBackStep}
            handleNextStep={handleNextStep}
            handleFinalSubmit={handleFinalSubmit}
          />
        </DrawerContent>
      </Drawer>
    </ScrollArea>
  );
};

const FormEvent: FC<{
  isLoading?: boolean;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  tab: string | undefined;
  setTab: ((value: string) => void) | undefined;
  handleNextStep: (data: Partial<FinalData>) => void;
  handleFinalSubmit: (data: Step3Data) => void;
  handleBackStep: () => void;
  className?: string;
  banner: File | null;
  setBanner: React.Dispatch<React.SetStateAction<File | null>>;
  thumbnail: File | null;
  setThumbnail: React.Dispatch<React.SetStateAction<File | null>>;
  formData: Partial<FinalData>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<FinalData>>>;
  allFields: FieldType[];
  setAllFields: React.Dispatch<React.SetStateAction<FieldType[]>>;
}> = ({
  isLoading,
  step,
  tab,
  setTab,
  handleNextStep,
  handleBackStep,
  handleFinalSubmit,
  formData,
  className,
  allFields,
  setAllFields,
}) => {
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

  return (
    <Tabs
      onValueChange={setTab}
      value={tab}
      defaultValue="step-01"
      className={cn("w-full", className)}
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger
          disabled={isLoading}
          className="text-muted-foreground/70 data-[state=active]:text-primary"
          value="step-01"
        >
          Step 01
        </TabsTrigger>
        <TabsTrigger
          disabled={step === 1 || isLoading}
          className="text-muted-foreground/70 data-[state=active]:text-primary"
          value="step-02"
        >
          Step 02
        </TabsTrigger>
        <TabsTrigger
          disabled={step === 1 || step === 2 || isLoading}
          className="text-muted-foreground/70 data-[state=active]:text-primary"
          value="step-03"
        >
          Step 03
        </TabsTrigger>
      </TabsList>
      <TabsContent value="step-01">
        <Step_01
          isLoading={isLoading}
          onNext={handleNextStep}
          defaultValues={formData as Step1Data}
        />
      </TabsContent>
      <TabsContent value="step-02">
        <Step_02
          isLoading={isLoading}
          onNext={handleNextStep}
          defaultValues={formData as Step2Data}
          onBack={handleBackStep}
          step={step}
        />
      </TabsContent>
      <TabsContent value="step-03">
        <Step_03
          isLoading={isLoading}
          onNext={handleFinalSubmit}
          onBack={handleBackStep}
          defaultValues={formData as Step3Data}
          customProps={{
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
          }}
        />
      </TabsContent>
    </Tabs>
  );
};
