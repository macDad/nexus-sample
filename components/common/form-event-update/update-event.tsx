"use client";
import { Event } from "@prisma/client";
import React, { FC, useState } from "react";
import { Button } from "../../ui/button";
import { ScrollArea } from "../../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";

import { BioForm } from "./bio";
import { Images } from "./images";
import { AdditionalFields } from "./additional-fields";

export const FormEventEdit: FC<{ event: Event }> = ({ event }) => {
  return (
    <Tabs defaultValue={"bio"} className=" w-full">
      <TabsList className=" grid w-fit grid-cols-3 ">
        <TabsTrigger value="bio">Bio Data</TabsTrigger>
        <TabsTrigger value="img">Images</TabsTrigger>
        <TabsTrigger value="cusfields">Custom Fields</TabsTrigger>
      </TabsList>
      <TabsContent value="bio">
        <ScrollArea className="h-[60vh] sm:h-[80vh] pr-5 pb-5">
          <BioForm event={event} />
        </ScrollArea>
      </TabsContent>
      <TabsContent value="img">
        <ScrollArea className=" h-[60vh] sm:h-fit sm:max-h-[80vh]">
          <Images event={event} />
        </ScrollArea>
      </TabsContent>
      <TabsContent value="cusfields">
        <ScrollArea className=" h-[60vh] sm:h-fit sm:max-h-[80vh]">
          <AdditionalFields event={event} />
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};
