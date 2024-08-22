import { icons } from "lucide-react";

export interface Field {
  id: string;
  label: string;
}
export type FieldType = {
  type: string;
  value: string;
  options?: string[];
};

export interface CustomFieldsProps {
  field: string;
  setField: React.Dispatch<React.SetStateAction<string>>;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  optionText: string;
  setOptionText: React.Dispatch<React.SetStateAction<string>>;
  options: string[];
  setOptions: React.Dispatch<React.SetStateAction<string[]>>;
  allFields: FieldType[];
  setAllFields: React.Dispatch<React.SetStateAction<FieldType[]>>;
  editingField: FieldType | null;
  setEditingField: React.Dispatch<React.SetStateAction<FieldType | null>>;
  editingOptionIndex: number | null;
  setEditingOptionIndex: React.Dispatch<React.SetStateAction<number | null>>;
}
