import { DynamicFormConfig } from "@/types/form";

export const ACQUIRE_ASSET_FORM_CONFIG: DynamicFormConfig = {
  submitLabel: "Register Asset",
  sections: [
    {
      id: "identity",
      title: "Asset Identification",
      description: "Basic info and tagging for the new capital asset."
    },
    {
      id: "valuation",
      title: "Value & Depreciation",
      description: "Purchase details and expected longevity."
    }
  ],
  fields: [
    {
      name: "name",
      label: "Asset Name",
      type: "text",
      placeholder: "e.g. MacBook Pro M3",
      required: true,
      width: "full",
      section: "identity"
    },
    {
      name: "category",
      label: "Asset Category",
      type: "select",
      required: true,
      width: "half",
      section: "identity",
      options: [
        { label: "Electronics", value: "Electronics" },
        { label: "Furniture", value: "Furniture" },
        { label: "Vehicles", value: "Vehicles" },
        { label: "Property", value: "Property" }
      ]
    },
    {
      name: "serialNumber",
      label: "Serial Number / Asset Tag",
      type: "text",
      placeholder: "SN-12345",
      width: "half",
      section: "identity"
    },
    {
      name: "value",
      label: "Purchase Price",
      type: "currency",
      placeholder: "0.00",
      required: true,
      width: "half",
      section: "valuation"
    },
    {
      name: "purchaseDate",
      label: "Acquisition Date",
      type: "date",
      required: true,
      width: "half",
      section: "valuation",
      defaultValue: new Date().toISOString().split('T')[0]
    },
    {
      name: "depreciationRate",
      label: "Depreciation Rate (Annual %)",
      type: "number",
      placeholder: "e.g. 15",
      required: true,
      width: "full",
      section: "valuation",
      defaultValue: 15
    }
  ]
};
