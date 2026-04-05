import prisma from "@/lib/prisma";
import crypto from "crypto";

/**
 * CustomerCodeService
 * 
 * Generates unique customer codes containing the creation date, 
 * an incremental digit, and random characters.
 * Format: CUST-YYYYMMDD-[incremental]-[RANDOM]
 */
export class CustomerCodeService {
  static async generateCode(date: Date = new Date()): Promise<string> {
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    
    // Get total count for incremental sequence
    const count = await prisma.customer.count();
    const incremental = String(count + 1).padStart(4, '0');
    
    // Generate 3 random alphanumeric characters
    const randomChars = crypto.randomBytes(2).toString('hex').slice(0, 3).toUpperCase();
    
    return `CUST-${dateStr}-${incremental}-${randomChars}`;
  }
}
