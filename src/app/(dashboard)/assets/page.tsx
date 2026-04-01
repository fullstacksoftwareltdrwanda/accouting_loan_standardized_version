import React from "react";
import { AssetList } from "@/components/assets/asset-list";

export const metadata = {
  title: "Fixed Asset Register | ALMS",
  description: "Track and manage capital investments and equipment depreciation.",
};

export default function AssetsPage() {
  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-700">
      <AssetList />
    </div>
  );
}
