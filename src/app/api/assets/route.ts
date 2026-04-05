import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, createdResponse, validationError, buildPaginationMeta } from "@/lib/api-response";

function formatAsset(a: Record<string, unknown>) {
  return {
    id:             String(a.assetId),
    assetNumber:    a.assetNumber,
    item:           a.itemName,
    category:       a.category,
    description:    a.description,
    serialNumber:   a.serialNumber,
    location:       a.location,
    assignedUser:   a.assignedUser,
    acquisitionDate: a.acquisitionDate instanceof Date ? a.acquisitionDate.toISOString().split("T")[0] : a.acquisitionDate,
    acquisitionValue: Number(a.acquisitionValue),
    supplier:       a.supplier,
    lifespanYears:  a.lifespanYears,
    depreciationRate: Number(a.depreciationRate),
    condition:      a.condition,
    accumulatedDepreciation: Number(a.accumulatedDepreciation ?? 0),
    currentValue:   Number(a.currentValue ?? 0),
    status:         a.status,
    assetType:      a.assetType,
    createdAt:      a.createdAt instanceof Date ? a.createdAt.toISOString() : a.createdAt,
  };
}

// GET /api/assets
export const GET = withAuth(async (req: AuthedRequest) => {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") ?? undefined;
  const status   = searchParams.get("status")   ?? undefined;
  const page     = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const perPage  = 25;

  const where: Record<string, unknown> = {};
  if (category) where.category = category;
  if (status)   where.status   = status;

  const [total, assets] = await Promise.all([
    prisma.asset.count({ where }),
    prisma.asset.findMany({ where, skip: (page - 1) * perPage, take: perPage, orderBy: { acquisitionDate: "desc" } }),
  ]);

  // Summary stats
  const agg = await prisma.asset.aggregate({
    _count: { assetId: true },
    _sum:   { acquisitionValue: true, currentValue: true, accumulatedDepreciation: true },
  });

  return successResponse(
    {
      assets: assets.map(formatAsset),
      stats: {
        totalAssets:       agg._count.assetId,
        totalAcquisition:  Number(agg._sum.acquisitionValue ?? 0),
        totalCurrentValue: Number(agg._sum.currentValue ?? 0),
        totalAccumDep:     Number(agg._sum.accumulatedDepreciation ?? 0),
      },
    },
    buildPaginationMeta(total, page, perPage)
  );
}) as unknown as (req: NextRequest) => Promise<Response>;

// POST /api/assets
export const POST = withAuth(async (req: AuthedRequest) => {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return validationError([{ field: "body", issue: "Invalid JSON" }]); }

  const errs: { field: string; issue: string }[] = [];
  if (!body.itemName)         errs.push({ field: "itemName",         issue: "Required" });
  if (!body.category)         errs.push({ field: "category",         issue: "Required" });
  if (!body.acquisitionDate)  errs.push({ field: "acquisitionDate",  issue: "Required" });
  if (body.acquisitionValue === undefined) errs.push({ field: "acquisitionValue", issue: "Required" });
  if (!body.lifespanYears)    errs.push({ field: "lifespanYears",    issue: "Required" });
  if (body.depreciationRate === undefined) errs.push({ field: "depreciationRate", issue: "Required" });
  if (errs.length) return validationError(errs);

  const count = await prisma.asset.count();
  const assetNumber = `AST-${String(count + 1).padStart(5, "0")}`;
  const acquisitionValue = Number(body.acquisitionValue);
  const lifespanYears    = parseInt(String(body.lifespanYears));
  const depreciationRate = Number(body.depreciationRate);
  const monthlyDep       = (acquisitionValue * (depreciationRate / 100)) / 12;
  const dailyDep         = monthlyDep / 30;

  const asset = await prisma.asset.create({
    data: {
      assetNumber,
      itemName:       String(body.itemName),
      category:       String(body.category),
      description:    body.description  ? String(body.description)  : undefined,
      serialNumber:   body.serialNumber ? String(body.serialNumber) : undefined,
      location:       body.location     ? String(body.location)     : undefined,
      assignedUser:   body.assignedUser ? String(body.assignedUser) : undefined,
      supplier:       body.supplier     ? String(body.supplier)     : undefined,
      acquisitionDate: new Date(String(body.acquisitionDate)),
      acquisitionValue,
      lifespanYears,
      depreciationRate,
      monthlyDepreciation: monthlyDep,
      dailyDepreciation:   dailyDep,
      currentValue:    acquisitionValue,
      condition:       body.condition ? String(body.condition) : undefined,
      status:          "Active",
    },
  });

  return createdResponse({ asset: formatAsset(asset as unknown as Record<string, unknown>) });
}, ["Director", "MD", "Accountant", "Developer", "Admin"]) as unknown as (req: NextRequest) => Promise<Response>;
