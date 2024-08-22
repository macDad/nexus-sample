import { GrantPermissions } from "@/lib/grant-permissions";
import { UserPermissions } from "@/typings";
import { Event } from "@prisma/client";
import prisma from "@/lib/prisma-client";
import { UploadToS3 } from "@/lib/actions/s3/uploadToS3";
import { dataURLtoFile } from "@/lib/data-url-file";
import crypto from "crypto";
import { deleteFromS3 } from "@/lib/actions/s3/deleteFromS3";

export async function POST(req: Request) {
  try {
    // Parse the 'permissions' header to get the user's permissions as an array of UserPermissions
    const RequestPermissions = JSON.parse(
      req.headers.get("permissions") as string
    ) as UserPermissions[];

    // Check if the user has the required 'create:events' permission
    if (GrantPermissions(["create:events"], RequestPermissions))
      return new Response("Unauthorized", { status: 401 });

    // Parse the request body as an Event object
    const data = (await req.json()) as Event;

    // Get the user's ID (sub) from the request headers
    const sub = req.headers.get("sub") as string;

    // Generate a unique key for the event
    const eventKey = await generateUniqueKey();

    // Upload the thumbnail image to S3 and update the data object with the S3 URL
    data.thumbnail = await UploadToS3(
      dataURLtoFile(data.thumbnail, "thumbnail"),
      `thumbnail-${eventKey}`,
      "user-details/events/"
    );

    // Upload the banner image to S3 and update the data object with the S3 URL
    data.banner = await UploadToS3(
      dataURLtoFile(data.banner, "banner"),
      `banner-${eventKey}`,
      "user-details/events/"
    );

    // Create a new event in the database with the provided data, including the generated event key and the user's ID
    const event = await prisma.event.create({
      data: { ...data, key: eventKey, userId: sub.replaceAll(`"`, "") },
      select: {
        key: true,
        additional_fields: true,
        banner: true,
        createdAt: true,
        description: true,
        event_name: true,
        fields: true,
        from_date_time: true,
        subscription_count: true,
        thumbnail: true,
        to_date_time: true,
        updatedAt: true,
      },
    });

    // Return a JSON response with the created event and a 201 status code
    return Response.json(event, { status: 201 });
  } catch (error: any) {
    // Log any errors that occur and return a 500 status response with the error message
    console.log(error);
    return new Response(error.message, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    // Parse the 'permissions' header to get the user's permissions
    const permissionsHeader = req.headers.get("permissions");
    if (!permissionsHeader) {
      return new Response("Unauthorized", { status: 401 });
    }

    const RequestPermissions = JSON.parse(
      permissionsHeader
    ) as UserPermissions[];

    // Check if the user has the 'get:all-events' (Admin) or 'get:events' (Nominal) permission
    const isAdmin = !GrantPermissions(["get:all-events"], RequestPermissions);
    const isNominal = !GrantPermissions(["get:events"], RequestPermissions);

    // If the user lacks both permissions, return an unauthorized response
    if (!isAdmin && !isNominal) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Get the user's ID (sub) from the request headers
    const sub = req.headers.get("sub");
    if (!sub) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Parse query parameters from the request URL
    const url = new URL(req.url);
    const filters: any = {};

    const searchTerm = url.searchParams.get("search") || undefined;
    if (searchTerm) {
      filters.OR = [
        { event_name: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
        { key: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    const key = url.searchParams.get("key") || undefined;
    const eventName = url.searchParams.get("eventName") || undefined;
    const description = url.searchParams.get("description") || undefined;
    const fromDate = url.searchParams.get("fromDate")
      ? new Date(url.searchParams.get("fromDate") as string)
      : undefined;
    const toDate = url.searchParams.get("toDate")
      ? new Date(url.searchParams.get("toDate") as string)
      : undefined;
    const createdAt = url.searchParams.get("createdAt")
      ? new Date(url.searchParams.get("createdAt") as string)
      : undefined;
    const updatedAt = url.searchParams.get("updatedAt")
      ? new Date(url.searchParams.get("updatedAt") as string)
      : undefined;
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);

    // Apply additional filters based on query parameters
    if (key) filters.key = key;
    if (eventName)
      filters.event_name = { contains: eventName, mode: "insensitive" };
    if (description)
      filters.description = { contains: description, mode: "insensitive" };
    if (fromDate) filters.from_date_time = { gte: fromDate };
    if (toDate) filters.to_date_time = { lte: toDate };
    if (createdAt) filters.createdAt = { gte: createdAt };
    if (updatedAt) filters.updatedAt = { gte: updatedAt };

    // Calculate pagination parameters (skip and take)
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // Fetch events from the database based on the user's permissions
    let events;
    if (isAdmin) {
      console.log("admin");
      // Admins can retrieve all events matching the filters
      events = await prisma.event.findMany({
        where: filters,
        skip,
        take,
        select: {
          key: true,
          userId: true,
          event_name: true,
          description: true,
          from_date_time: true,
          to_date_time: true,
          subscription_count: true,
          fields: true,
          additional_fields: true,
          banner: true,
          thumbnail: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: "desc" }, // Order by creation date (descending)
      });
    } else if (isNominal) {
      console.log("nominal");
      // Nominal users can only retrieve their own events matching the filters
      events = await prisma.event.findMany({
        where: {
          ...filters,
          userId: sub.replaceAll(`"`, ""), // Ensure only their events are retrieved
        },
        skip,
        take,
        orderBy: { createdAt: "desc" }, // Order by creation date (descending)
        select: {
          key: true,
          additional_fields: true,
          banner: true,
          createdAt: true,
          description: true,
          event_name: true,
          fields: true,
          from_date_time: true,
          subscription_count: true,
          thumbnail: true,
          to_date_time: true,
          updatedAt: true,
        },
      });
    }

    // Return the fetched events as a JSON response with a 200 status code
    return new Response(JSON.stringify(events), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    // Parse the permissions from headers
    const RequestPermissions = JSON.parse(
      req.headers.get("permissions") as string
    ) as UserPermissions[];

    // Check if the user has the required permissions to update events
    if (GrantPermissions(["update:events"], RequestPermissions)) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Parse the request body to extract event data
    const data = (await req.json()) as Partial<Event>;
    const sub = req.headers.get("sub") as string;

    // Ensure the event ID is provided for updating
    if (!data.key) {
      return new Response("Event Key is required", { status: 400 });
    }

    // Find the existing event in the database
    const existingEvent = await prisma.event.findUnique({
      where: { key: data.key, userId: sub.replaceAll(`"`, "") },
    });

    if (!existingEvent) {
      return new Response("Event not found", { status: 404 });
    }

    // Generate a unique key if needed (e.g., for new uploads)
    const eventKey = existingEvent.key || (await generateUniqueKey());

    // Handle thumbnail update if provided
    if (data.thumbnail) {
      data.thumbnail = await UploadToS3(
        dataURLtoFile(data.thumbnail, "thumbnail"),
        `thumbnail-${eventKey}`,
        "user-details/events/"
      );
    }

    // Handle banner update if provided
    if (data.banner) {
      data.banner = await UploadToS3(
        dataURLtoFile(data.banner, "banner"),
        `banner-${eventKey}`,
        "user-details/events/"
      );
    }

    // Update the event in the database
    const updatedEvent = await prisma.event.update({
      where: { key: data.key },
      data: {
        ...data,
        key: eventKey, // Maintain or assign new key if required
        userId: existingEvent.userId, // Ensure the original userId is retained
      },
      select: {
        key: true,
        additional_fields: true,
        banner: true,
        createdAt: true,
        description: true,
        event_name: true,
        fields: true,
        from_date_time: true,
        subscription_count: true,
        thumbnail: true,
        to_date_time: true,
        updatedAt: true,
      },
    });

    return Response.json(updatedEvent, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return new Response(error.message, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    // Parse the 'permissions' header to get the user's permissions as an array of UserPermissions
    const RequestPermissions = JSON.parse(
      req.headers.get("permissions") as string
    ) as UserPermissions[];

    // Check if the user has the required 'delete:events' permission
    if (GrantPermissions(["delete:events"], RequestPermissions))
      return new Response("Unauthorized", { status: 401 });

    // Get the event ID from the request body
    const { key } = await req.json();

    const sub = req.headers.get("sub") as string;

    // Find the event in the database to get the banner and thumbnail URLs
    const event = await prisma.event.findUnique({
      where: { key: key, userId: sub.replaceAll(`"`, "") },
      select: { banner: true, thumbnail: true, key: true },
    });

    if (!event) {
      return new Response("Event not found", { status: 404 });
    }

    // Delete the banner and thumbnail from S3
    await deleteFromS3(`thumbnail-${event.key}`, "user-details/events/");
    await deleteFromS3(`banner-${event.key}`, "user-details/events/");

    // Delete the event from the database
    await prisma.event.delete({
      where: { key: key },
    });

    // Return a success response
    return new Response("Event deleted successfully", { status: 200 });
  } catch (error: any) {
    console.log(error);
    return new Response(error.message, { status: 500 });
  }
}

async function generateUniqueKey() {
  let isUnique = false; // Flag to track if a unique key has been generated
  let newKey = ""; // Variable to store the generated key

  // Fetch all existing event keys from the database
  const existingKeys = await prisma.event.findMany({
    select: {
      key: true, // Only select the 'key' field
    },
  });

  // Convert the array of existing keys to a Set for efficient lookup
  const existingKeySet = new Set(existingKeys.map((event) => event.key));

  // Generate a new key and check for uniqueness
  while (!isUnique) {
    // Generate a random string of 20 characters using base64url encoding
    newKey = crypto
      .randomBytes(15)
      .toString("base64")
      .replace(/\+/g, "-") // Replace '+' with '-'
      .replace(/\//g, "_") // Replace '/' with '_'
      .replace(/=+$/, ""); // Remove trailing '='

    // Ensure the key is only 20 characters long
    newKey = newKey.slice(0, 20);

    // Check if the generated key is unique by checking against the existing keys
    if (!existingKeySet.has(newKey)) {
      isUnique = true; // If unique, set the flag to true to exit the loop
    }
  }

  // Return the unique key
  return newKey;
}
