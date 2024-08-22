import { WithPermissions } from "@/components/common/auth/with-permissions-client";
import { EventsList } from "@/components/common/events-list";
import { FormCreateEvent } from "@/components/pages/portal";
import { WithPreVerifier } from "@/components/pre-verifier-client";
import { Button } from "@/components/ui/button";
import React from "react";

export default function DashboardPage() {
  return (
    <WithPreVerifier>
      <section className=" flex justify-end w-full mb-2">
        <WithPermissions roles={["company"]}>
          <FormCreateEvent>
            <Button variant={"default"}>New Event</Button>
          </FormCreateEvent>
        </WithPermissions>
      </section>
      <section className=" mt-10">
        <EventsList title="Recent Events" />
      </section>
    </WithPreVerifier>
  );
}
