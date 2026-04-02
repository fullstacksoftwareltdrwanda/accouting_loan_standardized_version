export type AssetStatus = "active" | "disposed";
export type AssetCondition = "Excellent" | "Good" | "Fair" | "Poor" | "Needs Repair";

export interface Asset {
  id: string;
  assetNo: string;
  item: string;
  category: string;
  location: string;
  acqDate: string;
  value: number;
  accumDep: number;
  bookValue: number;
  condition: AssetCondition;
  status: AssetStatus;
  
  // New Fields from the Add Asset Form
  description?: string;
  serialNumber?: string;
  assignedUser?: string;
  supplier?: string;
  additions: number;
  lifespan: number;
  depreciationRate: number;
  reportingDate: string;
}

export interface AssetStats {
  totalAssets: number;
  activeAssets: number;
  disposedAssets: number;
  totalAcquisitionValue: number;
  currentBookValue: number;
  accumulatedDepreciation: number;
}
