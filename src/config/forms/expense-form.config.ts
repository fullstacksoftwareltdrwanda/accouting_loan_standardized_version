import { DynamicFormConfig } from "@/types/form";

export const LOG_EXPENSE_FORM_CONFIG: DynamicFormConfig = {
  submitLabel: "Log Expense",
  sections: [
    {
      id: "details",
      title: "Transaction Details",
      description: "Basic info about the expenditure."
    },
    {
      id: "accounting",
      title: "Ledger Classification",
      description: "Assign this expense to the correct accounting pool."
    }
  ],
  fields: [
    {
      name: "description",
      label: "Description",
      type: "text",
      placeholder: "e.g. Office Rent Mar 2026",
      required: true,
      width: "full",
      section: "details"
    },
    {
      name: "amount",
      label: "Amount",
      type: "currency",
      placeholder: "0.00",
      required: true,
      width: "half",
      section: "details"
    },
    {
      name: "date",
      label: "Transaction Date",
      type: "date",
      required: true,
      width: "half",
      section: "details",
      defaultValue: new Date().toISOString().split('T')[0]
    },
    {
      name: "category",
      label: "Expense Category",
      type: "select",
      required: true,
      width: "half",
      section: "accounting",
      options: [
        { label: "Fixed Cost", value: "Fixed Cost" },
        { label: "Variable Cost", value: "Variable Cost" },
        { label: "Administrative", value: "Administrative" },
        { label: "Financial", value: "Financial" },
        { label: "Marketing", value: "Marketing" },
        { label: "Salaries", value: "Salaries" }
      ]
    },
    {
      name: "accountCode",
      label: "GL Account Code",
      type: "select",
      required: true,
      width: "half",
      section: "accounting",
      options: [
        { label: "5101 - Rent & Rates", value: "5101" },
        { label: "5201 - Staff Costs", value: "5201" },
        { label: "5301 - Utilities & Admin", value: "5301" },
        { label: "5401 - Sales & Marketing", value: "5401" },
        { label: "5105 - Bank Charges", value: "5105" }
      ]
    },
    {
      name: "reference",
      label: "Reference # (Optional)",
      type: "text",
      placeholder: "e.g. INV-12345",
      width: "full",
      section: "details"
    }
  ]
};
