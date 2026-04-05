"use client";

import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Save, X } from "lucide-react";
import { Asset } from "@/types/asset";

interface AssetRegisterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Asset>) => Promise<void>;
}

export const AssetRegisterDialog = ({ isOpen, onClose, onSubmit }: AssetRegisterDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    itemName: "",
    category: "Electronics",
    description: "",
    serialNumber: "",
    location: "Main Office - Kigali",
    assignedUser: "",
    supplier: "",
    acquisitionDate: "",
    acquisitionValue: "0",
    additions: "0",
    condition: "Good",
    lifespanYears: "4",
    depreciationRate: "25",
    assetType: "Fixed",
    depreciationMethod: "StraightLine",
    usefulLifeMonths: "48",
    reportingDate: new Date().toISOString().split('T')[0],
  });

  const categories = ["Electronics", "Furniture", "Vehicles", "Machinery", "Buildings", "Equipment", "Intangibles"];
  const locations = ["Main Office - Kigali", "Kigali Hub", "Logistics Center", "Warehouse A", "HQ - Boardroom"];
  const conditions = ["Excellent", "Good", "Fair", "Poor", "Needs Repair"];
  const assetTypes = ["Fixed", "Current", "Intangible", "Investment"];
  const depreciationMethods = ["StraightLine", "ReducingBalance", "DoubleDeclining", "None"];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        acquisitionValue: parseFloat(formData.acquisitionValue) || 0,
        additions: parseFloat(formData.additions) || 0,
        lifespanYears: parseInt(formData.lifespanYears) || 4,
        depreciationRate: parseFloat(formData.depreciationRate) || 25,
        usefulLifeMonths: parseInt(formData.usefulLifeMonths) || 48,
        acquisitionDate: formData.acquisitionDate,
        reportingDate: formData.reportingDate,
      };

      await onSubmit(payload as any);
      onClose();
    } catch (error) {
      console.error("Failed to save asset", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden border-none rounded-xl">
        {/* Styled Header */}
        <div className="bg-blue-600 px-6 py-4 flex items-center justify-between text-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-black tracking-tight">Add New Asset</DialogTitle>
          </DialogHeader>
          <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[85vh]">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Row 1 */}
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Item Name <span className="text-red-500">*</span></Label>
              <Input 
                value={formData.itemName}
                onChange={(e) => handleInputChange("itemName", e.target.value)}
                placeholder="Enter item name..."
                required
                className="h-10 border-zinc-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Category <span className="text-red-500">*</span></Label>
              <Select onValueChange={(val) => handleInputChange("category", val)} required>
                <SelectTrigger className="h-10 border-zinc-200">
                  <SelectValue placeholder="-- Select Category --" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4}>
                  {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Row 2 - Full Width Textarea */}
            <div className="md:col-span-2 space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Description</Label>
              <Textarea 
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter additional description..."
                className="min-h-[80px] border-zinc-200 resize-none"
              />
            </div>

            {/* Row 3 */}
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Serial Number</Label>
              <Input 
                value={formData.serialNumber}
                onChange={(e) => handleInputChange("serialNumber", e.target.value)}
                placeholder="Item serial number..."
                className="h-10 border-zinc-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Location <span className="text-red-500">*</span></Label>
              <Select onValueChange={(val) => handleInputChange("location", val)} required>
                <SelectTrigger className="h-10 border-zinc-200">
                  <SelectValue placeholder="-- Select Location --" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4}>
                  {locations.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Row 4 */}
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Assigned User</Label>
              <Input 
                value={formData.assignedUser}
                onChange={(e) => handleInputChange("assignedUser", e.target.value)}
                placeholder="Name of user..."
                className="h-10 border-zinc-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Supplier</Label>
              <Input 
                value={formData.supplier}
                onChange={(e) => handleInputChange("supplier", e.target.value)}
                placeholder="Supplier name..."
                className="h-10 border-zinc-200"
              />
            </div>

            {/* Row 5 */}
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Acquisition Date <span className="text-red-500">*</span></Label>
              <Input 
                type="date"
                value={formData.acquisitionDate}
                onChange={(e) => handleInputChange("acquisitionDate", e.target.value)}
                required
                className="h-10 border-zinc-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Acquisition Value <span className="text-red-500">*</span></Label>
              <Input 
                type="number"
                value={formData.acquisitionValue}
                onChange={(e) => handleInputChange("acquisitionValue", e.target.value)}
                required
                className="h-10 border-zinc-200 font-bold"
              />
            </div>

            {/* Row 6 */}
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Additions</Label>
              <Input 
                type="number"
                value={formData.additions}
                onChange={(e) => handleInputChange("additions", e.target.value)}
                className="h-10 border-zinc-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Condition <span className="text-red-500">*</span></Label>
              <Select value={formData.condition} onValueChange={(val) => handleInputChange("condition", val)}>
                <SelectTrigger className="h-10 border-zinc-200">
                  <SelectValue placeholder="Good" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4}>
                  {conditions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Row 7 - New Metadata */}
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Asset Type <span className="text-red-500">*</span></Label>
              <Select value={formData.assetType} onValueChange={(val) => handleInputChange("assetType", val)}>
                <SelectTrigger className="h-10 border-zinc-200">
                  <SelectValue placeholder="Fixed" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4}>
                  {assetTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Depreciation Method <span className="text-red-500">*</span></Label>
              <Select value={formData.depreciationMethod} onValueChange={(val) => handleInputChange("depreciationMethod", val)}>
                <SelectTrigger className="h-10 border-zinc-200">
                  <SelectValue placeholder="StraightLine" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4}>
                  {depreciationMethods.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Row 8 */}
            <div className="grid grid-cols-4 md:col-span-2 gap-4">
               <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Lifespan (Yrs) <span className="text-red-500">*</span></Label>
                    <Input 
                        type="number"
                        value={formData.lifespanYears}
                        onChange={(e) => handleInputChange("lifespanYears", e.target.value)}
                        className="h-10 border-zinc-200"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Useful Life (Mos)</Label>
                    <Input 
                        type="number"
                        value={formData.usefulLifeMonths}
                        onChange={(e) => handleInputChange("usefulLifeMonths", e.target.value)}
                        className="h-10 border-zinc-200"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Rate (%) <span className="text-red-500">*</span></Label>
                    <Input 
                        type="number"
                        value={formData.depreciationRate}
                        onChange={(e) => handleInputChange("depreciationRate", e.target.value)}
                        className="h-10 border-zinc-200"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Reporting Date</Label>
                    <Input 
                        type="date"
                        value={formData.reportingDate}
                        onChange={(e) => handleInputChange("reportingDate", e.target.value)}
                        className="h-10 border-zinc-200"
                    />
                </div>
            </div>
          </div>

          </div>
          <DialogFooter className="p-6 pt-4 border-t border-zinc-100 gap-3 bg-zinc-50/30">
            <Button 
                type="button" 
                variant="secondary" 
                onClick={onClose}
                className="bg-zinc-500 hover:bg-zinc-600 text-white font-black"
            >
              Cancel
            </Button>
            <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-500/20"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Asset
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
