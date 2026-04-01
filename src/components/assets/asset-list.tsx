"use client";

import React, { useState, useEffect } from "react";
import { Plus, Building2 } from "lucide-react";
import { Asset } from "@/types/expense";
import { getAssets, createAsset } from "@/services/mock/asset.service";
import { DataTable } from "@/components/table/data-table";
import { assetColumns, getAssetActions } from "./asset-columns";
import { DynamicForm } from "@/components/forms/dynamic-form";
import { ACQUIRE_ASSET_FORM_CONFIG } from "@/config/forms/asset-form.config";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function AssetList() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load assets
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAssets();
        setAssets(data);
      } catch (error) {
        console.error("Failed to load assets", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Handlers
  const handleAcquireAsset = async (data: any) => {
    setIsSubmitting(true);
    try {
      const newAsset = await createAsset(data);
      setAssets((prev) => [newAsset, ...prev]);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Acquisition failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const actions = getAssetActions(
    (ast) => console.log("Edit", ast),
    (ast) => console.log("Deactivate", ast)
  );

  const columns = assetColumns(actions);

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
            Fixed Asset Register
          </h2>
          <p className="text-zinc-500 font-sans dark:text-zinc-400">
            Track business assets, equipment valuation, and annual depreciation.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-12 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black shadow-md transition-all active:scale-95">
              <Plus className="mr-2 h-5 w-5" />
              Add Asset
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">Register New Fixed Asset</DialogTitle>
              <DialogDescription>
                Define the purchase price and depreciation rate for automated bookkeeping.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <DynamicForm 
                config={ACQUIRE_ASSET_FORM_CONFIG} 
                onSubmit={handleAcquireAsset} 
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
          data={assets} 
          isLoading={isLoading} 
          filterColumn="name"
          filterPlaceholder="Search assets by name or tag..."
        />
      </div>
    </div>
  );
}
