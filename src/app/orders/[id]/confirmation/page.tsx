"use client";

import { PageHero } from "@/app/_components/PageHero";
import { CheckCircle, Package, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { orderService, OrderDetailDto } from "@/services/order.service";

export default function OrderConfirmationPage() {
  const { id } = useParams() as { id: string };
  const [order, setOrder] = useState<OrderDetailDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      orderService.getOrderById(id)
        .then(res => {
          if (res.success) setOrder(res.data);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  return (
    <>
      <PageHero
        title="Order Confirmed"
        subtitle="Thank you for your purchase"
        breadcrumbs={[{ label: "Confirmation" }]}
      />

      <section className="bg-white py-24 transition-colors dark:bg-dark-bg">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-lg rounded-3xl border border-gray-100 p-12 shadow-2xl dark:border-white/5 dark:bg-[#111]">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-50 text-green-500 dark:bg-green-500/10 dark:text-green-400">
              <CheckCircle size={48} />
            </div>
            
            <h2 className="font-serif text-3xl text-gray-900 dark:text-white mb-4">Payment Successful!</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              Your deposit has been successfully processed. We have received your order <br/>
              {loading ? (
                <div className="flex justify-center mt-3">
                  <Loader2 className="animate-spin text-gold" size={16} />
                </div>
              ) : (
                <span className="font-bold text-gray-900 dark:text-white uppercase tracking-[0.2em] mt-3 block text-lg">
                  {order?.orderNumber || id}
                </span>
              )}
            </div>

            <div className="rounded-xl bg-gray-50 p-6 dark:bg-white/5 mb-8">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                You will receive an email confirmation shortly. You can track the status of your order from your profile dashboard.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <Link href={`/orders/${id}/timeline`} className="bg-gold w-full rounded-xl py-4 text-xs font-bold tracking-[0.2em] text-white uppercase transition-all hover:brightness-110 shadow-lg shadow-gold/20">
                View Order Timeline
              </Link>
              <Link href="/collections" className="w-full rounded-xl border border-gray-200 py-4 text-xs font-bold tracking-[0.2em] text-gray-500 uppercase transition-all hover:bg-gray-50 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
