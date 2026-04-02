"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight, Home, LayoutDashboard, Loader2 } from "lucide-react";
import { LoanForm } from "@/components/loans/add-loan-form";
import { getLoanById } from "@/services/mock/loan.service";
import { Loan } from "@/types/loan";

export default function EditLoanPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loan, setLoan] = useState<Loan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (typeof id !== "string") return;
      const data = await getLoanById(id);
      if (data) {
        setLoan(data);
      }
      setIsLoading(false);
    };
    load();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Fetching Loan Data...</p>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="p-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-zinc-900 uppercase">Loan Not Found</h2>
        <button 
          onClick={() => router.push("/loans")}
          className="text-blue-600 font-bold hover:underline"
        >
          Back to Portfolio
        </button>
      </div>
    );
  }

  // Pre-process loan data into form values if necessary
  const initialData = {
    ...loan,
    // Ensure numeric fields are numbers
    principal: Number(loan.principal),
    interestRate: Number(loan.interestRate),
    mgmtFeeRate: Number(loan.interestRate), // Mock mgmt fee rate if missing
    instalments: Number(loan.term),
    disbursementDate: loan.startDate,
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 px-1">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:text-blue-600 transition-colors"
        >
          <Home className="h-3.5 w-3.5" />
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-zinc-300" />
        <Link 
          href="/loans" 
          className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:text-blue-600 transition-colors"
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          Dashboard
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-zinc-300" />
        <span className="text-[11px] font-black uppercase tracking-widest text-blue-600">Edit Loan: {loan.loanNumber}</span>
      </nav>

      {/* Form Container */}
      <div className="max-w-5xl mx-auto">
        <LoanForm initialData={initialData as any} isEdit={true} />
      </div>
    </div>
  );
}
