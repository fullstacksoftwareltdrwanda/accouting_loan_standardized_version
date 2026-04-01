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
    <div className="space-y-8 max-w-7xl">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
            Customers & Borrowers
          </h2>
          <p className="text-zinc-500 font-sans dark:text-zinc-400">
            Manage KYC, contact details, and financial summaries for all loan applicants.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-12 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black shadow-md transition-all active:scale-95">
              <UserPlus className="mr-2 h-5 w-5" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">Onboard New Borrower</DialogTitle>
              <DialogDescription>
                Initial KYC and profile setup. All fields can be updated later in the profile view.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
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
      <div className="bg-white p-6 rounded-[32px] border border-zinc-200 shadow-sm dark:bg-zinc-950/40 dark:border-zinc-800">
        <DataTable 
          columns={columns} 
          data={customers} 
          isLoading={isLoading} 
          filterColumn="firstName"
          filterPlaceholder="Search borrowers by name..."
        />
      </div>
    </div>
  );
}
