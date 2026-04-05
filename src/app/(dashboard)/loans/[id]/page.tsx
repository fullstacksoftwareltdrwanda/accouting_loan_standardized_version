"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  Edit, 
  User, 
  FileText, 
  Info, 
  History, 
  TrendingUp, 
  Printer, 
  DollarSign,
  ArrowLeft
} from "lucide-react";
import { getLoanById } from "@/services/loan.service";
import { getCustomerById } from "@/services/customer.service";
import { Loan } from "@/types/loan";
import { Customer } from "@/types/customer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function LoanDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loan, setLoan] = useState<Loan | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (typeof id !== "string") return;
      try {
        setIsLoading(true);
        const ln = await getLoanById(id) as Loan;
        if (ln) {
          setLoan(ln);
          const cust = await getCustomerById(ln.customerId) as Customer;
          if (cust) setCustomer(cust);
        }
      } catch (error) {
        console.error("Failed to load loan data", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  if (isLoading) {
    return <div className="p-20 text-center animate-pulse font-black uppercase tracking-widest text-zinc-400">Loading Loan Details...</div>;
  }

  if (!loan || !customer) {
    return (
      <div className="p-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-zinc-900 uppercase">Loan Not Found</h2>
        <Button onClick={() => router.push("/loans")}>Back to Portfolio</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight text-blue-600 uppercase">
            Loan Details
          </h1>
          <p className="text-[13px] text-zinc-500 font-medium italic">
            Loan #{loan.loanNumber}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="h-10 text-[11px] font-black uppercase tracking-wider gap-2 border-zinc-200"
            onClick={() => router.push("/loans")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button 
            onClick={() => router.push(`/loans/edit/${loan.id}`)}
            className="h-10 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black uppercase text-[11px] tracking-widest gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Loan Status</span>
          <Badge className="bg-emerald-500 text-white border-0 font-black uppercase text-[10px] tracking-widest px-3 py-1">
            {loan.status}
          </Badge>
        </div>
        <Info className="h-5 w-5 text-emerald-500" />
      </div>

      {/* Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Information */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col h-full">
           <div className="bg-blue-600 px-6 py-4 flex items-center gap-3">
              <User className="h-5 w-5 text-white" />
              <span className="text-[12px] font-black uppercase tracking-widest text-white">Customer Information</span>
           </div>
           <div className="p-8 space-y-6 flex-1">
              <InfoRow label="Name:" value={customer.name} />
              <InfoRow label="Code:" value={customer.code} valueClass="font-mono text-zinc-400" />
              <InfoRow label="Phone:" value={customer.phone} valueClass="text-blue-500 underline" />
              <InfoRow label="Email:" value={customer.email} valueClass="text-blue-500 underline" />
              <InfoRow label="Address:" value={`${customer.sector}, ${customer.district}`} />
           </div>
        </div>

        {/* Loan Information */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col h-full">
           <div className="bg-emerald-600 px-6 py-4 flex items-center gap-3">
              <FileText className="h-5 w-5 text-white" />
              <span className="text-[12px] font-black uppercase tracking-widest text-white">Loan Information</span>
           </div>
           <div className="p-8 space-y-4 flex-1">
              <InfoRow label="Loan Number:" value={loan.loanNumber} />
              <InfoRow label="Disbursement Amount:" value={`FRW ${loan.principal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} valueClass="text-emerald-600 font-black" />
              <hr className="border-zinc-100" />
              <InfoRow label="Total Expected (Schedule):" value={`FRW ${loan.totalPayable.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} valueClass="text-indigo-900" />
              <InfoRow label="Already Paid:" value={`FRW ${loan.totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} valueClass="text-emerald-600" />
              <InfoRow label="Penalties Paid:" value="FRW 0.00" valueClass="text-rose-500" />
              <hr className="border-zinc-100" />
              <InfoRow 
                label="Outstanding Balance:" 
                value={`FRW ${(loan.totalPayable - loan.totalPaid).toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
                valueClass="text-rose-600 font-black text-lg" 
              />
              <InfoRow label="Disbursement Date:" value={loan.startDate.split('-').reverse().join(' ')} />
           </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3 mr-auto">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <div className="flex flex-col">
            <span className="text-[12px] font-black uppercase tracking-widest text-zinc-900">Quick Actions</span>
            <span className="text-[10px] text-zinc-400 font-medium">Manage and process this loan immediately</span>
          </div>
        </div>
        
        <Button className="h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black uppercase text-[10px] tracking-widest gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
          <DollarSign className="h-4 w-4" />
          Record Payment
        </Button>
        <Button 
          onClick={() => router.push(`/loans/edit/${loan.id}`)}
          className="h-11 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
        >
          <Edit className="h-4 w-4" />
          Edit Loan Details
        </Button>
        <Button className="h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black uppercase text-[10px] tracking-widest gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
          <Printer className="h-4 w-4" />
          Print Statement
        </Button>
      </div>

      {/* Previous Loan History */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <History className="h-5 w-5 text-white" />
             <span className="text-[12px] font-black uppercase tracking-widest text-white">Previous Loan History</span>
             <span className="text-[10px] text-zinc-500 font-medium">— disbursed before {loan.startDate.split('-').reverse().join(' ')}</span>
          </div>
          <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700 uppercase text-[9px] font-black">0 Loan(s)</Badge>
        </div>
        <div className="p-16 flex flex-col items-center justify-center text-center space-y-4">
           <div className="h-12 w-12 rounded-xl bg-zinc-800 flex items-center justify-center">
              <FileText className="h-6 w-6 text-zinc-600" />
           </div>
           <p className="text-[11px] text-zinc-500 font-medium">No previous loans found for this customer before this loan's disbursement date.</p>
        </div>
      </div>

      {/* Credit Score & Payment Rate Card */}
      <div className="bg-indigo-900 rounded-2xl border border-indigo-800 shadow-xl overflow-hidden">
        <div className="px-6 py-3 border-b border-indigo-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <TrendingUp className="h-5 w-5 text-white" />
             <span className="text-[12px] font-black uppercase tracking-widest text-white">Customer Credit Score & Payment Rate</span>
          </div>
          <Badge className="bg-indigo-800 text-indigo-400 border-indigo-700 uppercase text-[9px] font-black">Based on 0 previous loan(s)</Badge>
        </div>
        <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
           <div className="h-10 w-10 rounded-xl bg-indigo-800 flex items-center justify-center">
              <BarChartIcon className="h-5 w-5 text-indigo-600" />
           </div>
           <p className="text-[11px] text-indigo-400 font-medium">No previous loan data — credit score will appear once historical loans exist.</p>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] font-bold text-zinc-500 uppercase tracking-tight">{label}</span>
      <span className={cn("text-[12px] font-bold text-zinc-900 dark:text-zinc-50", valueClass)}>{value}</span>
    </div>
  );
}

function BarChartIcon(props: any) {
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
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  );
}
