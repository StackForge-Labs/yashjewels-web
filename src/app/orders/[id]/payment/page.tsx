"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axiosInstance from "@/lib/api-client";
import { orderService, OrderDetailDto } from "@/services/order.service";
import { PageHero } from "@/app/_components/PageHero";
import {
  ShieldCheck, Lock, ArrowRight, TimerReset, AlertCircle,
  CreditCard, Wallet, QrCode, CheckCircle2, Copy, RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage, getAccessToken } from "@/lib/api-client";
import Image from "next/image";
import * as signalR from "@microsoft/signalr";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder"
);

type Gateway = "stripe" | "paypal" | "sepay";

interface PaymentIntentData {
  gateway: string;
  paymentType: string;
  depositAmount: number;
  // Stripe
  clientSecret?: string;
  // PayPal
  payPalOrderId?: string;
  payPalApprovalUrl?: string;
  // SePay
  sePayQrImageUrl?: string;
  sePayTransactionCode?: string;
  amountVnd?: number;
}

const formatVND = (v: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);

// ─── Stripe sub-form ─────────────────────────────────────────────────────────
function StripeForm({ orderId, amount, paymentType }: { orderId: string; amount: number; paymentType: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    if (error) {
      toast.error(error.message || "Payment failed");
      setProcessing(false);
    } else if (paymentIntent?.status === "succeeded") {
      toast.success(paymentType === "BALANCE" ? "Balance paid!" : "Deposit paid!");
      router.push(`/orders/${orderId}/payment/success`);
    } else {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-xl overflow-hidden border border-white/10">
        <PaymentElement options={{ layout: "tabs" }} />
      </div>
      <button
        disabled={processing || !stripe || !elements}
        className="w-full bg-gold disabled:opacity-50 flex justify-center items-center gap-2 rounded-xl px-8 py-4 text-xs font-bold tracking-[0.2em] text-white uppercase shadow-lg shadow-gold/20 transition-all hover:brightness-105"
      >
        {processing ? (
          <><RefreshCw size={14} className="animate-spin" /> Processing...</>
        ) : (
          <>{paymentType === "BALANCE" ? "Pay Balance" : "Pay Deposit"} · {formatVND(amount)} <ArrowRight size={14} /></>
        )}
      </button>
      <p className="flex items-center justify-center gap-1.5 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
        <Lock size={11} /> 256-bit SSL · Stripe Secure
      </p>
    </form>
  );
}

// ─── PayPal sub-form ──────────────────────────────────────────────────────────
function PayPalForm({ approvalUrl, payPalOrderId, orderId, amount }: {
  approvalUrl: string; payPalOrderId: string; orderId: string; amount: number;
}) {
  const [capturing, setCapturing] = useState(false);
  const router = useRouter();

  const handleCapture = async () => {
    setCapturing(true);
    try {
      const { data } = await axiosInstance.post("/payments/paypal/capture", {
        orderId, payPalOrderId,
      });
      if (data.success) {
        toast.success("PayPal payment confirmed!");
        router.push(`/orders/${orderId}/payment/success`);
      } else {
        toast.error(data.message || "Capture failed");
      }
    } catch (err: any) {
      toast.error(getErrorMessage(err) || "PayPal capture failed");
    } finally {
      setCapturing(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 text-center">
        <div className="mb-3 flex justify-center">
          <svg viewBox="0 0 124 33" className="h-8" fill="none">
            <path d="M46.21 6.75h-7.4a1 1 0 0 0-1 .85L35 24.13a.6.6 0 0 0 .59.7h3.53a1 1 0 0 0 1-.85l.74-4.7a1 1 0 0 1 1-.85h2.34c4.87 0 7.68-2.36 8.42-7.03.33-2.04.01-3.64-.95-4.76-.95-1.14-2.65-1.69-4.46-1.69zm.85 6.93c-.4 2.65-2.43 2.65-4.4 2.65h-1.11l.78-4.96a.6.6 0 0 1 .6-.51h.51c1.34 0 2.6 0 3.25.76.39.46.5 1.13.37 2.06z" fill="#003087" />
            <path d="M72.83 13.6h-3.54a.6.6 0 0 0-.59.51l-.15.97-.24-.35c-.74-1.08-2.4-1.44-4.04-1.44-3.78 0-7.01 2.86-7.64 6.88-.33 2-.03 3.9 1.07 5.24.88 1.22 2.14 1.73 3.64 1.73 3.05 0 4.74-1.96 4.74-1.96l-.15.95a.6.6 0 0 0 .59.7h3.19a1 1 0 0 0 1-.85l1.92-12.1a.6.6 0 0 0-.6-.48zm-4.9 6.66c-.33 1.97-1.88 3.29-3.87 3.29-1 0-1.79-.32-2.3-.92-.5-.6-.69-1.46-.53-2.41.31-1.95 1.88-3.31 3.85-3.31.97 0 1.76.32 2.28.93.53.62.73 1.48.57 2.42z" fill="#003087" />
            <path d="M92.27 13.6h-3.56a1 1 0 0 0-.84.45l-4.84 7.13-2.05-6.85a1 1 0 0 0-.97-.73H76.5a.6.6 0 0 0-.57.8l3.87 11.35-3.64 5.14a.6.6 0 0 0 .49.95h3.55a1 1 0 0 0 .84-.44l11.68-16.87a.6.6 0 0 0-.45-.93z" fill="#003087" />
          </svg>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
          You will be redirected to PayPal to complete payment of <span className="font-bold text-gray-900 dark:text-white">{formatVND(amount)}</span>.
        </p>
        <p className="text-xs text-gray-400">Amount will be converted to USD at live exchange rate.</p>
      </div>

      <a
        href={approvalUrl}
        className="w-full bg-[#0070BA] hover:bg-[#005ea6] flex justify-center items-center gap-2 rounded-xl px-8 py-4 text-xs font-bold tracking-[0.2em] text-white uppercase shadow-lg shadow-blue-500/20 transition-all"
      >
        Continue to PayPal <ArrowRight size={14} />
      </a>

      <button
        onClick={handleCapture}
        disabled={capturing}
        className="w-full border border-gold/30 text-gold flex justify-center items-center gap-2 rounded-xl px-8 py-3 text-xs font-bold tracking-widest uppercase transition-all hover:bg-gold/5 disabled:opacity-50"
      >
        {capturing ? <><RefreshCw size={12} className="animate-spin" /> Verifying...</> : <>I've Completed PayPal Payment <CheckCircle2 size={14} /></>}
      </button>
    </div>
  );
}

// ─── SePay QR sub-form ────────────────────────────────────────────────────────
function SePayForm({ qrImageUrl, transactionCode, amountVnd, orderId }: {
  qrImageUrl: string; transactionCode: string; amountVnd: number; orderId: string;
}) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [polling, setPolling] = useState(true);
  const [simulating, setSimulating] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(transactionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Polling fallback
  useEffect(() => {
    if (!polling) return;

    const interval = setInterval(async () => {
      try {
        const response = await orderService.getOrderById(orderId);
        if (response.success && response.data) {
          const status = response.data.status.toLowerCase();
          // Redirect if any 'paid' status is detected
          if (["deposit_paid", "processing", "full_payment_paid", "fully_paid", "delivered"].includes(status)) {
            setPolling(false);
            toast.success("Payment detected! Redirecting...");
            router.push(`/orders/${orderId}/payment/success`);
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId, polling, router]);

  // Demo Simulation Handler
  const handleSimulatePayment = async () => {
    setSimulating(true);
    try {
      // Simulate SePay Webhook call to Backend
      const response = await axiosInstance.post("/payments/webhook/sepay", {
        content: transactionCode,
        transferAmount: amountVnd,
        transferType: "in",
        gateway: "VCB", // Mock bank
        id: Math.floor(Math.random() * 1000000).toString(),
        transferDate: new Date().toISOString()
      });

      if (response.status === 200) {
        toast.success("Simulation triggered! Waiting for system update...");
      } else {
        toast.error("Simulation failed. Check console.");
      }
    } catch (err: any) {
      toast.error(getErrorMessage(err) || "Simulation failed");
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* QR Code */}
      <div className="relative flex flex-col items-center rounded-2xl border border-gold/20 bg-gradient-to-b from-gold/5 to-transparent p-6">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white shadow-lg">
          Scan to Pay
        </div>

        {/* QR Image */}
        <div className="mt-2 rounded-2xl border-4 border-white dark:border-white/10 shadow-xl overflow-hidden bg-white">
          <img
            src={qrImageUrl}
            alt="VietQR Payment Code"
            width={220}
            height={220}
            className="block"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(transactionCode)}&bgcolor=ffffff&color=000000&margin=10`;
            }}
          />
        </div>

        {/* Amount badge */}
        <div className="mt-4 rounded-xl bg-gold px-6 py-2.5 shadow-lg shadow-gold/20">
          <span className="text-lg font-black text-white tracking-tight">{formatVND(amountVnd)}</span>
        </div>

        {/* Pulse indicator */}
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          {polling ? "Waiting for payment confirmation..." : "Payment confirmed!"}
        </div>
      </div>

      {/* Transaction Code */}
      <div className="rounded-xl border border-gray-100 dark:border-white/5 p-4 bg-gray-50 dark:bg-white/3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
          Transfer Description (Required)
        </p>
        <div className="flex items-center justify-between gap-3">
          <code className="text-sm font-mono font-bold text-gray-900 dark:text-white tracking-wider">
            {transactionCode}
          </code>
          <button
            onClick={copyCode}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide transition-all ${copied
              ? "bg-green-500/10 text-green-500"
              : "bg-gold/10 text-gold hover:bg-gold/20"
              }`}
          >
            {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <p className="mt-2 text-[11px] text-gray-400 leading-relaxed">
          ⚠️ You <strong>must</strong> include this exact code in your transfer description for automatic verification.
        </p>
      </div>

      {/* Instructions */}
      <div className="rounded-xl border border-gray-100 dark:border-white/5 p-4 space-y-2.5">
        <p className="text-xs font-bold text-gray-700 dark:text-gray-200">How to pay:</p>
        {[
          "Open your banking app and scan the QR code above",
          `Enter amount: ${formatVND(amountVnd)}`,
          `Add the transfer note: "${transactionCode}"`,
          "Confirm the transfer — this page will update automatically",
        ].map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/10 text-[10px] font-bold text-gold">
              {i + 1}
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400">{step}</p>
          </div>
        ))}
      </div>

      {/* Simulation Button (Demo only) */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 pt-4 border-t border-dashed border-gray-200 dark:border-white/10">
          <button
            onClick={handleSimulatePayment}
            disabled={simulating || !polling}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gray-900 dark:bg-white px-4 py-3 text-xs font-bold text-white dark:text-gray-900 transition-all hover:opacity-90 disabled:opacity-50"
          >
            {simulating ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <ShieldCheck size={14} />
            )}
            Simulate Payment (Demo Only)
          </button>
          <p className="mt-2 text-center text-[9px] text-gray-400 italic">
            * This button bypasses real bank transfer for presentation purposes.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Gateway selector ─────────────────────────────────────────────────────────
const GATEWAYS = [
  {
    id: "stripe" as Gateway,
    label: "Card Payment",
    sub: "Visa, Mastercard, AMEX",
    icon: CreditCard,
    color: "from-violet-500/10 to-indigo-500/10",
    border: "border-violet-500/30",
    badge: "bg-violet-500/10 text-violet-400",
    badgeText: "Instant",
  },
  {
    id: "paypal" as Gateway,
    label: "PayPal",
    sub: "Digital wallet · USD",
    icon: Wallet,
    color: "from-blue-500/10 to-sky-500/10",
    border: "border-blue-500/30",
    badge: "bg-blue-500/10 text-blue-400",
    badgeText: "Secure",
  },
  {
    id: "sepay" as Gateway,
    label: "VietQR / Bank Transfer",
    sub: "SePay · VND",
    icon: QrCode,
    color: "from-emerald-500/10 to-teal-500/10",
    border: "border-emerald-500/30",
    badge: "bg-emerald-500/10 text-emerald-400",
    badgeText: "Popular",
  },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function OrderPaymentPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [gateway, setGateway] = useState<Gateway>("stripe");
  const [intentData, setIntentData] = useState<PaymentIntentData | null>(null);
  const [loadingIntent, setLoadingIntent] = useState(false);
  const [error, setError] = useState("");
  const [orderDetail, setOrderDetail] = useState<OrderDetailDto | null>(null);
  const [timeLeft, setTimeLeft] = useState<{ h: number; m: number; s: number } | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // SignalR Realtime Listener
  useEffect(() => {
    if (!isHydrated || !id) return;

    const token = getAccessToken();
    const hubUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5066").replace("/api/v1", "") + "/hubs/order";

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token || ""
      })
      .withAutomaticReconnect()
      .build();

    const startConnection = async () => {
      try {
        await connection.start();
        console.log("SignalR Connected to OrderHub");
        await connection.invoke("SubscribeToOrder", id);
      } catch (err) {
        console.error("SignalR Connection Error: ", err);
      }
    };

    connection.on("ReceiveOrderStatusUpdate", (data: any) => {
      console.log("Realtime Update Received:", data);
      const status = data.newStatus?.toLowerCase();
      if (status === "deposit_paid" || status === "processing" || status === "full_payment_paid" || status === "fully_paid") {
        toast.success("Payment confirmed! Finishing your order...");
        setTimeout(() => {
          router.push(`/orders/${id}/payment/success`);
        }, 1500);
      }
    });

    startConnection();

    return () => {
      connection.stop();
    };
  }, [id, isHydrated, router]);

  useEffect(() => { setIsHydrated(true); }, []);

  // Fetch order info once
  useEffect(() => {
    if (!isHydrated || !id) return;
    orderService.getOrderById(id).then((res) => {
      if (res.success && res.data) setOrderDetail(res.data);
    });
  }, [id, isHydrated]);

  // Balance countdown timer
  useEffect(() => {
    if (intentData?.paymentType !== "BALANCE" || !orderDetail?.remainingDueAt) return;
    const target = new Date(orderDetail.remainingDueAt).getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setTimeLeft({ h: 0, m: 0, s: 0 }); return; }
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [intentData?.paymentType, orderDetail]);

  const fetchIntent = useCallback(async (gw: Gateway) => {
    setLoadingIntent(true);
    setError("");
    setIntentData(null);
    try {
      const { data } = await axiosInstance.post("/payments/intent", { orderId: id, gateway: gw });
      if (data.success && data.data) {
        setIntentData(data.data);
      } else {
        setError(data.message || "Could not initialize payment");
      }
    } catch (err: any) {
      setError(getErrorMessage(err) || "Could not connect to payment gateway");
    } finally {
      setLoadingIntent(false);
    }
  }, [id]);

  // Auto-fetch when gateway changes
  useEffect(() => {
    if (!isHydrated || !id) return;
    fetchIntent(gateway);
  }, [gateway, isHydrated, id, fetchIntent]);

  if (!isHydrated) return null;

  const isBalance = intentData?.paymentType === "BALANCE";
  const amount = intentData?.depositAmount ?? 0;

  return (
    <>
      <PageHero
        title={isBalance ? "Remaining Balance" : "Secure Payment"}
        subtitle={isBalance ? "Finalize your jewelry acquisition" : "Choose your preferred payment method"}
        breadcrumbs={[{ label: "Checkout", href: "/checkout" }, { label: "Payment" }]}
      />

      <section className="bg-white py-12 md:py-20 transition-colors dark:bg-dark-bg">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-xl">

            {/* ── Balance countdown ── */}
            {isBalance && timeLeft && (
              <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 dark:border-amber-900/30 dark:bg-amber-900/10 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <TimerReset className="text-amber-600" size={16} />
                  <h4 className="text-xs font-bold uppercase tracking-widest text-amber-800 dark:text-amber-400">Payment Deadline</h4>
                </div>
                <div className="flex justify-center gap-4 bg-white dark:bg-black/30 rounded-xl p-3 border border-amber-100 dark:border-white/5">
                  {[["HRS", timeLeft.h], ["MIN", timeLeft.m], ["SEC", timeLeft.s]].map(([label, val]) => (
                    <div key={label as string} className="text-center">
                      <span className="font-mono text-2xl font-black text-amber-600">{String(val).padStart(2, "0")}</span>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
                {timeLeft.h === 0 && timeLeft.m === 0 && timeLeft.s === 0 && (
                  <p className="text-rose-500 text-xs font-bold mt-2 text-center flex items-center justify-center gap-1">
                    <AlertCircle size={12} /> Deadline Expired
                  </p>
                )}
              </div>
            )}

            {/* ── Gateway Selector ── */}
            <div className="mb-6 rounded-2xl border border-gray-100 dark:border-white/5 p-1.5 bg-gray-50/50 dark:bg-white/2">
              <p className="px-3 pt-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Select Payment Method
              </p>
              <div className="grid grid-cols-3 gap-2 p-2">
                {GATEWAYS.map((gw) => {
                  const active = gateway === gw.id;
                  return (
                    <button
                      key={gw.id}
                      onClick={() => setGateway(gw.id)}
                      className={`relative flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-all duration-200 ${active
                        ? `bg-gradient-to-b ${gw.color} ${gw.border} shadow-lg scale-[1.02]`
                        : "border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10 bg-white dark:bg-transparent"
                        }`}
                    >
                      {active && (
                        <span className={`absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest ${gw.badge}`}>
                          {gw.badgeText}
                        </span>
                      )}
                      <gw.icon
                        size={20}
                        className={active ? "text-gold" : "text-gray-400"}
                      />
                      <div>
                        <p className={`text-[11px] font-bold ${active ? "text-gray-900 dark:text-white" : "text-gray-500"}`}>
                          {gw.label}
                        </p>
                        <p className="text-[9px] text-gray-400 mt-0.5 hidden sm:block">{gw.sub}</p>
                      </div>
                      {active && (
                        <span className="absolute bottom-1.5 right-1.5">
                          <CheckCircle2 size={10} className="text-gold" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Payment Card ── */}
            <div className="rounded-3xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#111] p-7 shadow-2xl shadow-black/5">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-100 dark:border-white/5">
                <div className="h-12 w-12 rounded-2xl bg-gold/10 flex items-center justify-center shrink-0">
                  <ShieldCheck size={24} className="text-gold" />
                </div>
                <div>
                  <h2 className="font-serif text-lg text-gray-900 dark:text-white">
                    {isBalance ? "Final Payment" : "Deposit Required"}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {isBalance
                      ? "Complete balance to dispatch your order"
                      : "Secures your order with the selected provider"}
                  </p>
                </div>
                {amount > 0 && (
                  <div className="ml-auto text-right shrink-0">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Amount</p>
                    <p className="font-bold text-gray-900 dark:text-white text-base">{formatVND(amount)}</p>
                  </div>
                )}
              </div>

              {/* Error state */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-900/10 p-4 mb-5">
                  <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
                  <button onClick={() => fetchIntent(gateway)} className="mt-2 text-xs font-bold text-gold underline">
                    Retry
                  </button>
                </div>
              )}

              {/* Loading state */}
              {loadingIntent && !error && (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
                  <p className="text-xs text-gray-400">Connecting to {gateway === "sepay" ? "VietQR" : gateway === "paypal" ? "PayPal" : "Stripe"}...</p>
                </div>
              )}

              {/* Payment forms */}
              {!loadingIntent && !error && intentData && (
                <>
                  {gateway === "stripe" && intentData.clientSecret && (
                    <Elements
                      stripe={stripePromise}
                      options={{ clientSecret: intentData.clientSecret, appearance: { theme: "night", variables: { colorPrimary: "#C9A84C" } } }}
                    >
                      <StripeForm orderId={id} amount={amount} paymentType={intentData.paymentType} />
                    </Elements>
                  )}

                  {gateway === "paypal" && intentData.payPalApprovalUrl && (
                    <PayPalForm
                      approvalUrl={intentData.payPalApprovalUrl}
                      payPalOrderId={intentData.payPalOrderId!}
                      orderId={id}
                      amount={amount}
                    />
                  )}

                  {gateway === "sepay" && intentData.sePayQrImageUrl && (
                    <SePayForm
                      qrImageUrl={intentData.sePayQrImageUrl}
                      transactionCode={intentData.sePayTransactionCode!}
                      amountVnd={intentData.amountVnd ?? amount}
                      orderId={id}
                    />
                  )}
                </>
              )}

              {/* Trust badges */}
              <div className="mt-6 pt-5 border-t border-gray-100 dark:border-white/5 flex flex-wrap items-center justify-center gap-3 text-[10px] text-gray-400 font-medium">
                <span className="flex items-center gap-1"><ShieldCheck size={11} className="text-gold" /> AES-256 Encrypted</span>
                <span className="text-gray-200 dark:text-white/10">|</span>
                <span className="flex items-center gap-1"><Lock size={11} /> PCI DSS Compliant</span>
                <span className="text-gray-200 dark:text-white/10">|</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={11} className="text-green-500" /> 3D Secure</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
