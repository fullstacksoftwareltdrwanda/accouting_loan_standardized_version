"use client";

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FormFieldConfig } from "@/types/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form-layout";
import { cn } from "@/lib/utils";

interface FormFieldRendererProps {
  field: FormFieldConfig;
}

export function FormFieldRenderer({ field }: FormFieldRendererProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[field.name];
  const errorMessage = error?.message as string | undefined;

  const renderInput = () => {
    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            {...register(field.name)}
            placeholder={field.placeholder}
            disabled={field.disabled}
          />
        );

      case "select":
        return (
          <Controller
            control={control}
            name={field.name}
            render={({ field: { onChange, value } }) => (
              <Select onValueChange={onChange} value={value} disabled={field.disabled}>
                <SelectTrigger className="rounded-2xl">
                  <SelectValue placeholder={field.placeholder || "Select option"} />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {field.options?.map((option) => (
                    <SelectItem key={option.value} value={String(option.value)}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        );

      case "switch":
        return (
          <Controller
            control={control}
            name={field.name}
            render={({ field: { onChange, value } }) => (
              <div className="flex items-center space-x-2 py-2">
                <Switch
                  checked={value}
                  onCheckedChange={onChange}
                  disabled={field.disabled}
                />
                <span className="text-sm font-medium text-zinc-500">
                  {value ? "Enabled" : "Disabled"}
                </span>
              </div>
            )}
          />
        );

      case "checkbox":
        return (
          <Controller
            control={control}
            name={field.name}
            render={({ field: { onChange, value } }) => (
              <div className="flex items-center space-x-2 py-2">
                <Checkbox
                  checked={value}
                  onCheckedChange={onChange}
                  disabled={field.disabled}
                />
                <span className="text-sm font-medium text-zinc-600">
                  Confirm selection
                </span>
              </div>
            )}
          />
        );

      case "date":
        return (
          <Input
            type="date"
            {...register(field.name)}
            disabled={field.disabled}
            className="rounded-2xl"
          />
        );

      case "number":
      case "currency":
        return (
          <div className="relative">
            {field.type === "currency" && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">$</span>
            )}
            <Input
              type="number"
              {...register(field.name, { valueAsNumber: true })}
              placeholder={field.placeholder}
              disabled={field.disabled}
              className={cn("rounded-2xl", field.type === "currency" && "pl-7")}
            />
          </div>
        );

      default:
        return (
          <Input
            type={field.type}
            {...register(field.name)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            className="rounded-2xl"
          />
        );
    }
  };

  return (
    <FormItem className={cn(
      field.width === "full" ? "md:col-span-6" : 
      field.width === "half" ? "md:col-span-3" : 
      field.width === "third" ? "md:col-span-2" : 
      "md:col-span-3"
    )}>
      <FormLabel error={!!error}>{field.label}</FormLabel>
      {renderInput()}
      {field.description && <FormDescription>{field.description}</FormDescription>}
      <FormMessage>{errorMessage}</FormMessage>
    </FormItem>
  );
}
