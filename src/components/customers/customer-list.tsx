"use client";

import React, { useState, useEffect } from "react";
import { Plus, UserPlus } from "lucide-react";
import { Customer } from "@/types/customer";
import { getCustomers, createCustomer } from "@/services/mock/customer.service";
import { DataTable } from "@/components/table/data-table";
import { customerColumns, getCustomerActions } from "./customer-columns";
import { DynamicForm } from "@/components/forms/dynamic-form";
import { NEW_CUSTOMER_FORM_CONFIG } from "@/config/forms/customer-form.config";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Hide the firstName column (used only for filtering) from the column toggle
  const initialColumnVisibility = { firstName: false };

  // Load customers
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getCustomers();
        setCustomers(data);
      } catch (error) {
        console.error("Failed to load customers", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Handlers
  const handleOnboardCustomer = async (data: any) => {
    setIsSubmitting(true);
    try {
      const newCust = await createCustomer(data);
      setCustomers((prev) => [newCust, ...prev]);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Onboarding failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const actions = getCustomerActions(
    (cust) => console.log("View", cust),
    (cust) => console.log("Edit", cust)
  );

  const columns = customerColumns(actions);

  return (
    <div className="space-y-5 max-w-[1440px]">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h2 className="text-xl font-bold tracking-tight text-zinc-800">
            Customers &amp; Borrowers
          </h2>
          <p className="text-[12px] text-zinc-400">
            Manage KYC, contact details, and financial summaries for all loan applicants.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-9 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-semibold shadow-sm text-[13px]">
              <UserPlus className="mr-1.5 h-4 w-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Onboard New Borrower</DialogTitle>
              <DialogDescription className="text-[12px] text-zinc-400">
                Initial KYC and profile setup. All fields can be updated later in the profile view.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <DynamicForm 
                config={NEW_CUSTOMER_FORM_CONFIG} 
                onSubmit={handleOnboardCustomer} 
                isLoading={isSubmitting} 
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table Area */}
      <div className="bg-white p-4 rounded-xl border border-zinc-100 shadow-sm">
        <DataTable 
          columns={columns} 
          data={customers} 
          isLoading={isLoading} 
          filterColumn="firstName"
          filterPlaceholder="Search by name or email..."
          initialColumnVisibility={initialColumnVisibility}
        />
      </div>
    </div>
  );
}
