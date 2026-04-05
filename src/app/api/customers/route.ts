import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthedRequest } from "@/lib/auth-middleware";
import { successResponse, createdResponse, validationError, notFound, buildPaginationMeta } from "@/lib/api-response";
import { hashPassword } from "@/lib/password";
import { CustomerCodeService } from "@/services/customer-code.service";

// GET /api/customers — paginated list with filters
export const GET = withAuth(async (req: AuthedRequest) => {
  const { searchParams } = new URL(req.url);
  const search  = searchParams.get("search") ?? undefined;
  const status  = searchParams.get("status") ?? undefined;
  const page    = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const perPage = Math.min(100, parseInt(searchParams.get("perPage") ?? "25"));
  const sortBy  = (searchParams.get("sortBy") ?? "createdAt") as string;
  const sortDir = (searchParams.get("sortDir") ?? "desc") as "asc" | "desc";

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { customerName:  { contains: search, mode: "insensitive" } },
      { email:         { contains: search, mode: "insensitive" } },
      { phone:         { contains: search, mode: "insensitive" } },
      { customerCode:  { contains: search, mode: "insensitive" } },
    ];
  }
  if (searchParams.get("hasActiveLoans") === "true") {
    where.loans = { some: { loanStatus: "Active" } };
  }

  const [total, customers] = await Promise.all([
    prisma.customer.count({ where }),
    prisma.customer.findMany({
      where,
      skip:    (page - 1) * perPage,
      take:    perPage,
      orderBy: { [sortBy]: sortDir },
      include: { loans: { select: { loanStatus: true, totalOutstanding: true } } },
    }),
  ]);

  const mapped = customers.map((c) => ({
    id:             String(c.customerId),
    customerNumber: c.customerCode,
    firstName:      c.customerName.split(" ")[0] ?? c.customerName,
    lastName:       c.customerName.split(" ").slice(1).join(" ") || "",
    fullName:       c.customerName,
    phone:          c.phone,
    email:          c.email,
    gender:         c.gender,
    dateOfBirth:    c.dateOfBirth?.toISOString() ?? null,
    address:        c.address,
    idNumber:       c.idNumber,
    accountNumber:  c.accountNumber,
    occupation:     c.occupation,
    province:       c.province,
    status:         c.status,
    riskScore:      c.riskRating ? parseInt(c.riskRating) : null,
    totalLoans:     c.loans.length,
    activeLoans:    c.loans.filter((l) => l.loanStatus === "Active").length,
    totalDisbursed: Number(c.totalDisbursed),
    totalOutstanding: Number(c.totalOutstanding),
    createdAt:      c.createdAt.toISOString(),
    updatedAt:      c.updatedAt.toISOString(),
  }));

  return successResponse(
    { customers: mapped },
    buildPaginationMeta(total, page, perPage)
  );
}) as unknown as (req: NextRequest) => Promise<Response>;

