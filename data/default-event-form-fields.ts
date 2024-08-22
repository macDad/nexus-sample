import { FieldType, Field } from "@/typings";

export const defaultFields: Field[] = [
  {
    id: "fullName",
    label: "Full Name",
  },
  {
    id: "dateOfBirth",
    label: "Date of Birth",
  },
  {
    id: "address",
    label: "Address",
  },
  {
    id: "emailAddress",
    label: "Email Address",
  },
  {
    id: "mobileNumber",
    label: "Mobile Number",
  },
  {
    id: "gender",
    label: "Gender",
  },
  {
    id: "nationality",
    label: "Nationality",
  },
  {
    id: "idType",
    label: "ID Type",
  },
  {
    id: "idNumber",
    label: "ID Number",
  },
  {
    id: "idExpiryDate",
    label: "ID Expiry Date",
  },
  {
    id: "idIssuingCountry",
    label: "ID Issuing Country",
  },
  {
    id: "uploadIdDocument",
    label: "Upload ID Document",
  },
  {
    id: "selfieWithId",
    label: "Selfie with ID",
  },
];

export let defaultFieldTypes: FieldType[] = [
  {
    type: "text field",
    value: "text_field",
  },
  {
    type: "Check Box",
    value: "check_box",
  },
  {
    type: "Radio Group",
    value: "radio_group",
  },
];
