"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const paypalToken = searchParams.get("token");
  const payerId = searchParams.get("PayerID");

  useEffect(() => {
    // If coming from PayPal, we need to capture the payment
    if (paypalToken && payerId) {
      capturePayPal();
    } else {
      setLoading(false);
    }
  }, [paypalToken, payerId]);

  const capturePayPal = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/payments/paypal/capture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          orderId: id,
          payPalOrderId: paypalToken,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to capture PayPal payment.");
      }

      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800">Confirming your payment...</h2>
        <p className="text-gray-500 mt-2">Please do not close this window.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl text-red-600">!</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Capture Failed</h1>
        <p className="text-gray-600 max-w-md mb-8">
          We encountered an issue while processing your PayPal payment. 
          The payment might have been approved but not yet captured.
        </p>
        <div className="flex gap-4">
          <Link 
            href={`/orders/${id}/payment`}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
          >
            Retry Payment
          </Link>
          <Link 
            href="/support"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="mb-8 flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-green-100 rounded-full scale-150 animate-pulse opacity-50"></div>
          <div className="relative bg-green-500 text-white rounded-full p-4">
            <CheckCircle size={48} />
          </div>
        </div>
      </div>

      <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
        Payment Successful!
      </h1>
      <p className="text-lg text-gray-600 mb-12 max-w-lg mx-auto">
        Thank you for your order. We've received your deposit and our craftsmen are getting started on your piece.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href={`/orders/${id}`}
          className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition-all group"
        >
          Track Your Order
          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
        </Link>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
        >
          Continue Shopping
        </Link>
      </div>

      <p className="mt-12 text-sm text-gray-400">
        A confirmation email has been sent to your registered address.
      </p>
    </div>
  );
}
