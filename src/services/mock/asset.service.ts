import { Asset } from "@/types/expense";
import { MOCK_ASSETS } from "@/data/mock/assets";

/**
 * Service to manage Fixed Assets.
 * Simulated async backend calls.
 */
export async function getAssets(): Promise<Asset[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...MOCK_ASSETS].sort((a, b) => 
    new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
  );
}

export async function createAsset(data: Partial<Asset>): Promise<Asset> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  const purchasePrice = data.value || 0;
  const newAsset: Asset = {
    id: `ast_${Math.random().toString(36).substr(2, 9)}`,
    name: data.name || "New Asset",
    category: data.category || "Electronics",
    serialNumber: data.serialNumber,
    purchaseDate: data.purchaseDate || new Date().toISOString().split('T')[0],
    value: purchasePrice,
    depreciationRate: data.depreciationRate || 15,
    currentValue: purchasePrice, // Initial current value is purchase price
    status: "active",
  };
  
  return newAsset;
}
