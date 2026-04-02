import { Asset } from "@/types/asset";
import { MOCK_ASSETS } from "@/data/mock/assets";

/**
 * Service to manage Fixed Assets.
 * Simulated async backend calls.
 */
export async function getAssets(): Promise<Asset[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...MOCK_ASSETS].sort((a, b) => 
    new Date(b.acqDate).getTime() - new Date(a.acqDate).getTime()
  );
}

export async function createAsset(data: Partial<Asset>): Promise<Asset> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  const acquisitionPrice = data.value || 0;
  const newAsset: Asset = {
    id: `ast_${Math.random().toString(36).substr(2, 9)}`,
    assetNo: data.assetNo || `FA/${new Date().getFullYear()}/000`,
    item: data.item || "New Asset",
    category: data.category || "Electronics",
    location: data.location || "Office - Kigali",
    acqDate: data.acqDate || new Date().toISOString().split('T')[0],
    value: acquisitionPrice,
    accumDep: 0,
    bookValue: acquisitionPrice + (data.additions || 0),
    condition: data.condition || "Good",
    status: "active",
    
    // New Fields
    description: data.description,
    serialNumber: data.serialNumber,
    assignedUser: data.assignedUser,
    supplier: data.supplier,
    additions: data.additions || 0,
    lifespan: data.lifespan || 4,
    depreciationRate: data.depreciationRate || 25,
    reportingDate: data.reportingDate || new Date().toISOString().split('T')[0],
  };
  
  return newAsset;
}
