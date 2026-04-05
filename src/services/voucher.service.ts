import { prisma } from "@/lib/prisma";

/**
 * VoucherService
 * 
 * Generates unique, incremental voucher numbers for accounting transactions.
 * Format: VCH-YYYYMMDD-XXXX (e.g., VCH-20260406-0001)
 */
export class VoucherService {
  /**
   * Generates the next voucher number for a given date.
   * Currently uses a global sequence across the entire ledger for that day.
   */
  static async generateVoucherNumber(date: Date = new Date()): Promise<string> {
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    
    // Count existing vouchers for this specific date prefix
    const prefix = `VCH-${dateStr}-`;
    const count = await prisma.ledger.count({
      where: {
        voucherNumber: {
          startsWith: prefix
        }
      }
    });

    // Use count + 1 to generate the next sequence
    // Note: In a high-concurrency environment, you'd use a dedicated sequence table or Redis
    const sequence = String(count + 1).padStart(4, '0');
    return `${prefix}${sequence}`;
  }
}
