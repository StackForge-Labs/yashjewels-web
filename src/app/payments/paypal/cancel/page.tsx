"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { XCircle, ArrowLeft } from "lucide-react";

export default function PayPalCancelPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-white dark:bg-dark-bg p-4">
      <div className="w-full max-w-md rounded-3xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#111] p-8 text-center shadow-2xl">
        <div className="space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
            <XCircle size={40} />
          </div>
          <h2 className="font-serif text-2xl text-gray-900 dark:text-white">Payment Cancelled</h2>
          <p className="text-gray-500 dark:text-gray-400">
            You have cancelled the PayPal payment. No funds were debited from your account.
          </p>
          <div className="pt-4">
            <button
              onClick={() => router.push(orderId ? `/orders/${orderId}/payment` : "/profile/orders")}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-4 text-xs font-bold tracking-widest text-white uppercase transition-all hover:brightness-105"
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
              Return to Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
