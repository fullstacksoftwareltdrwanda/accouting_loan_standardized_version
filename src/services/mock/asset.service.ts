import { Asset } from "@/types/asset";
import { MOCK_ASSETS } from "@/data/mock/assets";

/**
 * ASSET SERVICE: Production-ready backend skeleton.
 */

export async function getAssets(): Promise<Asset[]> {
  // TODO: Replace with backend API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...MOCK_ASSETS];
}

export async function createAsset(data: Partial<Asset>): Promise<Asset> {
  // TODO: POST to backend
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { ...data, id: Math.random().toString(36).substr(2, 9) } as Asset;
}

export async function updateAsset(id: string, data: Partial<Asset>): Promise<Asset> {
  // TODO: PATCH to backend
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { id, ...data } as Asset;
}

export async function deleteAsset(id: string): Promise<boolean> {
  // TODO: DELETE from backend
  await new Promise((resolve) => setTimeout(resolve, 500));
  return true;
}
