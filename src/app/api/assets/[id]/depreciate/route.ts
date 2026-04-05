import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, notFound } from "@/lib/api-response";

type Ctx = { params: Promise<{ id: string }> };

// POST /api/assets/[id]/depreciate — run depreciation for a given asset
export const POST = withAuth(async (_req: AuthedRequest, ctx: { params: Record<string, string> }) => {
  const assetId = parseInt(ctx.params.id);
  const asset = await prisma.asset.findUnique({ where: { assetId } });
  if (!asset) return notFound("asset");
  if (asset.status !== "Active") return successResponse({ message: "Asset is not active." });

  const monthlyDep = Number(asset.monthlyDepreciation ?? 0);
  if (monthlyDep <= 0) return successResponse({ message: "No monthly depreciation configured." });

  const newAccumDep   = Number(asset.accumulatedDepreciation ?? 0) + monthlyDep;
  const newCurrentVal = Math.max(0, Number(asset.acquisitionValue) - newAccumDep);

  const updated = await prisma.asset.update({
    where: { assetId },
    data: {
      accumulatedDepreciation: newAccumDep,
      currentValue:            newCurrentVal,
      reportingDate:           new Date(),
      status:                  newCurrentVal <= 0 ? "FullyDepreciated" : "Active",
    },
  });

  return successResponse({
    assetId:             String(updated.assetId),
    depreciationApplied: monthlyDep,
    accumulatedDepreciation: newAccumDep,
    currentValue:        newCurrentVal,
  });
}, ["Director", "MD", "Accountant", "Developer", "Admin"]) as unknown as (req: NextRequest, ctx: Ctx) => Promise<Response>;
