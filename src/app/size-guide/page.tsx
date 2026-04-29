import { PageHero } from "../_components/PageHero";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SizeGuideContent } from "../_components/SizeGuideContent";

export default function SizeGuidePage() {
    return (
        <>
            <PageHero
                title="Size Guide"
                subtitle="Ensure the perfect fit for your precious jewelry with our comprehensive size guide and measurement tips."
                breadcrumbs={[{ label: "Size Guide" }]}
                backgroundImage="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=2000"
            />

            <section className="bg-white py-12 md:py-24 transition-colors dark:bg-dark-bg">
                <div className="container mx-auto px-4 lg:px-12">
                    <SizeGuideContent />

                    {/* Bottom Link */}
                    <div className="mt-24 rounded-3xl bg-gray-900 p-12 text-center md:p-20">
                        <h3 className="mb-4 font-serif text-3xl text-white">Still Unsure?</h3>
                        <p className="mb-8 text-gray-400">Book a private consultation at our boutique and our experts will help you find the perfect size.</p>
                        <Link href="/contact" className="bg-gold group inline-flex items-center gap-3 rounded-xl px-12 py-4 text-[12px] font-bold tracking-[0.3em] text-white uppercase transition-all hover:brightness-110">
                            Book a Consultation <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
