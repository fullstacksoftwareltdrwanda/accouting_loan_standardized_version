"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DynamicFormConfig, FormFieldConfig } from "@/types/form";
import { FormFieldRenderer } from "./form-field-renderer";
import { FormSection } from "./form-section";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DynamicFormProps {
  config: DynamicFormConfig;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  className?: string;
}

export function DynamicForm({
  config,
  onSubmit,
  isLoading,
  className,
}: DynamicFormProps) {
  // 1. Generate Zod Schema from config
  const schemaShape: Record<string, z.ZodTypeAny> = {};
  
  config.fields.forEach((field) => {
    let schema: z.ZodTypeAny;

    switch (field.type) {
      case "number":
      case "currency":
        schema = z.number();
        break;
      case "checkbox":
      case "switch":
        schema = z.boolean();
        break;
      case "email":
        schema = z.string().email("Invalid email address");
        break;
      default:
        schema = z.string();
    }

    if (field.required) {
      if (field.type === "number" || field.type === "currency") {
        schema = (schema as z.ZodNumber).min(1, `${field.label} is required`);
      } else if (field.type === "checkbox" || field.type === "switch") {
        schema = (schema as z.ZodBoolean).refine(val => val === true, `${field.label} must be checked`);
      } else {
        schema = (schema as z.ZodString).min(1, `${field.label} is required`);
      }
    } else {
      schema = schema.optional();
    }

    schemaShape[field.name] = schema;
  });

  const formSchema = z.object(schemaShape);

  // 2. Initialize Form
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: config.defaultValues || {},
  });

  const { handleSubmit, watch } = methods;
  const currentValues = watch();

  // 3. Group fields by section
  const sections = config.sections || [{ id: "default", title: "General Information" }];
  
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn("space-y-8", className)}
      >
        {sections.map((section) => (
          <FormSection
            key={section.id}
            title={section.title}
            description={section.description}
          >
            {config.fields
              .filter((f) => (f.section || "default") === section.id)
              .filter((f) => {
                if (typeof f.hidden === "function") return !f.hidden(currentValues);
                return !f.hidden;
              })
              .map((field) => (
                <FormFieldRenderer key={field.name} field={field} />
              ))}
          </FormSection>
        ))}

        <div className="flex items-center justify-end gap-4 mt-8">
          <Button
            type="submit"
            disabled={isLoading}
            className="h-12 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-bold transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              config.submitLabel || "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
