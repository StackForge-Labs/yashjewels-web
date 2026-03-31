import { PageHero } from "@/app/_components/PageHero";
import { CreditCard, Building2, Wallet, Truck, ShieldCheck, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentGuidePage() {
    return (
        <>
            <PageHero
                title="Payment Guide"
                subtitle="Everything you need to know about buying jewelry online with confidence."
                breadcrumbs={[{ label: "Policies", href: "/policies/warranty" }, { label: "Payment Guide" }]}
            />

            <section className="bg-white py-12 md:py-24 transition-colors dark:bg-dark-bg">
                <div className="container mx-auto px-4 lg:px-12">
                    {/* How to Buy - Steps */}
                    <div className="mb-20">
                        <h2 className="mb-10 font-serif text-2xl md:text-3xl text-gray-900 dark:text-white">How to Buy</h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {[
                                { num: "01", title: "Browse & Select", desc: "Explore our collections, use filters to find your perfect piece by category, material, or budget." },
                                { num: "02", title: "Add to Cart", desc: "Select your options (metal, stone type) and add to your shopping cart." },
                                { num: "03", title: "Checkout & Pay", desc: "Enter delivery details, choose insurance, and complete payment securely." },
                                { num: "04", title: "Confirmation", desc: "Our vendor will contact you within 2-4 hours to confirm your order personally." },
                            ].map((s) => (
                                <div key={s.num} className="group rounded-2xl border border-gray-100 p-6 transition-all hover:border-gold/20 hover:shadow-lg dark:border-white/5">
                                    <span className="text-gold mb-4 block text-3xl font-light italic">{s.num}</span>
                                    <h3 className="mb-2 text-sm font-bold text-gray-900 dark:text-white">{s.title}</h3>
                                    <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="mb-20">
                        <h2 className="mb-10 font-serif text-2xl md:text-3xl text-gray-900 dark:text-white">Accepted Payment Methods</h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {[
                                { icon: CreditCard, title: "Credit / Debit Card", desc: "Visa, Mastercard, AMEX. Secured with 3D Secure authentication. Instant processing.", tag: "Most Popular" },
                                { icon: Building2, title: "Bank Transfer", desc: "Transfer directly to our verified bank account. Auto-verified via webhook within minutes.", tag: "Recommended" },
                                { icon: Wallet, title: "Cash on Delivery", desc: "Pay in cash when your order arrives. Available for orders under 2,000,000 đ only.", tag: "Limited" },
                            ].map((m) => (
                                <div key={m.title} className="group rounded-2xl border border-gray-100 p-8 transition-all hover:border-gold/20 dark:border-white/5">
                                    <div className="mb-4 flex items-center justify-between">
                                        <m.icon size={28} className="text-gold" />
                                        <span className="rounded-full bg-gold/10 px-3 py-1 text-[9px] font-bold tracking-widest text-gold uppercase">{m.tag}</span>
                                    </div>
                                    <h3 className="mb-2 text-base font-bold text-gray-900 dark:text-white">{m.title}</h3>
                                    <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{m.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Deposit System */}
                    <div className="mb-20 rounded-2xl border border-gold/10 bg-gold/5 p-8 md:p-12">
                        <h2 className="mb-6 font-serif text-2xl md:text-3xl text-gray-900 dark:text-white">Deposit System</h2>
                        <p className="mb-8 max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                            For high-value jewelry, we use a secure deposit system. This protects both you and the vendor by ensuring commitment before crafting or reserving your piece.
                        </p>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[500px] text-sm">
                                <thead>
                                    <tr className="border-b border-gold/10">
                                        <th className="py-4 text-left text-[10px] font-bold tracking-widest text-gray-400 uppercase">Order Value</th>
                                        <th className="py-4 text-left text-[10px] font-bold tracking-widest text-gray-400 uppercase">Minimum Deposit</th>
                                        <th className="py-4 text-left text-[10px] font-bold tracking-widest text-gray-400 uppercase">Payment Deadline</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gold/5">
                                        <td className="py-4 font-medium text-gray-900 dark:text-white">Under 10,000,000 đ</td>
                                        <td className="py-4 text-gold font-bold">30% or Full Payment</td>
                                        <td className="py-4 text-gray-500">2 hours</td>
                                    </tr>
                                    <tr className="border-b border-gold/5">
                                        <td className="py-4 font-medium text-gray-900 dark:text-white">10,000,000 đ – 50,000,000 đ</td>
                                        <td className="py-4 text-gold font-bold">50%</td>
                                        <td className="py-4 text-gray-500">2 hours</td>
                                    </tr>
                                    <tr>
                                        <td className="py-4 font-medium text-gray-900 dark:text-white">Above 50,000,000 đ</td>
                                        <td className="py-4 text-gold font-bold">100%</td>
                                        <td className="py-4 text-gray-500">2 hours</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {[
                            { icon: ShieldCheck, title: "SSL Encryption", desc: "256-bit SSL secures all transactions" },
                            { icon: CheckCircle, title: "PCI Compliant", desc: "We never store your card details" },
                            { icon: Truck, title: "Insured Delivery", desc: "Every shipment is fully insured" },
                            { icon: AlertCircle, title: "Fraud Protection", desc: "Real-time fraud monitoring on all orders" },
                        ].map((b) => (
                            <div key={b.title} className="flex items-start gap-3 rounded-xl border border-gray-100 p-5 dark:border-white/5">
                                <b.icon size={20} className="text-gold mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-gray-900 dark:text-white">{b.title}</p>
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{b.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <Link href="/collections" className="bg-gold group inline-flex items-center gap-3 rounded-xl px-10 py-4 text-[12px] font-bold tracking-[0.3em] text-white uppercase shadow-lg shadow-gold/20 transition-all hover:brightness-105">
                            Start Shopping <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