// POST /api/customers — create new customer
export const POST = withAuth(async (req: AuthedRequest) => {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return validationError([{ field: "body", issue: "Invalid JSON" }]); }

  const errs: { field: string; issue: string }[] = [];

  // ID Number: all digits, length 16
  const idNumberRaw = String(body.idNumber).trim();
  if (!/^\d{16}$/.test(idNumberRaw)) {
    errs.push({ field: "idNumber", issue: "ID Number must be exactly 16 digits" });
  }

  // Phone validation: Rwandan format, omit +250
  // Usually starts with 07... (total 10 digits)
  const phoneRaw = String(body.phone).trim().replace("+250", "");
  if (!/^07\d{8}$/.test(phoneRaw)) {
    errs.push({ field: "phone", issue: "Phone number must be a valid Rwandan number (e.g., 078XXXXXXX)" });
  }

  if (errs.length) return validationError(errs);

  // Build a sequential customer code
  const customerCode = await CustomerCodeService.generateCode();

  const customerName = body.customerName
    ? String(body.customerName)
    : `${body.firstName ?? ""} ${body.middleName ?? ""} ${body.lastName ?? ""}`.trim();

  const customer = await prisma.customer.create({
    data: {
      customerCode,
      customerName,
      phone:            phoneRaw, // Use cleaned phone
      email:            body.email ? String(body.email) : undefined,
      idNumber:         idNumberRaw, // Use cleaned ID
      gender:           (body.gender as any) ?? "Male",
      dateOfBirth:      body.dateOfBirth ? new Date(String(body.dateOfBirth)) : undefined,
      birthPlace:       body.birthPlace ? String(body.birthPlace) : undefined,
      address:          body.address ? String(body.address) : undefined,
      location:         body.location ? String(body.location) : undefined,
      province:         body.province ? String(body.province) : undefined,
      occupation:       body.occupation ? String(body.occupation) : undefined,
      accountNumber:    body.accountNumber ? String(body.accountNumber) : undefined,
      organization:     body.organization ? String(body.organization) : "gracelending",
      fatherName:       body.fatherName ? String(body.fatherName) : undefined,
      motherName:       body.motherName ? String(body.motherName) : undefined,
      marriageType:     (body.marriageType as any) ?? "Single",
      spouse:           body.spouse ? String(body.spouse) : undefined,
      spouseId:         body.spouseId ? String(body.spouseId) : undefined,
      spouseOccupation: body.spouseOccupation ? String(body.spouseOccupation) : undefined,
      spousePhone:      body.spousePhone ? String(body.spousePhone) : undefined,
      project:          body.project ? String(body.project) : undefined,
      projectLocation:  body.projectLocation ? String(body.projectLocation) : undefined,
      cautionLocation:  body.cautionLocation ? String(body.cautionLocation) : undefined,
      hasGuarantor:     body.hasGuarantor ? "Yes" : "No",
      guarantorName:    body.guarantorName ? String(body.guarantorName) : undefined,
      guarantorId:      body.guarantorId ? String(body.guarantorId) : undefined,
      guarantorPhone:   body.guarantorPhone ? String(body.guarantorPhone) : undefined,
      guarantorOccupation: body.guarantorOccupation ? String(body.guarantorOccupation) : undefined,
      createdBy:        req.user.sub,
      status:           "Active",
    },
  });

  await prisma.activityLog.create({
    data: {
      userId:     parseInt(req.user.sub),
      username:   req.user.sub,
      actionType: "CREATE",
      entityType: "customer",
      entityId:   customer.customerId,
      description: `Customer ${customerCode} created`,
    },
  });

  return createdResponse({ customer: formatCustomer(customer) });
}, ["Director", "MD", "Accountant", "Secretary", "Developer", "Admin"]) as unknown as (req: NextRequest) => Promise<Response>;

function formatCustomer(c: any) {
  return {
    id:               String(c.customerId),
    customerNumber:   c.customerCode,
    fullName:         c.customerName,
    phone:            c.phone,
    email:            c.email,
    gender:           c.gender,
    dateOfBirth:      c.dateOfBirth?.toISOString() ?? null,
    birthPlace:       c.birthPlace,
    address:          c.address,
    location:         c.location,
    province:         c.province,
    idNumber:         c.idNumber,
    accountNumber:    c.accountNumber,
    occupation:       c.occupation,
    organization:     c.organization,
    fatherName:       c.fatherName,
    motherName:       c.motherName,
    marriageType:     c.marriageType,
    spouse:           c.spouse,
    spouseId:         c.spouseId,
    spouseOccupation: c.spouseOccupation,
    spousePhone:      c.spousePhone,
    project:          c.project,
    projectLocation:  c.projectLocation,
    cautionLocation:  c.cautionLocation,
    guarantorName:    c.guarantorName,
    guarantorId:      c.guarantorId,
    guarantorPhone:   c.guarantorPhone,
    guarantorOccupation: c.guarantorOccupation,
    status:           c.status,
    createdAt:        c.createdAt?.toISOString(),
    updatedAt:        c.updatedAt?.toISOString(),
  };
}
