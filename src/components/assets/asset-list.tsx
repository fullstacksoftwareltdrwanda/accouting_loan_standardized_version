"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/table/data-table";
import { Asset } from "@/types/asset";
import { AssetStatsSection } from "./asset-stats";
import { assetColumns, getAssetActions } from "./asset-columns";
import { getAssets, createAsset } from "@/services/mock/asset.service";
import { AssetRegisterDialog } from "./asset-register-dialog";

export const AssetList = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadAssets = async () => {
    setIsLoading(true);
    try {
      const data = await getAssets();
      setAssets(data);
    } catch (error) {
      console.error("Failed to load assets", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleCreateAsset = async (data: Partial<Asset>) => {
    try {
      const newAsset = await createAsset(data);
      setAssets(prev => [newAsset, ...prev]);
    } catch (error) {
      console.error("Creation failed", error);
    }
  };

  const actions = getAssetActions(
    (asset) => console.log("Edit", asset),
    (asset) => console.log("Depreciate", asset)
  );
  
  const columns = assetColumns(actions);

  return (
    <div className="space-y-8 animate-float-in">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            Fixed Assets Register
          </h1>
          <p className="text-[13px] text-[var(--text-tertiary)]">
            Track company assets, depreciation, and current valuations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="h-10 px-5 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white rounded-xl font-medium text-[13px] gap-2 shadow-sm transition-all active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Add Asset
          </Button>
          <Button variant="outline" className="h-10 px-4 rounded-xl font-medium text-[13px] gap-2 border-[var(--border-default)] text-[var(--text-secondary)] transition-all active:scale-[0.98]">
            <History className="h-4 w-4" />
            Record Depreciation
          </Button>
        </div>
      </div>

      {/* Stats */}
      <AssetStatsSection assets={assets} />

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[var(--border-subtle)] shadow-[var(--shadow-xs)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">Asset Registry</h3>
          <span className="text-[12px] font-medium text-[var(--text-tertiary)] bg-[var(--bg-sunken)] px-3 py-1 rounded-lg">
            {assets.length} assets
          </span>
        </div>
        <DataTable 
          columns={columns} 
          data={assets} 
          isLoading={isLoading}
          filterColumn="item"
          filterPlaceholder="Search assets..."
          emptyStateTitle="Empty Asset Register"
          emptyStateDescription="No assets registered yet. Add your first asset to begin tracking."
          emptyStateAction={
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="h-10 px-6 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white rounded-xl font-medium text-[13px] gap-2 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Register First Asset
            </Button>
          }
        />
      </div>

      <AssetRegisterDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onSubmit={handleCreateAsset} 
      />
    </div>
  );
};
