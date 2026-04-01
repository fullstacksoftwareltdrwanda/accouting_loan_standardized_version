export type FormFieldType = 
  | "text" 
  | "number" 
  | "email" 
  | "password" 
  | "textarea" 
  | "select" 
  | "date" 
  | "checkbox" 
  | "switch" 
  | "currency";

export interface FormOption {
  label: string;
  value: string | number;
}

export interface FormSectionConfig {
  id: string;
  title: string;
  description?: string;
}

export interface FormFieldConfig {
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: any;
  options?: FormOption[];
  section?: string;
  width?: "full" | "half" | "third";
  hidden?: boolean | ((values: any) => boolean);
}

export interface DynamicFormConfig {
  sections?: FormSectionConfig[];
  fields: FormFieldConfig[];
  defaultValues?: Record<string, any>;
  submitLabel?: string;
}
