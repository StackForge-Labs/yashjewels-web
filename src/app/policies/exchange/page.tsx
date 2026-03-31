import { PageHero } from "@/app/_components/PageHero";
import { RefreshCcw, Clock, PackageCheck, AlertTriangle, CheckCircle, ArrowRight, Ban } from "lucide-react";
import Link from "next/link";

export default function ExchangePage() {
    return (
        <>
            <PageHero
                title="Exchange & Return Policy"
                subtitle="We want you to love every piece. If something isn't right, we're here to help."
                breadcrumbs={[{ label: "Policies", href: "/policies/warranty" }, { label: "Exchange & Return" }]}
            />

            <section className="bg-white py-12 md:py-24 transition-colors dark:bg-dark-bg">
                <div className="container mx-auto px-4 lg:px-12">
                    {/* Key Highlights */}
                    <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
                        {[
                            { icon: Clock, title: "7-Day Return Window", desc: "Return or exchange within 7 days of delivery for a full refund." },
                            { icon: RefreshCcw, title: "Easy Exchange", desc: "Swap for a different size, style, or piece of equal or greater value." },
                            { icon: PackageCheck, title: "Free Return Shipping", desc: "We cover return shipping costs for defective or incorrect items." },
                        ].map((item) => (
                            <div key={item.title} className="group rounded-2xl border border-gray-100 p-8 text-center transition-all hover:border-gold/20 hover:shadow-lg dark:border-white/5">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 transition-transform group-hover:scale-110">
                                    <item.icon size={24} className="text-gold" />
                                </div>
                                <h3 className="mb-2 text-base font-bold text-gray-900 dark:text-white">{item.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Return Conditions */}
                    <div className="mb-16">
                        <h2 className="mb-8 font-serif text-2xl md:text-3xl text-gray-900 dark:text-white">Return Conditions</h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <h3 className="flex items-center gap-2 text-sm font-bold text-green-600"><CheckCircle size={16} /> Eligible for Return</h3>
                                {[
                                    "Item is within 7 days of delivery",
                                    "Original packaging and tags are intact",
                                    "Item is unworn and in original condition",
                                    "Accompanied by original receipt or order confirmation",
                                    "Certificate of authenticity is included",
                                ].map((item) => (
                                    <p key={item} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                                        <CheckCircle size={14} className="mt-0.5 shrink-0 text-green-500" /> {item}
                                    </p>
                                ))}
                            </div>
                            <div className="space-y-4">
                                <h3 className="flex items-center gap-2 text-sm font-bold text-red-500"><Ban size={16} /> Not Eligible</h3>
                                {[
                                    "Custom or engraved items",
                                    "Items returned after 7 days",
                                    "Resized rings (unless defective)",
                                    "Items without original packaging",
                                    "Signs of wear, scratches, or damage",
                                ].map((item) => (
                                    <p key={item} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                                        <Ban size={14} className="mt-0.5 shrink-0 text-red-400" /> {item}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Process Steps */}
                    <div className="mb-16">
                        <h2 className="mb-10 font-serif text-2xl md:text-3xl text-gray-900 dark:text-white">Return Process</h2>
                        <div className="relative">
                            <div className="absolute left-6 top-0 hidden h-full w-px bg-gray-200 md:block dark:bg-white/10" />
                            <div className="space-y-8">
                                {[
                                    { step: "1", title: "Initiate Return", desc: "Log in to your account, go to Order History, and click 'Request Return' on the item." },
                                    { step: "2", title: "Upload Evidence", desc: "Take clear photos of the item and any defects. Upload them through the return form." },
                                    { step: "3", title: "Vendor Review", desc: "The vendor will review your request within 24-48 hours and approve or discuss further." },
                                    { step: "4", title: "Ship the Item", desc: "Pack the item securely in original packaging. Use the prepaid shipping label we provide." },
                                    { step: "5", title: "Receive Refund", desc: "Once we receive and inspect the item, your refund is processed within 3-5 business days." },
                                ].map((s) => (
                                    <div key={s.step} className="flex gap-6">
                                        <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold text-sm font-bold text-white shadow-lg shadow-gold/20">
                                            {s.step}
                                        </div>
                                        <div className="pt-2">
                                            <h4 className="mb-1 text-sm font-bold text-gray-900 dark:text-white">{s.title}</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{s.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Refund Timeline */}
                    <div className="mb-16 overflow-x-auto">
                        <h2 className="mb-8 font-serif text-2xl md:text-3xl text-gray-900 dark:text-white">Refund Timeline</h2>
                        <table className="w-full min-w-[500px] text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-white/5">
                                    <th className="py-4 text-left text-[10px] font-bold tracking-widest text-gray-400 uppercase">Payment Method</th>
                                    <th className="py-4 text-left text-[10px] font-bold tracking-widest text-gray-400 uppercase">Refund Time</th>
                                    <th className="py-4 text-left text-[10px] font-bold tracking-widest text-gray-400 uppercase">Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { method: "Credit / Debit Card", time: "5-7 business days", notes: "Refunded to original card" },
                                    { method: "Bank Transfer", time: "3-5 business days", notes: "Refunded to original account" },
                                    { method: "Store Credit", time: "Immediate", notes: "Added to your Yash Jewels wallet" },
                                    { method: "Cash on Delivery", time: "7-10 business days", notes: "Transferred to provided bank details" },
                                ].map((row) => (
                                    <tr key={row.method} className="border-b border-gray-50 dark:border-white/5">
                                        <td className="py-4 font-medium text-gray-900 dark:text-white">{row.method}</td>
                                        <td className="py-4 text-gold font-bold">{row.time}</td>
                                        <td className="py-4 text-gray-500 dark:text-gray-400">{row.notes}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Notice */}
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 md:p-8 dark:border-amber-600/20 dark:bg-amber-900/10">
                        <div className="flex items-start gap-4">
                            <AlertTriangle size={24} className="mt-1 shrink-0 text-amber-500" />
                            <div>
                                <h4 className="mb-2 text-sm font-bold text-amber-800 dark:text-amber-300">Important Notice</h4>
                                <p className="text-sm leading-relaxed text-amber-700 dark:text-amber-400">
                                    For orders cancelled within 24 hours of deposit payment, a full 100% refund is provided. After 24 hours, a 50% processing fee may apply. If the vendor fails to confirm the order within 48 hours, the deposit is automatically refunded in full.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-16 text-center">
                        <Link href="/contact" className="bg-gold group inline-flex items-center gap-3 rounded-xl px-10 py-4 text-[12px] font-bold tracking-[0.3em] text-white uppercase shadow-lg shadow-gold/20 transition-all hover:brightness-105">
                            Need Help? Contact Us <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
