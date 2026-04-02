"use client";

import React, { useState } from "react";
import { 
  UserPlus, 
  ChevronLeft, 
  Save, 
  MapPin, 
  Users, 
  ShieldCheck, 
  CreditCard, 
  FileText,
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createCustomer } from "@/services/mock/customer.service";
import { useRouter } from "next/navigation";

// Validation Schema matching the standardized Customer interface
const customerSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  idNumber: z.string().min(5, "ID Number is required"),
  phone: z.string().min(10, "Phone number is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  gender: z.string(),
  dateOfBirth: z.string().optional(),
  occupation: z.string().optional(),
  accountNumber: z.string().optional(),
  province: z.string().optional(),
  district: z.string().optional(),
  sector: z.string().optional(),
  cell: z.string().optional(),
  streetAddress: z.string().optional(),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  maritalStatus: z.string().min(1, "Marital status is required"),
  hasGuarantor: z.boolean(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export const AddCustomerForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      idNumber: "",
      phone: "",
      email: "",
      gender: "male",
      maritalStatus: "single",
      hasGuarantor: false,
    }
  });

  const onSubmit = async (data: CustomerFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await createCustomer(data);
      setIsSuccess(true);
      // Brief delay before redirecting
      setTimeout(() => {
        router.push("/customers");
      }, 2000);
    } catch (err) {
      setError("Failed to register customer. Please check your data and try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="h-24 w-24 bg-emerald-100 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <CheckCircle className="h-12 w-12 text-emerald-600" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-zinc-900 uppercase">Registration Successful!</h2>
          <p className="text-zinc-500 font-medium italic">Customer has been added to the ecosystem. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Page Header */}
      <div className="flex items-center justify-between px-2">
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight text-blue-600 uppercase">
            Add New Customer
          </h1>
          <p className="text-[13px] text-zinc-500 font-medium italic">
            Manually register a customer for MoneyTap Ecosystem
          </p>
        </div>
        <Link href="/customers">
          <Button variant="outline" className="text-[11px] font-black uppercase tracking-wider gap-2 h-10 border-zinc-200">
            <ChevronLeft className="h-4 w-4" />
            Back to Customers
          </Button>
        </Link>
      </div>

      {/* Main Registration Form */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl shadow-zinc-500/5 overflow-hidden">
        {/* Section Header */}
        <div className="bg-[#2563eb] px-6 py-4 text-white flex items-center justify-between border-b border-blue-700/30 shadow-lg shadow-blue-500/10">
            <div className="flex items-center gap-3">
                <UserPlus className="h-5 w-5" />
                <span className="text-[12px] font-black uppercase tracking-[0.15em]">Manual Registration</span>
            </div>
        </div>

        {error && (
            <div className="m-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-600 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-5 w-5" />
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-12">
            {/* 1. BASIC INFORMATION */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 border-l-4 border-blue-500 pl-4 py-1">
                    <span className="text-[13px] font-black uppercase tracking-widest text-blue-600">Basic Information</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">Full Name <span className="text-rose-500">*</span></Label>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} className={cn("h-11 border-zinc-200 bg-zinc-50/20 focus:bg-white transition-all rounded-xl", errors.name && "border-rose-300 bg-rose-50/10")} placeholder="Full Name" />
                            )}
                        />
                        {errors.name && <p className="text-[10px] font-bold text-rose-500 uppercase">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">ID Number <span className="text-rose-500">*</span></Label>
                        <Controller
                            name="idNumber"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} className={cn("h-11 border-zinc-200 bg-zinc-50/20 focus:bg-white transition-all rounded-xl", errors.idNumber && "border-rose-300 bg-rose-50/10")} placeholder="ID Number" />
                            )}
                        />
                        {errors.idNumber && <p className="text-[10px] font-bold text-rose-500 uppercase">{errors.idNumber.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">Phone <span className="text-rose-500">*</span></Label>
                        <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} className={cn("h-11 border-zinc-200 bg-zinc-50/20 focus:bg-white transition-all rounded-xl", errors.phone && "border-rose-300 bg-rose-50/10")} placeholder="Phone" />
                            )}
                        />
                        {errors.phone && <p className="text-[10px] font-bold text-rose-500 uppercase">{errors.phone.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">Email</Label>
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} className="h-11 border-zinc-200 bg-zinc-50/20 focus:bg-white transition-all rounded-xl" placeholder="Email" />
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">Gender</Label>
                        <Controller
                            name="gender"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="h-11 border-zinc-200 bg-zinc-50/20 rounded-xl font-medium text-zinc-600 uppercase text-[11px] font-black tracking-widest">
                                        <SelectValue placeholder="Gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">Date of Birth</Label>
                        <Controller
                            name="dateOfBirth"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} type="date" className="h-11 border-zinc-200 bg-zinc-50/20 focus:bg-white transition-all rounded-xl font-medium text-zinc-500" />
                            )}
                        />
                    </div>
                    <div className="space-y-2 lg:col-span-1">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">Occupation</Label>
                        <Controller
                            name="occupation"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} className="h-11 border-zinc-200 bg-zinc-50/20 rounded-xl" placeholder="Occupation" />
                            )}
                        />
                    </div>
                    <div className="space-y-2 lg:col-span-1">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">Account Number</Label>
                        <Controller
                            name="accountNumber"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} className="h-11 border-zinc-200 bg-zinc-50/20 rounded-xl font-mono" placeholder="Account Number" />
                            )}
                        />
                    </div>
                </div>
            </div>

            {/* 2. CURRENT RESIDENCE */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 border-l-4 border-blue-500 pl-4 py-1">
                    <span className="text-[13px] font-black uppercase tracking-widest text-blue-600">Current Residence</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">Province</Label>
                        <Controller
                            name="province"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="h-11 border-zinc-200 bg-zinc-50/20 rounded-xl text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                                        <SelectValue placeholder="Select..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="kigali">Kigali City</SelectItem>
                                        <SelectItem value="north">North</SelectItem>
                                        <SelectItem value="south">South</SelectItem>
                                        <SelectItem value="east">East</SelectItem>
                                        <SelectItem value="west">West</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">District</Label>
                        <Controller
                            name="district"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} className="h-11 border-zinc-200 bg-zinc-50/20 rounded-xl" placeholder="District" />
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">Sector</Label>
                        <Controller
                            name="sector"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} className="h-11 border-zinc-200 bg-zinc-50/20 rounded-xl" placeholder="Sector" />
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">Cell</Label>
                        <Controller
                            name="cell"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} className="h-11 border-zinc-200 bg-zinc-50/20 rounded-xl" placeholder="Cell" />
                            )}
                        />
                    </div>
                    <div className="col-span-full space-y-2">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">Street / Address</Label>
                        <Controller
                            name="streetAddress"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} className="h-11 border-zinc-200 bg-zinc-50/20 rounded-xl" placeholder="Street / Address" />
                            )}
                        />
                    </div>
                </div>
            </div>

            {/* 3. FAMILY & MARITAL INFORMATION */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 border-l-4 border-blue-500 pl-4 py-1">
                    <span className="text-[13px] font-black uppercase tracking-widest text-blue-600">Family & Marital Information</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">Father's Name</Label>
                        <Controller
                            name="fatherName"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} className="h-11 border-zinc-200 bg-zinc-50/20 rounded-xl" placeholder="Father's Name" />
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">Mother's Name</Label>
                        <Controller
                            name="motherName"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} className="h-11 border-zinc-200 bg-zinc-50/20 rounded-xl" placeholder="Mother's Name" />
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">Marital Status</Label>
                        <Controller
                            name="maritalStatus"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="h-11 border-zinc-200 bg-zinc-50/20 rounded-xl font-medium text-zinc-700">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="single">Single</SelectItem>
                                        <SelectItem value="married">Married</SelectItem>
                                        <SelectItem value="divorced">Divorced</SelectItem>
                                        <SelectItem value="widowed">Widowed</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                </div>
            </div>

            {/* 4. GUARANTOR INFORMATION */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 border-l-4 border-blue-500 pl-4 py-1">
                    <span className="text-[13px] font-black uppercase tracking-widest text-blue-600">Guarantor Information</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase text-zinc-400">Has Guarantor?</Label>
                        <Controller
                            name="hasGuarantor"
                            control={control}
                            render={({ field }) => (
                                <Select 
                                    onValueChange={(val) => field.onChange(val === "yes")} 
                                    defaultValue={field.value ? "yes" : "no"}
                                >
                                    <SelectTrigger className="h-11 border-zinc-200 bg-zinc-50/20 rounded-xl font-medium text-zinc-700 uppercase text-[11px] font-black tracking-widest">
                                        <SelectValue placeholder="Select No/Yes" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="no">No</SelectItem>
                                        <SelectItem value="yes">Yes</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-10 border-t border-zinc-100 flex items-center justify-between">
                <Link href="/customers">
                    <Button type="button" variant="secondary" className="h-12 px-10 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl active:scale-95 transition-all">
                        Cancel
                    </Button>
                </Link>
                <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="h-12 px-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.15em] gap-3 shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                >
                    {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="h-4 w-4" />
                    )}
                    {isSubmitting ? "Registering..." : "Save Customer"}
                </Button>
            </div>
        </form>
      </div>
      <div className="flex justify-center pb-8 opacity-40">
        <p className="text-[11px] font-medium text-zinc-500">ALMS High-Fidelity Manual Registration | Verified Ecosystem Standards</p>
      </div>
    </div>
  );
};

// Simple CN utility helper as seen in the components
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
