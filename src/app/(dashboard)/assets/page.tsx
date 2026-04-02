import React from "react";
import { AssetList } from "@/components/assets/asset-list";

export const metadata = {
  title: "Fixed Asset Register | ALMS",
  description: "Track and manage capital investments and equipment depreciation.",
};

export default function AssetsPage() {
  return (
    <div className="flex flex-col space-y-8 p-6 md:p-8">
      <AssetList />
    </div>
  );
}
