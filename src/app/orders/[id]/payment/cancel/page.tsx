"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { XCircle, ArrowLeft, RefreshCw, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelPage() {
  const { id } = useParams();
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="mb-8 flex justify-center">
        <div className="bg-amber-50 text-amber-500 rounded-full p-5">
          <XCircle size={64} />
        </div>
      </div>

      <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
        Payment Cancelled
      </h1>
      <p className="text-lg text-gray-600 mb-12 max-w-lg mx-auto">
        Your payment session was cancelled. No charges were made to your account. 
        Your order is still saved and waiting for your deposit.
      </p>

      <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-8 mb-12 text-left max-w-xl mx-auto">
        <h4 className="font-semibold text-amber-900 mb-4 flex items-center gap-2">
          <HelpCircle size={18} />
          Common Reasons
        </h4>
        <ul className="space-y-3 text-amber-800/80 text-sm">
          <li className="flex items-start gap-2">
            <span className="mt-1 w-1.5 h-1.5 bg-amber-400 rounded-full shrink-0"></span>
            You changed your mind about the payment method.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 w-1.5 h-1.5 bg-amber-400 rounded-full shrink-0"></span>
            The payment gateway timed out.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 w-1.5 h-1.5 bg-amber-400 rounded-full shrink-0"></span>
            There was an issue with your card or bank.
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href={`/orders/${id}/payment`}
          className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition-all group"
        >
          <RefreshCw className="mr-2 group-hover:rotate-180 transition-transform duration-500" size={20} />
          Try Again
        </Link>
        <Link
          href={`/orders/${id}`}
          className="inline-flex items-center justify-center px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Order
        </Link>
      </div>

      <div className="mt-16 pt-8 border-t border-gray-100">
        <p className="text-gray-500 mb-4">Need help with your payment?</p>
        <Link href="/support" className="text-gold font-medium hover:underline">
          Contact our Concierge Service
        </Link>
      </div>
    </div>
  );
}
