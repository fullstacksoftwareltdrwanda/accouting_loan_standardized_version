"use client";

import React, { useState, useEffect } from "react";
import { 
  Package, 
  Search, 
  Plus, 
  History,
  LayoutGrid,
  ChevronRight,
  Home
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header with Breadcrumbs & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-4">
          <nav className="flex items-center gap-2 text-[13px] font-medium text-zinc-400">
            <span className="text-zinc-400 flex items-center gap-1.5 hover:text-blue-500 transition-colors cursor-pointer">
              <Home className="h-4 w-4" />
              Home
            </span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-zinc-600 font-semibold">Dashboard</span>
          </nav>
          
          <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-900/20 text-white">
                <LayoutGrid className="h-5 w-5" />
             </div>
             <h1 className="text-2xl font-black tracking-tight text-blue-600 uppercase">
                Fixed Assets Register
             </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black h-10 shadow-lg shadow-blue-500/10 active:scale-95 transition-all"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Asset
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-black h-10 shadow-lg shadow-emerald-500/10 active:scale-95 transition-all">
            <History className="mr-2 h-4 w-4" />
            Record Monthly Dep.
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <AssetStatsSection assets={assets} />

      {/* Registry Table Section */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
          <Input 
            placeholder="Search assets..." 
            className="pl-10 h-10 border-zinc-200 focus:ring-blue-500/10 focus:border-blue-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 bg-zinc-50 border-b border-zinc-100 px-4 py-2.5">
            <Package className="h-4 w-4 text-zinc-400" />
            <h3 className="text-[12px] font-bold uppercase tracking-wider text-zinc-600">Assets Register</h3>
          </div>
          <div className="p-4 bg-zinc-50/20">
            <DataTable 
                columns={columns} 
                data={assets} 
                isLoading={isLoading}
                filterColumn="item"
                filterPlaceholder="Filter by item..."
                emptyStateTitle="Empty Fixed Asset Register"
                emptyStateDescription="No assets have been registered yet. Start by adding your first asset to the company inventory."
                emptyStateAction={
                  <Button 
                    onClick={() => setIsDialogOpen(true)}
                    className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase text-[12px] tracking-widest gap-3 shadow-xl shadow-blue-500/20"
                  >
                    <Plus className="h-5 w-5" />
                    Register Your First Asset
                  </Button>
                }
            />
          </div>
        </div>
      </div>

      <AssetRegisterDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onSubmit={handleCreateAsset} 
      />
    </div>
  );
};
