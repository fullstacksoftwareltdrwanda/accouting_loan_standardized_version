import { DynamicFormConfig } from "@/types/form";

export const NEW_LOAN_FORM_CONFIG: DynamicFormConfig = {
  submitLabel: "Submit Application",
  sections: [
    {
      id: "borrower",
      title: "Borrower & Category",
      description: "Select the customer and the purpose of the loan."
    },
    {
      id: "terms",
      title: "Loan Terms",
      description: "Define the amount, interest rate, and duration."
    }
  ],
  fields: [
    {
      name: "customerId",
      label: "Select Borrower",
      type: "select",
      required: true,
      width: "full",
      section: "borrower",
      options: [
        { label: "John Smith (cust_1)", value: "cust_1" },
        { label: "Sarah Johnson (cust_2)", value: "cust_2" },
        { label: "David Mugisha (cust_3)", value: "cust_3" },
        { label: "Alice Umuhoza (cust_6)", value: "cust_6" }
      ]
    },
    {
      name: "category",
      label: "Loan Category",
      type: "select",
      required: true,
      width: "half",
      section: "borrower",
      options: [
        { label: "Personal", value: "Personal" },
        { label: "Business", value: "Business" },
        { label: "Emergency", value: "Emergency" },
        { label: "Education", value: "Education" }
      ]
    },
    {
      name: "frequency",
      label: "Repayment Frequency",
      type: "select",
      required: true,
      width: "half",
      section: "borrower",
      defaultValue: "Monthly",
      options: [
        { label: "Daily", value: "Daily" },
        { label: "Weekly", value: "Weekly" },
        { label: "Monthly", value: "Monthly" }
      ]
    },
    {
      name: "principal",
      label: "Loan Amount",
      type: "currency",
      placeholder: "e.g. 5000",
      required: true,
      width: "half",
      section: "terms"
    },
    {
      name: "interestRate",
      label: "Interest Rate (%)",
      type: "number",
      placeholder: "e.g. 15",
      required: true,
      width: "half",
      section: "terms"
    },
    {
      name: "term",
      label: "Loan Term (Months)",
      type: "number",
      placeholder: "12",
      required: true,
      width: "full",
      section: "terms"
    },
    {
      name: "purpose",
      label: "Loan Purpose",
      type: "textarea",
      placeholder: "Briefly explain what this loan is for...",
      width: "full",
      section: "borrower"
    }
  ]
};
