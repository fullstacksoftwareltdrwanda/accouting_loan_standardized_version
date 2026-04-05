/**
 * Seed script — creates an initial Admin user with a bcrypt-hashed password.
 * Run: npx ts-node --project tsconfig.json src/scripts/seed-admin.ts
 * Or:  npx tsx src/scripts/seed-admin.ts
 */

import "dotenv/config";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";

const SEED_USERS = [
  {
    username: "admin",
    fullName: "System Administrator",
    email:    "admin@alms.local",
    password: "Admin@1234",  // Change immediately after first login
    role:     "Admin" as const,
  },
  {
    username: "director",
    fullName: "Executive Director",
    email:    "director@alms.local",
    password: "Director@1234",
    role:     "Director" as const,
  },
];

async function main() {
  console.log("🌱  Seeding admin users...\n");

  for (const u of SEED_USERS) {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ username: u.username }, { email: u.email }] },
    });

    if (existing) {
      console.log(`  ⚠️  User "${u.username}" already exists — skipping.`);
      continue;
    }

    const hashed = await bcrypt.hash(u.password, 12);
    const created = await prisma.user.create({
      data: {
        username: u.username,
        fullName: u.fullName,
        email:    u.email,
        password: hashed,
        role:     u.role,
        isActive: true,
        status:   "active",
      },
    });

    console.log(`  ✅  Created ${created.role} user: ${created.username} (id=${created.userId})`);
    console.log(`       Email:    ${created.email}`);
    console.log(`       Password: ${u.password}  ← change this immediately!\n`);
  }

  // Seed Chart of Accounts (idempotent — skips if codes already exist)
  await seedChartOfAccounts();

  console.log("✅  Seeding complete.");
}

async function seedChartOfAccounts() {
  const accounts = [
    { class: "Balance Sheet",    accountCode: "1101", accountName: "Cash on Hand",              accountType: "Asset",     normalBalance: "Debit"  },
    { class: "Balance Sheet",    accountCode: "1102", accountName: "Bank — Zenith",              accountType: "Asset",     normalBalance: "Debit"  },
    { class: "Balance Sheet",    accountCode: "1103", accountName: "Bank — GTB",                 accountType: "Asset",     normalBalance: "Debit"  },
    { class: "Balance Sheet",    accountCode: "1201", accountName: "Loans to Customers",         accountType: "Asset",     normalBalance: "Debit"  },
    { class: "Balance Sheet",    accountCode: "1203", accountName: "Interest Receivable",        accountType: "Asset",     normalBalance: "Debit"  },
    { class: "Balance Sheet",    accountCode: "1204", accountName: "Management Fee Receivable",  accountType: "Asset",     normalBalance: "Debit"  },
    { class: "Balance Sheet",    accountCode: "1206", accountName: "Penalty Receivable",         accountType: "Asset",     normalBalance: "Debit"  },
    { class: "Balance Sheet",    accountCode: "1301", accountName: "Fixed Assets",               accountType: "Asset",     normalBalance: "Debit"  },
    { class: "Balance Sheet",    accountCode: "1302", accountName: "Accumulated Depreciation",   accountType: "Asset",     normalBalance: "Credit" },
    { class: "Balance Sheet",    accountCode: "2101", accountName: "Accounts Payable",           accountType: "Liability", normalBalance: "Credit" },
    { class: "Balance Sheet",    accountCode: "2105", accountName: "VAT Payable",                accountType: "Liability", normalBalance: "Credit" },
    { class: "Balance Sheet",    accountCode: "2201", accountName: "Borrowings",                 accountType: "Liability", normalBalance: "Credit" },
    { class: "Balance Sheet",    accountCode: "3001", accountName: "Share Capital",              accountType: "Equity",    normalBalance: "Credit" },
    { class: "Balance Sheet",    accountCode: "3002", accountName: "Retained Earnings",          accountType: "Equity",    normalBalance: "Credit" },
    { class: "Income Statement", accountCode: "4101", accountName: "Interest Income",            accountType: "Revenue",   normalBalance: "Credit" },
    { class: "Income Statement", accountCode: "4201", accountName: "Management Fee Income",      accountType: "Revenue",   normalBalance: "Credit" },
    { class: "Income Statement", accountCode: "4202", accountName: "Upfront Fee Income",         accountType: "Revenue",   normalBalance: "Credit" },
    { class: "Income Statement", accountCode: "4204", accountName: "Processing Fee Income",      accountType: "Revenue",   normalBalance: "Credit" },
    { class: "Income Statement", accountCode: "4205", accountName: "Penalty Income",             accountType: "Revenue",   normalBalance: "Credit" },
    { class: "Income Statement", accountCode: "5001", accountName: "Salaries & Wages",           accountType: "Expense",   normalBalance: "Debit"  },
    { class: "Income Statement", accountCode: "5002", accountName: "Office Rent",                accountType: "Expense",   normalBalance: "Debit"  },
    { class: "Income Statement", accountCode: "5003", accountName: "Bad Debt Expense",           accountType: "Expense",   normalBalance: "Debit"  },
    { class: "Income Statement", accountCode: "5101", accountName: "Operating Expenses",         accountType: "Expense",   normalBalance: "Debit"  },
  ];

  let created = 0;
  for (const acct of accounts) {
    const exists = await prisma.chartOfAccount.findUnique({ where: { accountCode: acct.accountCode } });
    if (!exists) {
      await prisma.chartOfAccount.create({ data: acct });
      created++;
    }
  }
  console.log(`  📒  Chart of Accounts: ${created} new accounts seeded (${accounts.length - created} already existed).`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
