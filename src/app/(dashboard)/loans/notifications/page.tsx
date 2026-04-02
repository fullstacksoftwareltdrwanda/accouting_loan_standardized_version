import React from "react";
import { PaymentNotifications } from "@/components/loans/payment-notifications";

export const metadata = {
  title: "Payment Notifications | ALMS",
  description: "View upcoming and due instalments requiring attention.",
};

export default function NotificationsPage() {
  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-700">
      <PaymentNotifications />
    </div>
  );
}
