"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, Home, ReceiptText } from "lucide-react";
import { ExpenseStats } from "@/components/expenses/expense-stats";
import { ExpenseRecordForm } from "@/components/expenses/expense-record-form";
import { ExpenseAccountingInfo } from "@/components/expenses/expense-accounting-info";
import { Expense } from "@/types/expense";
import { GLAccount } from "@/types/account";
import { getExpenses, createExpense } from "@/services/mock/expense.service";
import { getAccounts } from "@/services/mock/account.service";
import { DataTable } from "@/components/table/data-table";
import { expenseColumns, getExpenseActions } from "@/components/expenses/expense-columns";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [accounts, setAccounts] = useState<GLAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load data
  useEffect(() => {
    const load = async () => {
      try {
        const [expData, accData] = await Promise.all([
          getExpenses(),
          getAccounts(),
        ]);
        setExpenses(expData);
        setAccounts(accData);
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Stats Calculations
  const today = new Date().toISOString().split('T')[0];
  const thisMonthStr = new Date().toISOString().substring(0, 7);

  const todayTotal = expenses
    .filter((e) => e.date === today)
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const monthTotal = expenses
    .filter((e) => e.date.startsWith(thisMonthStr))
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const grandTotal = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const salaryEntries = expenses.filter((e) => e.category === "Salaries").length;

  const handleAddExpense = async (data: Partial<Expense>) => {
    setIsSubmitting(true);
    try {
      const newExp = await createExpense(data);
      setExpenses((prev) => [newExp, ...prev]);
    } catch (error) {
      console.error("Creation failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const actions = getExpenseActions(
    (exp) => console.log("Edit", exp),
    (exp) => console.log("Receipt", exp)
  );
  const columns = expenseColumns(actions);

  const StatCard = ({ title, value, footer, isRose = true }: any) => (
    <div className="bg-white p-5 rounded-xl border border-zinc-100 shadow-sm space-y-1 h-full">
      <p className="text-[12px] font-bold text-zinc-500 uppercase tracking-wider">{title}</p>
      <p className={`text-xl font-black ${isRose ? 'text-[#eb102f]' : 'text-blue-600'}`}>Rwf {value.toLocaleString()}</p>
      <p className="text-[10px] text-zinc-400 font-medium">{footer}</p>
    </div>
  );

  return (
    <div className="flex flex-col space-y-8 mt-1 pb-12">
      {/* Breadcrumbs & Title Area */}
      <div className="space-y-4">
        <nav className="flex items-center gap-2 text-[13px] font-medium text-zinc-400">
          <span className="text-zinc-400 flex items-center gap-1.5 hover:text-[#eb102f] transition-colors cursor-pointer">
            <Home className="h-4 w-4" />
            Home
          </span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-zinc-600 font-semibold">Expenditures</span>
        </nav>

        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-[#eb102f]">
            Expenditures Management
          </h1>
          <p className="text-[13px] text-zinc-500 font-medium italic">Monitor and record business operational costs and ledger entries.</p>
        </div>
      </div>

      {/* Main Container Grid - 4 Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1440px]">
        {/* Row 1: Statistics */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <StatCard 
             title="Today's Expenses" 
             value={todayTotal} 
             footer={new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} 
           />
        </div>
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
           <StatCard 
             title="This Month" 
             value={monthTotal} 
             footer={new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })} 
           />
        </div>
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
           <StatCard 
             title="Total Expenses" 
             value={grandTotal} 
             footer="All time" 
           />
        </div>
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
           <div className="bg-blue-600 p-5 rounded-xl shadow-lg shadow-blue-500/20 h-full text-white relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-[12px] font-bold uppercase tracking-wider opacity-80">Salary Entries</p>
                    <p className="text-3xl font-black">{salaryEntries}</p>
                    <p className="text-[10px] font-medium opacity-70">Salary expense transactions</p>
                </div>
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
           </div>
        </div>

        {/* Row 2: Form and Info */}
        <div className="lg:col-span-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <ExpenseRecordForm 
            accounts={accounts} 
            onSubmit={handleAddExpense} 
            isLoading={isSubmitting} 
          />
        </div>

        <div className="lg:col-span-1 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <ExpenseAccountingInfo />
        </div>

        {/* Row 3: Transaction History List */}
        <div className="lg:col-span-4 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
            <div className="flex items-center justify-between bg-[#1e293b] px-4 py-2.5 text-white">
                <div className="flex items-center gap-2">
                    <ReceiptText className="h-4 w-4 text-white" />
                    <h3 className="text-[12px] font-bold uppercase tracking-wider">Transaction History List</h3>
                </div>
                <div className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">{expenses.length} Records</div>
            </div>
            <div className="p-4 bg-zinc-50/30">
                <DataTable 
                    columns={columns} 
                    data={expenses} 
                    isLoading={isLoading} 
                    filterColumn="description"
                    filterPlaceholder="Search expenditures..."
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
