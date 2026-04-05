"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Trash2 } from "lucide-react";
import { createApproval } from "@/services/approval.service";
import { GLAccount } from "@/types/account";
import { toast } from "sonner";

interface DeactivateAccountDialogProps {
  account: GLAccount | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeactivateAccountDialog({ account, isOpen, onClose, onSuccess }: DeactivateAccountDialogProps) {
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!account || !reason.trim()) return;

    setIsLoading(true);
    try {
      await createApproval({
        actionType: "DEACTIVATE_ACCOUNT",
        entityType: "ACCOUNT",
        entityId: Number(account.id),
        actionData: { 
            accountId: account.id,
            accountName: account.name,
            accountCode: account.code,
            reason 
        },
        description: `Deactivate account ${account.code} - ${account.name}`,
      });

      toast.success("Deactivation request submitted for approval");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-none rounded-xl">
        <div className="bg-rose-600 px-6 py-4 flex items-center justify-between text-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-black tracking-tight flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Deactivate Account
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4 p-4 bg-rose-50 rounded-xl border border-rose-100">
            <AlertCircle className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[13px] font-bold text-rose-900">Important Security Notice</p>
              <p className="text-[12px] text-rose-700 mt-1 leading-relaxed">
                Deactivating an account will disable it for new transactions. This action requires administrative approval. Please provide a clear reason for the deactivation.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2 block">Account Details</Label>
              <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                <p className="text-[14px] font-bold text-zinc-900">{account?.code} - {account?.name}</p>
                <p className="text-[12px] text-zinc-500 mt-0.5 font-medium">{account?.subType}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Reason for deactivation <span className="text-red-500">*</span></Label>
              <Textarea 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why this account is being deactivated..."
                className="min-h-[100px] border-zinc-200 focus:ring-rose-500 focus:border-rose-500"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-2 bg-zinc-50/50 border-t border-zinc-100">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="h-10 px-4 font-medium text-zinc-500 hover:text-zinc-900"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading || !reason.trim()}
            className="h-10 px-6 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-[13px] shadow-sm ml-2"
          >
            {isLoading ? "Submitting..." : "Submit for Approval"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
