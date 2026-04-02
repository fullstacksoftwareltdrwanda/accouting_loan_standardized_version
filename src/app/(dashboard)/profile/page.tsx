import React from "react";
import { ProfileCard } from "@/components/profile/profile-card";
import { PersonalInfoForm } from "@/components/profile/personal-info-form";
import { SecuritySettings } from "@/components/profile/security-settings";
import { UserProfile } from "@/types/user";

export const metadata = {
  title: "Admin Profile | ALMS",
  description: "Manage your professional identity and account security settings.",
};

const MOCK_USER: UserProfile = {
  id: "usr_1",
  name: "Company Director",
  email: "director@moneytap.rw",
  phone: "+250 788 000 000",
  role: "Director",
  department: "Executive Management",
  joinedDate: "October 12, 2024",
  lastLogin: "2 hours ago",
  status: "active",
  twoFactorEnabled: true,
  permissions: ["all"],
};

export default function ProfilePage() {
  return (
    <div className="p-4 md:p-8 space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-3xl font-black tracking-tighter text-[#1a365d] dark:text-blue-400 uppercase">
          Profile Settings
        </h2>
        <p className="text-[13px] text-zinc-500 font-medium italic">
          Configure your professional profile and security preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column - Identity Card */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-8">
           <ProfileCard user={MOCK_USER} />
        </div>

        {/* Right Column - Controls */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-12">
           <PersonalInfoForm user={MOCK_USER} />
           <SecuritySettings />
        </div>
      </div>
    </div>
  );
}
