/**
 * Asset Service — real API implementation.
 * Replaces src/services/mock/asset.service.ts
 */
import { api } from "@/lib/api-client";
import { Asset, AssetStats } from "@/types/asset";

function mapToAsset(a: any): Asset {
  return {
    id: String(a.id),
    assetNo: a.assetNumber || `AST-${a.id.padStart(4, '0')}`,
    item: a.item,
    category: a.category,
    location: a.location || "Main Office",
    acqDate: a.acquisitionDate,
    value: Number(a.acquisitionValue),
    accumDep: Number(a.accumulatedDepreciation || 0),
    bookValue: Number(a.currentValue || a.acquisitionValue),
    condition: a.condition || "Good",
    status: (a.status?.toLowerCase() || "active") as any,
    serialNumber: a.serialNumber,
    description: a.description || "",
    lifespan: Number(a.lifespanYears || 5),
    depreciationRate: Number(a.depreciationRate || 20),
    reportingDate: a.createdAt?.split("T")[0] || new Date().toISOString().split("T")[0],
    additions: 0
  };
}

export async function getAssets(filters?: Record<string, unknown>): Promise<{ assets: Asset[]; stats: AssetStats }> {
  const qs = filters ? "?" + new URLSearchParams(filters as Record<string, string>).toString() : "";
  const result = await api.get<{ assets: any[]; stats: any }>(`/api/assets${qs}`);
  if (!result.success) throw new Error(result.error?.message ?? "Failed to fetch assets");
  
  return {
    assets: result.data!.assets.map(mapToAsset),
    stats: {
      totalAssets: result.data!.stats.totalAssets || 0,
      activeAssets: result.data!.stats.totalAssets || 0,
      disposedAssets: 0,
      totalAcquisitionValue: Number(result.data!.stats.totalAcquisition || 0),
      currentBookValue: Number(result.data!.stats.totalCurrentValue || 0),
      accumulatedDepreciation: Number(result.data!.stats.totalAccumDep || 0),
    }
  };
}

export async function createAsset(data: Record<string, unknown>): Promise<Asset> {
  const result = await api.post<{ asset: any }>("/api/assets", data);
  if (!result.success) throw new Error(result.error?.message ?? "Failed to create asset");
  return mapToAsset(result.data!.asset);
}

export async function depreciateAsset(id: string) {
  const result = await api.post<any>(`/api/assets/${id}/depreciate`, {});
  if (!result.success) throw new Error(result.error?.message ?? "Depreciation failed");
  return result.data;
}
