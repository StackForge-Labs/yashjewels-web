import { PageHero } from "@/app/_components/PageHero";
import Link from "next/link";

const SECTIONS = [
    {
        title: "1. Information We Collect",
        content: [
            "Personal identification information (name, email address, phone number, date of birth)",
            "Delivery addresses and billing information",
            "Identity verification documents (CCCD/Passport) for KYC compliance on high-value orders",
            "Payment information (processed securely through third-party providers — we never store card details)",
            "Browsing behavior, search history, and interaction data on our website",
            "Device information, IP address, and browser type for security purposes",
        ],
    },
    {
        title: "2. How We Use Your Information",
        content: [
            "Processing and fulfilling your orders, including delivery and payment",
            "Identity verification (KYC) for orders exceeding 5,000,000 đ as required by regulations",
            "Communicating order updates, shipping notifications, and promotional offers",
            "Improving our website, products, and customer service experience",
            "Preventing fraud, unauthorized access, and securing your account",
            "Complying with legal obligations and resolving disputes",
        ],
    },
    {
        title: "3. Information Sharing",
        content: [
            "Authorized vendors who fulfill your orders (limited to order-relevant details)",
            "Shipping partners (GHN, GHTK) for delivery purposes",
            "Payment processors (Stripe, PayOS) for secure transaction handling",
            "Insurance providers when you opt for order protection",
            "Law enforcement when required by law or to protect our rights",
            "We never sell your personal data to third parties for marketing purposes",
        ],
    },
    {
        title: "4. Data Security",
        content: [
            "All data transmitted via 256-bit SSL/TLS encryption",
            "Passwords hashed using BCrypt with cost factor 12",
            "Sensitive documents (CCCD images) stored with encryption at rest",
            "Regular security audits and vulnerability assessments",
            "Employee access restricted on a need-to-know basis",
            "JWT tokens with short expiry and automatic rotation",
        ],
    },
    {
        title: "5. Cookies & Tracking",
        content: [
            "Essential cookies for authentication and cart functionality",
            "Analytics cookies to understand site usage (anonymized)",
            "No third-party advertising trackers are used on our platform",
            "You can disable cookies in your browser settings, though some features may not work correctly",
        ],
    },
    {
        title: "6. Your Rights",
        content: [
            "Access: Request a copy of all personal data we hold about you",
            "Correction: Update inaccurate or incomplete information in your profile",
            "Deletion: Request permanent deletion of your account and associated data",
            "Portability: Export your data in a machine-readable format",
            "Objection: Opt out of marketing communications at any time",
            "To exercise any of these rights, contact us at privacy@yashjewels.com",
        ],
    },
    {
        title: "7. Data Retention",
        content: [
            "Active accounts: Data retained as long as your account exists",
            "Order records: Retained for 5 years after completion for legal compliance",
            "KYC documents: Retained for 3 years after last verification, then securely deleted",
            "Deleted accounts: Personal data purged within 30 days, anonymized order data retained",
        ],
    },
];

export default function PrivacyPage() {
    return (
        <>
            <PageHero
                title="Privacy Policy"
                subtitle="Your privacy matters to us. This policy explains how we collect, use, and protect your personal information."
                breadcrumbs={[{ label: "Policies", href: "/policies/warranty" }, { label: "Privacy" }]}
            />

            <section className="bg-white py-12 md:py-24 transition-colors dark:bg-dark-bg">
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="mx-auto max-w-3xl">
                        <p className="mb-12 text-sm text-gray-500 dark:text-gray-400">
                            <strong className="text-gray-900 dark:text-white">Last Updated:</strong> March 2026 · <strong className="text-gray-900 dark:text-white">Effective:</strong> March 2026
                        </p>

                        <div className="space-y-12">
                            {SECTIONS.map((section) => (
                                <div key={section.title}>
                                    <h2 className="mb-6 font-serif text-xl text-gray-900 dark:text-white">{section.title}</h2>
                                    <ul className="space-y-3">
                                        {section.content.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {/* Contact */}
                        <div className="mt-16 rounded-2xl border border-gray-100 p-8 text-center dark:border-white/5">
                            <h3 className="mb-3 font-serif text-xl text-gray-900 dark:text-white">Questions About Your Privacy?</h3>
                            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                                Contact our Data Protection team at <strong className="text-gold">privacy@yashjewels.com</strong> or visit our <Link href="/contact" className="text-gold underline hover:no-underline">Contact page</Link>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
