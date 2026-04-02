"use client";

import React, { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Info, 
  ChevronRight, 
  Calendar as CalendarIcon,
  DollarSign,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Customer } from "@/types/customer";
import { getCustomers } from "@/services/mock/customer.service";
import { createLoan } from "@/services/mock/loan.service";
import { useRouter } from "next/navigation";

const loanFormSchema = z.object({
  customerId: z.string().min(1, "Please select a customer"),
  loanNumber: z.string().min(1, "Loan number is required"),
  isTopUp: z.boolean(),
  principal: z.number().min(1000, "Min amount is 1,000"),
  cashAmount: z.number(),
  bankAmount: z.number(),
  deductFeeUpfront: z.boolean(),
  interestRate: z.number().min(0),
  mgmtFeeRate: z.number().min(0),
  instalments: z.number().min(1),
  disbursementDate: z.string().min(1, "Disbursement date is required"),
  collateralType: z.string().optional(),
  collateralValue: z.number(),
  collateralDescription: z.string().optional(),
});

type LoanFormValues = z.infer<typeof loanFormSchema>;

export function LoanForm({ 
  initialData, 
  isEdit = false 
}: { 
  initialData?: Partial<LoanFormValues>, 
  isEdit?: boolean 
}) {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<LoanFormValues>({
    resolver: zodResolver(loanFormSchema),
    defaultValues: {
      customerId: initialData?.customerId || "",
      loanNumber: initialData?.loanNumber || `LN-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(100000 + Math.random() * 900000)}`,
      isTopUp: !!initialData?.isTopUp,
      principal: Number(initialData?.principal || 2110000),
      interestRate: Number(initialData?.interestRate || 5.0),
      mgmtFeeRate: Number(initialData?.mgmtFeeRate || 5.5),
      instalments: Number(initialData?.instalments || 6),
      disbursementDate: initialData?.disbursementDate || new Date().toISOString().split("T")[0],
      deductFeeUpfront: initialData?.deductFeeUpfront ?? true,
      cashAmount: Number(initialData?.cashAmount || 0),
      bankAmount: Number(initialData?.bankAmount || 0),
      collateralValue: Number(initialData?.collateralValue || 0),
      collateralType: initialData?.collateralType || "",
      collateralDescription: initialData?.collateralDescription || "",
    }
  });

  const watchedValues = useWatch({ control });
  const [summary, setSummary] = useState({
    mgmtFee: 0,
    netAmount: 0,
    interest: 0,
    totalToPay: 0,
    monthlyPayment: 0,
    maturityDate: ""
  });

  // Fetch customers
  useEffect(() => {
    getCustomers().then(setCustomers);
  }, []);

  // Real-time calculations
  useEffect(() => {
    const principal = watchedValues.principal || 0;
    const mgmtRate = watchedValues.mgmtFeeRate || 0;
    const interestRate = watchedValues.interestRate || 0;
    const instalments = watchedValues.instalments || 1;
    const deductUpfront = watchedValues.deductFeeUpfront;

    const mgmtFeeTotal = principal * (mgmtRate / 100);
    const netAmount = deductUpfront ? principal - mgmtFeeTotal : principal;
    
    // Simple Interest logic for mock transparency
    const totalInterest = principal * (interestRate / 100) * instalments;
    // If not deducted upfront, fee is added to total to pay
    const totalToPay = principal + totalInterest + (deductUpfront ? 0 : mgmtFeeTotal);
    const monthlyPayment = instalments > 0 ? totalToPay / instalments : 0;

    // Maturity Date calculation
    const d = new Date(watchedValues.disbursementDate || new Date());
    d.setMonth(d.getMonth() + instalments);
    const maturityDate = d.toISOString().split("T")[0];

    setSummary({
      mgmtFee: mgmtFeeTotal,
      netAmount,
      interest: totalInterest,
      totalToPay,
      monthlyPayment,
      maturityDate
    });
  }, [watchedValues]);

  const onSubmit = async (data: LoanFormValues) => {
    setIsSubmitting(true);
    try {
      const customer = customers.find(c => c.id === data.customerId);
      await createLoan({
        ...data,
        customerName: customer?.name || "Unknown",
        totalPayable: summary.totalToPay,
        totalPaid: 0,
        status: "active",
        maturityDate: summary.maturityDate,
      });
      router.push("/loans");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-12">
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden dark:bg-zinc-950 dark:border-zinc-800">
        <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50 dark:border-zinc-800">
          <h2 className="text-xl font-black text-blue-600 uppercase tracking-tight">
            {isEdit ? "Edit Loan Details" : "Create New Loan"}
          </h2>
        </div>

        <div className="p-8 space-y-10">
          {/* Header Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase text-zinc-400">Customer <span className="text-red-500">*</span></Label>
              <Select onValueChange={(v) => setValue("customerId", v)}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select Customer" />
                </SelectTrigger>
                <SelectContent>
                   {customers.map(c => (
                     <SelectItem key={c.id} value={c.id}>{c.name} ({c.code})</SelectItem>
                   ))}
                </SelectContent>
              </Select>
              {errors.customerId && <p className="text-xs text-red-500 mt-1">{errors.customerId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase text-zinc-400">Loan Number <span className="text-red-500">*</span></Label>
              <Input {...register("loanNumber")} className="h-12 rounded-xl bg-zinc-50/50" />
              <p className="text-[10px] text-zinc-400 font-medium italic">Auto-generated</p>
            </div>
          </div>

          {/* Top up Toggle */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50/50 border border-zinc-100 dark:bg-zinc-900/50 dark:border-zinc-800">
             <div className="flex relative h-6 w-11 items-center rounded-full bg-zinc-200 transition-colors">
                <Checkbox 
                  id="isTopUp" 
                  className="peer h-6 w-11 opacity-0 z-10 cursor-pointer" 
                  onCheckedChange={(checked) => setValue("isTopUp", !!checked)}
                />
                <div className={cn(
                  "absolute left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5",
                  watchedValues.isTopUp ? "bg-blue-600" : ""
                )} />
             </div>
             <div className="flex flex-col">
                <Label htmlFor="isTopUp" className="text-[12px] font-black text-zinc-700 dark:text-zinc-300">This is a Top-up Loan</Label>
                <span className="text-[11px] text-zinc-400">Enable if this loan tops up an existing loan balance</span>
             </div>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-100 flex gap-3 dark:bg-cyan-900/10 dark:border-cyan-900/20">
             <AlertCircle className="h-5 w-5 text-cyan-500 shrink-0" />
             <p className="text-[11px] text-cyan-700 font-medium leading-relaxed">
               <span className="font-black text-cyan-800">Total Disbursed:</span> This is the starting balance for all payment calculations. Choose whether to deduct management fee upfront or include it in first installment.
             </p>
          </div>

          {/* Financials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase text-zinc-400">Total Disbursed <span className="text-red-500">*</span></Label>
              <Input 
                type="number" 
                {...register("principal", { valueAsNumber: true })} 
                className="h-12 rounded-xl text-lg font-black" 
              />
              <p className="text-[10px] text-zinc-400 font-medium italic">Starting balance for payment schedule</p>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase text-zinc-400">Amount Given to Customer (Net)</Label>
              <Input 
                readOnly 
                value={summary.netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} 
                className="h-12 rounded-xl bg-zinc-50/50 font-black text-emerald-600" 
              />
              <p className="text-[10px] text-zinc-400 font-medium italic">Actual cash given to customer</p>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase text-zinc-400">Cash Amount <span className="text-red-500">*</span></Label>
              <Input type="number" {...register("cashAmount", { valueAsNumber: true })} className="h-12 rounded-xl" />
              <p className="text-[10px] text-zinc-400 font-medium italic">Amount disbursed via Cash</p>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase text-zinc-400">Bank Amount <span className="text-red-500">*</span></Label>
              <Input type="number" {...register("bankAmount", { valueAsNumber: true })} className="h-12 rounded-xl" />
              <p className="text-[10px] text-zinc-400 font-medium italic">Amount disbursed via Bank</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <Checkbox 
                id="deductFee" 
                checked={watchedValues.deductFeeUpfront}
                onCheckedChange={(c) => setValue("deductFeeUpfront", !!c)} 
                className="h-5 w-5 rounded-md border-blue-200"
             />
             <Label htmlFor="deductFee" className="font-black text-[12px] text-zinc-700">Deduct management fee from disbursed amount</Label>
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase text-zinc-400">Monthly Interest Rate (%) <span className="text-red-500">*</span></Label>
              <Input type="number" step="0.1" {...register("interestRate", { valueAsNumber: true })} className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase text-zinc-400">Management Fee Rate (%) <span className="text-red-500">*</span></Label>
              <Input type="number" step="0.1" {...register("mgmtFeeRate", { valueAsNumber: true })} className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase text-zinc-400">Number of Instalments <span className="text-red-500">*</span></Label>
              <Input type="number" {...register("instalments", { valueAsNumber: true })} className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase text-zinc-400">Disbursement Date <span className="text-red-500">*</span></Label>
              <Input type="date" {...register("disbursementDate")} className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase text-zinc-400">Maturity Date <span className="text-red-500">*</span></Label>
              <Input readOnly value={summary.maturityDate} className="h-11 rounded-xl bg-zinc-50/50" />
            </div>
          </div>

          {/* Loan Summary Display */}
          <div className="space-y-6 pt-6">
             <h3 className="text-sm font-black text-zinc-900 border-b pb-2 dark:text-zinc-50">Loan Summary</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryBox label="Mgmt Fee/Total" value={summary.mgmtFee} />
                <SummaryBox label="Monthly Payment" value={summary.monthlyPayment} isBold />
                <SummaryBox label="Interest" value={summary.interest} />
                <SummaryBox label="Total to Pay" value={summary.totalToPay} isPrimary />
             </div>
          </div>

          {/* Collateral Information */}
          <div className="space-y-6 pt-6">
             <h3 className="text-sm font-black text-zinc-900 border-b pb-2 dark:text-zinc-50">Collateral Information</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase text-zinc-400">Collateral Type</Label>
                  <Select onValueChange={(v) => setValue("collateralType", v)}>
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="property">Property / Land</SelectItem>
                       <SelectItem value="vehicle">Vehicle</SelectItem>
                       <SelectItem value="guarantor">Personal Guarantor</SelectItem>
                       <SelectItem value="other">Other Assets</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase text-zinc-400">Collateral Value</Label>
                  <Input type="number" {...register("collateralValue", { valueAsNumber: true })} className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase text-zinc-400">Net Value</Label>
                  <Input readOnly value={(watchedValues.collateralValue || 0).toLocaleString()} className="h-11 rounded-xl bg-zinc-50/50" />
                </div>
             </div>
             <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase text-zinc-400">Collateral Description</Label>
                <Textarea {...register("collateralDescription")} className="rounded-xl min-h-[100px]" placeholder="Enter detailed description of the collateral assets..." />
             </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-8 bg-zinc-50/50 border-t border-zinc-100 flex justify-start gap-4 dark:bg-zinc-900/50 dark:border-zinc-800">
           <Button 
            type="submit" 
            disabled={isSubmitting}
            className="h-11 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[11px] tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
           >
             {isSubmitting ? "Processing..." : isEdit ? "Update Loan Details" : "Create Loan"}
           </Button>
           <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.back()}
            className="h-11 px-8 rounded-xl font-black uppercase text-[11px] tracking-widest border-zinc-200 active:scale-95 transition-all"
           >
             Cancel
           </Button>
        </div>
      </div>
    </form>
  );
}

function SummaryBox({ label, value, isPrimary, isBold }: { label: string; value: number; isPrimary?: boolean; isBold?: boolean }) {
  return (
    <div className="space-y-2">
      <Label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">{label}</Label>
      <div className={cn(
        "h-12 flex items-center px-4 rounded-xl border border-zinc-100 bg-white shadow-sm dark:bg-zinc-950 dark:border-zinc-800",
        isPrimary ? "bg-blue-50 border-blue-100 text-blue-700 font-black" : "text-zinc-700",
        isBold ? "font-black" : "font-semibold"
      )}>
        {value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </div>
    </div>
  );
}
