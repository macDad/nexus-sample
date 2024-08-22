# API Handlers for Events CRUD

This document provides an overview of the API handlers for managing events in the application. The handlers include operations to create, retrieve, update, and delete events, with support for file uploads to S3 and permission-based access control.

## Dependencies

- **GrantPermissions**: Function for permission checks.
- **UserPermissions**: TypeScript type for user permissions.
- **Event**: Prisma model representing an event.
- **prisma**: Prisma client for database interactions.
- **UploadToS3**: Function for uploading files to S3.
- **dataURLtoFile**: Function for converting data URLs to file objects.
- **crypto**: Node.js module for cryptographic operations.
- **excludeId**: Function to exclude the `id` property from objects.
- **DeleteObjectCommand**: AWS SDK command for deleting objects from S3.
- **s3Client**: AWS SDK S3 client.
- **deleteFromS3**: Function for deleting files from S3.

## API Handlers

### `POST /events`

**Description**: Creates a new event with the provided data, including file uploads to S3 for images.

**Request Headers**:
- `permissions`: JSON array of user permissions.
- `sub`: User's ID.

**Request Body**: An `Event` object.

**Response**:
- `201 Created` on success with the created event data.
- `401 Unauthorized` if the user lacks `create:events` permission.
- `500 Internal Server Error` on failure.

**Functionality**:
1. Checks if the user has the `create:events` permission.
2. Parses the request body and generates a unique event key.
3. Uploads the event's thumbnail and banner images to S3.
4. Creates a new event record in the database.
5. Returns the created event.

### `GET /events`

**Description**: Retrieves a list of events based on query parameters and user permissions.

**Request Headers**:
- `permissions`: JSON array of user permissions.
- `sub`: User's ID.

**Query Parameters**:
- `search`: Search term for event name, description, or key.
- `key`, `eventName`, `description`, `fromDate`, `toDate`, `createdAt`, `updatedAt`: Various filters for the events.
- `page`, `pageSize`: Pagination parameters.

**Response**:
- `200 OK` with the list of events.
- `401 Unauthorized` if the user lacks required permissions.
- `500 Internal Server Error` on failure.

**Functionality**:
1. Checks user permissions to determine access level.
2. Applies query parameters to filter events.
3. Retrieves events from the database, respecting user permissions.
4. Returns the filtered list of events.

### `PUT /events`

**Description**: Updates an existing event. Supports updating event images with file uploads to S3.

**Request Headers**:
- `permissions`: JSON array of user permissions.
- `sub`: User's ID.

**Request Body**: Partial `Event` object with updated data.

**Response**:
- `200 OK` with the updated event data.
- `401 Unauthorized` if the user lacks `update:events` permission.
- `400 Bad Request` if the event key is missing.
- `404 Not Found` if the event does not exist.
- `500 Internal Server Error` on failure.

**Functionality**:
1. Checks if the user has the `update:events` permission.
2. Finds the existing event in the database.
3. Updates event images and other properties.
4. Updates the event record in the database.
5. Returns the updated event.

### `DELETE /events`

**Description**: Deletes an existing event and its associated images from S3.

**Request Headers**:
- `permissions`: JSON array of user permissions.

**Request Body**: Object with the `key` of the event to be deleted.

**Response**:
- `200 OK` on successful deletion.
- `401 Unauthorized` if the user lacks `delete:events` permission.
- `404 Not Found` if the event does not exist.
- `500 Internal Server Error` on failure.

**Functionality**:
1. Checks if the user has the `delete:events` permission.
2. Finds the event to be deleted and its associated images.
3. Deletes the images from S3 and the event record from the database.
4. Returns a success message.

## Helper Functions

### `generateUniqueKey()`

**Description**: Generates a unique key for an event by ensuring it does not conflict with existing event keys.

**Functionality**:
1. Fetches existing event keys from the database.
2. Generates a random key and checks its uniqueness.
3. Returns a unique key.

---

This documentation provides a detailed description of each API handler, including request and response details, as well as helper functions used for generating unique keys.
