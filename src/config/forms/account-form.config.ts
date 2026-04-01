import { DynamicFormConfig } from "@/types/form";

export const NEW_ACCOUNT_FORM_CONFIG: DynamicFormConfig = {
  submitLabel: "Create Account",
  sections: [
    {
      id: "basic",
      title: "Account Identification",
      description: "Define the unique code and name for the General Ledger account."
    },
    {
      id: "classification",
      title: "Classification & Accounting",
      description: "Assign the category and normal balance for proper double-entry tracking."
    }
  ],
  fields: [
    {
      name: "code",
      label: "Account Code",
      type: "text",
      placeholder: "e.g. 1101",
      required: true,
      width: "half",
      section: "basic",
      description: "A unique numeric identifier (1xxx=Asset, 2xxx=Liability, etc.)"
    },
    {
      name: "name",
      label: "Account Name",
      type: "text",
      placeholder: "e.g. Cash in Bank",
      required: true,
      width: "half",
      section: "basic"
    },
    {
      name: "category",
      label: "Account Category",
      type: "select",
      required: true,
      width: "half",
      section: "classification",
      options: [
        { label: "Asset", value: "Asset" },
        { label: "Liability", value: "Liability" },
        { label: "Equity", value: "Equity" },
        { label: "Revenue", value: "Revenue" },
        { label: "Expense", value: "Expense" }
      ]
    },
    {
      name: "normalBalance",
      label: "Normal Balance",
      type: "select",
      required: true,
      width: "half",
      section: "classification",
      defaultValue: "Debit",
      options: [
        { label: "Debit", value: "Debit" },
        { label: "Credit", value: "Credit" }
      ]
    },
    {
      name: "balance",
      label: "Initial Balance",
      type: "currency",
      defaultValue: 0,
      width: "full",
      section: "classification",
      description: "The opening balance for this account."
    },
    {
      name: "description",
      label: "Notes / Description",
      type: "textarea",
      placeholder: "Provide any additional context...",
      width: "full",
      section: "basic"
    }
  ]
};
