"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axiosInstance from "@/lib/api-client";
import { PageHero } from "@/app/_components/PageHero";
import { ShieldCheck, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api-client";

// Use the public key from env or fallback placeholder for UI testing
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder");

function CheckoutForm({ orderId, amount, paymentType }: { orderId: string, amount: number, paymentType: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      toast.error(error.message || "Payment failed");
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      const successMsg = paymentType === "BALANCE" ? "Remaining balance paid successfully!" : "Deposit paid successfully!";
      toast.success(successMsg);
      // We manually redirect to confirmation.
      // The webhook will handle the DB status update in the background.
      router.push(`/orders/${orderId}/confirmation`);
    } else {
      setIsProcessing(false);
    }
  };

  const btnLabel = paymentType === "BALANCE" ? "Pay Remaining Balance" : "Pay Deposit";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <button
        disabled={isProcessing || !stripe || !elements}
        className="w-full bg-gold disabled:opacity-50 group flex justify-center items-center gap-2 rounded-xl px-8 py-4 text-xs font-bold tracking-[0.2em] text-white uppercase shadow-lg shadow-gold/20 transition-all hover:brightness-105"
      >
        {isProcessing ? "Processing..." : `${btnLabel} (${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)})`}
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
      </button>
      <p className="flex items-center justify-center gap-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
        <Lock size={12} /> Secure Stripe Payment
      </p>
    </form>
  );
}

export default function OrderPaymentPage() {
  const params = useParams();
  const id = params?.id as string;
  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState(0);
  const [paymentType, setPaymentType] = useState("DEPOSIT");
  const [error, setError] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated || !id) return;

    const fetchIntent = async () => {
      try {
        const { data } = await axiosInstance.post("/payments/intent", { orderId: id });
        if (data.success && data.data) {
          setClientSecret(data.data.clientSecret);
          setAmount(data.data.depositAmount);
          setPaymentType(data.data.paymentType || "DEPOSIT");
        } else {
          setError(data.message || "Could not initialize payment");
        }
      } catch (err: any) {
        setError(getErrorMessage(err) || "Could not connect to payment gateway");
      }
    };

    fetchIntent();
  }, [id, isHydrated]);

  if (!isHydrated) return null;

  if (error) {
    return (
      <section className="py-24 text-center">
        <h2 className="text-2xl mb-4 font-serif text-red-500">Payment Error</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="text-gold underline">Try Again</button>
      </section>
    );
  }

  const isBalance = paymentType === "BALANCE";

  return (
    <>
      <PageHero
        title={isBalance ? "Remaining Balance" : "Order Deposit"}
        subtitle={isBalance ? "Finalize your jewelry acquisition" : "Secure your order to proceed"}
        breadcrumbs={[{ label: "Checkout", href: "/checkout" }, { label: "Payment" }]}
      />

      <section className="bg-white py-12 md:py-24 transition-colors dark:bg-dark-bg">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-lg rounded-3xl border border-gray-100 p-8 shadow-2xl dark:border-white/5 dark:bg-[#111]">
            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 text-gold">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-center font-serif text-2xl text-gray-900 dark:text-white mb-2">{isBalance ? "Final Payment" : "Deposit Required"}</h2>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">
              {isBalance 
                ? "Your jewelry is ready for delivery. Please complete the final payment to secure your acquisition."
                : "Please complete your deposit payment to confirm the order. The remaining balance will be requested after vendor processing."}
            </p>

            {clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
                <CheckoutForm orderId={id} amount={amount} paymentType={paymentType} />
              </Elements>
            ) : (
              <div className="flex justify-center p-8">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
