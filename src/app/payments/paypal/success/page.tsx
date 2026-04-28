"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/api-client";
import { toast } from "sonner";
import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

export default function PayPalSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [message, setMessage] = useState("Verifying your PayPal payment...");

  const token = searchParams.get("token"); // PayPal Order ID
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!token || !orderId) {
      setStatus("error");
      setMessage("Missing payment tokens. Please contact support.");
      return;
    }

    const capturePayment = async () => {
      try {
        const { data } = await axiosInstance.post("/payments/paypal/capture", {
          orderId,
          payPalOrderId: token,
        });

        if (data.success) {
          setStatus("success");
          setMessage("Payment confirmed successfully! Redirecting...");
          toast.success("PayPal payment confirmed.");
          
          // Small delay for UX
          setTimeout(() => {
            router.push(`/orders/${orderId}/confirmation`);
          }, 2000);
        } else {
          setStatus("error");
          setMessage(data.message || "Failed to confirm PayPal payment.");
        }
      } catch (err: any) {
        setStatus("error");
        setMessage("An error occurred while confirming your payment.");
      }
    };

    capturePayment();
  }, [token, orderId, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-white dark:bg-dark-bg p-4">
      <div className="w-full max-w-md rounded-3xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#111] p-8 text-center shadow-2xl">
        {status === "processing" && (
          <div className="space-y-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold/10 text-gold">
              <RefreshCw size={40} className="animate-spin" />
            </div>
            <h2 className="font-serif text-2xl text-gray-900 dark:text-white">Verifying Payment</h2>
            <p className="text-gray-500 dark:text-gray-400">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-green-500">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="font-serif text-2xl text-gray-900 dark:text-white">Success!</h2>
            <p className="text-gray-500 dark:text-gray-400">{message}</p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
              <AlertCircle size={40} />
            </div>
            <h2 className="font-serif text-2xl text-gray-900 dark:text-white">Payment Issue</h2>
            <p className="text-rose-500 mb-6">{message}</p>
            <button
              onClick={() => router.push(`/orders/${orderId}/payment`)}
              className="w-full bg-gold rounded-xl py-4 text-xs font-bold tracking-widest text-white uppercase transition-all hover:brightness-105"
            >
              Return to Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
