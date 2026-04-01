import { DynamicFormConfig } from "@/types/form";

export const NEW_CUSTOMER_FORM_CONFIG: DynamicFormConfig = {
  submitLabel: "Onboard Customer",
  sections: [
    {
      id: "personal",
      title: "Personal Information",
      description: "Basic contact and identification details for the new borrower."
    },
    {
      id: "kyc",
      title: "KYC & Identity",
      description: "National identification and residency proof."
    }
  ],
  fields: [
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      placeholder: "e.g. John",
      required: true,
      width: "half",
      section: "personal"
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
      placeholder: "e.g. Smith",
      required: true,
      width: "half",
      section: "personal"
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "john@example.com",
      required: true,
      width: "half",
      section: "personal"
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "text",
      placeholder: "+250 788 000 000",
      required: true,
      width: "half",
      section: "personal"
    },
    {
      name: "nin",
      label: "National ID / NIN",
      type: "text",
      placeholder: "11990123...",
      required: true,
      width: "half",
      section: "kyc",
      description: "16-digit national identification number."
    },
    {
      name: "address",
      label: "Residential Address",
      type: "textarea",
      placeholder: "District, Sector, Cell...",
      width: "full",
      section: "kyc"
    }
  ]
};
