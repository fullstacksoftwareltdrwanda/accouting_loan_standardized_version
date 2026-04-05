"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  Edit, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  Activity, 
  History,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { getCustomerById, getCustomerLoans } from "@/services/customer.service";
import { Customer } from "@/types/customer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

export default function CustomerDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loans, setLoans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (typeof id !== "string") return;
      try {
        setIsLoading(true);
        const data = await getCustomerById(id);
        setCustomer(data);
        
        const customerLoans = await getCustomerLoans(id);
        setLoans(customerLoans);
      } catch (err: any) {
        console.error("Failed to load customer details", err);
        setError(err.message || "Member not found.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-20 text-center space-y-4 animate-pulse">
        <div className="h-12 w-12 bg-zinc-200 rounded-full mx-auto" />
        <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Loading Member Profile...</p>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="p-20 text-center space-y-6">
        <div className="h-16 w-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="h-8 w-8 text-rose-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-zinc-900 uppercase">Member Not Found</h2>
          <p className="text-zinc-500 font-medium italic">{error || "The requested profile does not exist."}</p>
        </div>
        <Button onClick={() => router.push("/customers")} className="bg-zinc-900 text-white rounded-xl px-8 h-12">
          Back to Directory
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-blue-100 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/10">
                <User className="h-8 w-8 text-blue-600" />
            </div>
            <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tight text-zinc-900 uppercase">
                    {customer.name}
                </h1>
                <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-500 text-white border-0 font-black uppercase text-[9px] tracking-widest px-2 py-0.5">
                        {customer.status}
                    </Badge>
                    <span className="text-[11px] text-zinc-400 font-mono">#{customer.code}</span>
                </div>
            </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="h-10 text-[11px] font-black uppercase tracking-wider gap-2 border-zinc-200"
            onClick={() => router.push("/customers")}
          >
            <ChevronLeft className="h-4 w-4" />
            Directory
          </Button>
          <Button 
            onClick={() => router.push(`/customers/edit/${customer.id}`)}
            className="h-10 bg-zinc-900 hover:bg-black text-white rounded-xl font-black uppercase text-[11px] tracking-widest gap-2 shadow-xl active:scale-95 transition-all"
          >
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Financial Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <QuickStat label="Total Loans" value={String(customer.financials.totalLoans)} icon={CreditCard} color="blue" />
        <QuickStat label="Active Balance" value={formatCurrency(customer.financials.activeBalance)} icon={Activity} color="rose" />
        <QuickStat label="Total Repaid" value={formatCurrency(customer.financials.totalPaid)} icon={TrendingUp} color="emerald" />
        <QuickStat label="Repayment Rate" value={`${customer.financials.onTimeRepaymentRate}%`} icon={ShieldCheck} color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact & Personal Info */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="bg-zinc-50 px-6 py-4 border-b border-zinc-100">
                    <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Contact Details</span>
                </div>
                <div className="p-6 space-y-4">
                    <ContactItem icon={Phone} label="Phone" value={customer.phone} />
                    <ContactItem icon={Mail} label="Email" value={customer.email || "No email provided"} />
                    <ContactItem icon={MapPin} label="Address" value={`${customer.streetAddress}, ${customer.sector}, ${customer.district}`} />
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="bg-zinc-50 px-6 py-4 border-b border-zinc-100">
                    <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Biographical</span>
                </div>
                <div className="p-6 space-y-3">
                    <InfoRow label="Gender" value={customer.gender} />
                    <InfoRow label="ID Number" value={customer.idNumber} />
                    <InfoRow label="Occupation" value={customer.occupation} />
                    <InfoRow label="Marital Status" value={customer.maritalStatus} />
                    <InfoRow label="Account #" value={customer.accountNumber} />
                </div>
            </div>
        </div>

        {/* Loan History Table */}
        <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden h-full flex flex-col">
                <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <History className="h-5 w-5 text-blue-600" />
                        <span className="text-[12px] font-black uppercase tracking-widest text-zinc-900">Loan Portfolio</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] uppercase font-black">{loans.length} Loans</Badge>
                </div>
                <div className="flex-1 overflow-x-auto">
                    {loans.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="bg-zinc-50/50">
                                <tr className="border-b border-zinc-100">
                                    <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">Loan #</th>
                                    <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">Amount</th>
                                    <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">Status</th>
                                    <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loans.map((loan) => (
                                    <tr key={loan.loanId} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50 transition-colors">
                                        <td className="px-6 py-4 text-[13px] font-bold text-zinc-900 font-mono">{loan.loanNumber}</td>
                                        <td className="px-6 py-4 text-[13px] font-bold text-zinc-900">{formatCurrency(Number(loan.loanAmount))}</td>
                                        <td className="px-6 py-4">
                                            <Badge className={cn(
                                                "uppercase text-[9px] font-black tracking-widest px-2 py-0.5",
                                                loan.loanStatus === "Active" ? "bg-blue-100 text-blue-600" :
                                                loan.loanStatus === "Overdue" ? "bg-rose-100 text-rose-600" :
                                                "bg-zinc-100 text-zinc-500"
                                            )}>
                                                {loan.loanStatus}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="text-[10px] font-black uppercase text-blue-600 hover:text-blue-700 p-0 h-auto"
                                                onClick={() => router.push(`/loans/${loan.loanId}`)}
                                            >
                                                View Details
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-20 text-center space-y-4">
                            <p className="text-[11px] text-zinc-400 font-medium italic">No historical loans found for this member.</p>
                            <Button onClick={() => router.push(`/loans/new?customerId=${customer.id}`)} variant="outline" className="border-zinc-200">
                                Create First Loan
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function QuickStat({ label, value, icon: Icon, color }: { label: string; value: string; icon: any; color: string }) {
    const colors: any = {
        blue: "text-blue-600 bg-blue-50",
        rose: "text-rose-600 bg-rose-50",
        emerald: "text-emerald-600 bg-emerald-50",
        indigo: "text-indigo-600 bg-indigo-50"
    };
    return (
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-3">
            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", colors[color])}>
                <Icon className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{label}</p>
                <p className="text-xl font-black text-zinc-900">{value}</p>
            </div>
        </div>
    );
}

function ContactItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="h-8 w-8 bg-zinc-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{label}</p>
                <p className="text-[13px] font-bold text-zinc-900 leading-tight">{value}</p>
            </div>
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between text-[12px]">
            <span className="font-bold text-zinc-400 uppercase tracking-tight">{label}</span>
            <span className="font-black text-zinc-900 uppercase">{value || "—"}</span>
        </div>
    );
}

function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
