"use client";

import { useEffect, useState } from "react";
import { PageHero } from "../_components/PageHero";
import {
    MapPin, CreditCard, Shield, ChevronRight, Check,
    Truck, ShieldCheck, ArrowRight, Package, Gift,
    AlertTriangle, Lock, X,
    Phone,
    Zap,
    Briefcase,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useCart } from "@/hooks/useCart";
import axiosInstance from "@/lib/api-client";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useUpdateProfile } from "@/hooks/useUser";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";
import AddressSection from "./_components/AddressSection";
import { UserAddressDto } from "@/types/user.types";
import { BiometricCapture } from "../auth/kyc/_components/BiometricCapture";

const STEPS = ["Address", "Insurance", "Payment", "Review"];

export default function CheckoutPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
    const { cart, fetchCart } = useCart();
    const searchParams = useSearchParams();
    const selectedItemIds = searchParams.get("items")?.split(",") || [];

    // Filter items based on selection from cart
    const checkoutItems = selectedItemIds.length > 0
        ? cart.items.filter(item => selectedItemIds.includes(item.cartItemId))
        : cart.items;

    // Recalculate total for only selected items
    const checkoutTotalLiveMrp = checkoutItems.reduce((acc, item) => acc + (item.currentLiveMrp * item.quantity), 0);

    const updateProfile = useUpdateProfile();

    const [step, setStep] = useState(0);
    const [insurance, setInsurance] = useState("none");
    const [payment, setPayment] = useState("card");
    const [shipping, setShipping] = useState<"standard" | "priority">("standard");
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    // Coupon states
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
    const [couponError, setCouponError] = useState("");
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

    // Form states
    const [selectedAddress, setSelectedAddress] = useState<UserAddressDto | null>(null);
    const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
    const [estimatedDistance, setEstimatedDistance] = useState<number | null>(null);
    const [isInternationalAddress, setIsInternationalAddress] = useState(false);
    const [idempotencyKey] = useState(() => crypto.randomUUID());
    const [isFaceScanning, setIsFaceScanning] = useState(false);
    const [isBiometricVerified, setIsBiometricVerified] = useState(false);

    // Derived: is the selected address a gift address?
    const isGift = selectedAddress?.isGift ?? false;

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // Seed estimatedDistance from DB value as soon as address is selected (before Mapbox geocoding)
    useEffect(() => {
        if (!selectedAddress) return;
        const isVietnamAddr = /(viet nam|vietnam|ho chi minh|ha noi|da nang|hai phong|city|province|district)/i.test(
            [selectedAddress.province, selectedAddress.district, selectedAddress.addressLine1].join(' ')
        );
        setIsInternationalAddress(!isVietnamAddr);
        // Note: We used to seed from DB distanceKm here, but it caused stale/wrong shipping fees to show
        // until Mapbox finished. Now we wait for onDistanceChange from AddressSection for accuracy.
    }, [selectedAddress]);

    // Handle COD constraints (Limit 80 USD)
    useEffect(() => {
        const insuranceFee = getInsuranceFee(insurance);
        const currentTotal = checkoutTotalLiveMrp + insuranceFee;
        if (currentTotal > 80 && payment === "cod") {
            setPayment("card");
        }
    }, [insurance, checkoutTotalLiveMrp, payment]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    };

    // Calculate dynamic insurance fees based on cart total
    const getInsuranceFee = (type: string) => {
        const total = checkoutTotalLiveMrp;
        if (type === "shipping") return Math.round(total * 0.005); // 0.5%
        if (type === "full") return Math.round(total * 0.015);    // 1.5%
        return 0;
    };

    const insuranceFee = getInsuranceFee(insurance);
    const vatAmount = 0;

    // Apply Coupon Discount
    let discountAmount = 0;
    if (appliedCoupon && checkoutTotalLiveMrp > 0) {
        if (appliedCoupon.minOrderAmount && checkoutTotalLiveMrp < appliedCoupon.minOrderAmount) {
            // Does not meet minimum order required. Silently fail discount here but we shouldn't apply it anyway
        } else {
            if (appliedCoupon.discountType === 0) { // percentage
                discountAmount = (checkoutTotalLiveMrp * appliedCoupon.discountValue) / 100;
            } else if (appliedCoupon.discountType === 1) { // fixed
                discountAmount = appliedCoupon.discountValue;
            }
            if (discountAmount > checkoutTotalLiveMrp) discountAmount = checkoutTotalLiveMrp;
        }
    }

    const getShippingEstimate = (distance: number, type: "standard" | "priority", isInternational: boolean = false) => {
        const priority = type === "priority";
        if (isInternational) {
            return {
                cost: 150 + (priority ? 50 : 0),
                method: priority ? "Priority Global Express" : "International VIP Transport",
                description: priority ? "Next-flight-out Secure Air Transport" : "FedEx/DHL Secure Transport with Insurance",
                eta: priority ? "3 - 5 Business Days" : "7 - 10 Business Days",
                distance,
                isPriority: priority
            };
        }
        if (distance < 15) {
            return {
                cost: 0 + (priority ? 10 : 0),
                method: priority ? "Priority Urban Express" : "Urban VIP Delivery",
                description: priority ? "Dedicated Instant Dispatch" : "Complimentary White-glove Service",
                eta: priority ? "2 - 4 Hours" : "12 - 24 Hours",
                distance,
                isPriority: priority
            };
        }
        if (distance < 50) {
            return {
                cost: 20 + (priority ? 10 : 0),
                method: priority ? "Priority Suburban Express" : "Suburban Secure Delivery",
                description: priority ? "Direct Dedicated Armored Car" : "In-house Armored Fleet Delivery",
                eta: priority ? "6 - 12 Hours" : "1 - 2 Days",
                distance,
                isPriority: priority
            };
        }
        if (distance < 150) {
            return {
                cost: 60 + (priority ? 15 : 0),
                method: priority ? "Priority Regional Express" : "Inter-provincial VIP Transport",
                description: priority ? "Dedicated Security Team" : "Dedicated Security Escort",
                eta: priority ? "24 Hours" : "2 - 3 Days",
                distance,
                isPriority: priority
            };
        }
        return {
            cost: 100 + (priority ? 25 : 0),
            method: priority ? "Priority Airline Express" : "Airline Secure Courier",
            description: priority ? "Hand-carried Security Staff" : "3rd Party Insured Airline Transport",
            eta: priority ? "2 Days" : "3 - 5 Days",
            distance,
            isPriority: priority
        };
    };

    // shipping estimate — only compute when we have a real distance from Mapbox routing
    const shippingEstimate = estimatedDistance !== null
        ? getShippingEstimate(estimatedDistance, shipping, isInternationalAddress)
        : null;

    const shippingFee = shippingEstimate ? shippingEstimate.cost : 0;
    
    // VAT calculation: Additive (Tax = Price * Rate/100)
    const calculatedVat = (checkoutTotalLiveMrp * cart.vatRate) / 100;
    
    const grandTotal = checkoutTotalLiveMrp + calculatedVat + insuranceFee + shippingFee - discountAmount;

    // Calculate dynamic deposit based on exact backend logic
    const baseTotalForDeposit = checkoutTotalLiveMrp + calculatedVat - discountAmount;
    
    const getDepositRequired = () => {
        if (baseTotalForDeposit >= 2000) return baseTotalForDeposit + insuranceFee + shippingFee; // 100%
        if (baseTotalForDeposit >= 1000) return (baseTotalForDeposit * 0.5) + insuranceFee + shippingFee; // 50%
        return (baseTotalForDeposit * 0.3) + insuranceFee + shippingFee; // 30%
    };
    const depositAmount = getDepositRequired();
    const depositPct = baseTotalForDeposit >= 2000 ? "100%" : baseTotalForDeposit >= 1000 ? "50%" : "30%";

    // KYC Tier System logic
    const kycStatus = user?.kycStatus?.toLowerCase();
    const isKycApproved = kycStatus === "verified" || kycStatus === "approved";

    // Level 1 Error (Missing Profile KYC) - MOVED TO RENDER BLOCK

    const handlePlaceOrder = async () => {
        if (step !== 3) {
            setStep(3);
            return;
        }

        if (!selectedAddress) {
            toast.error("Please select a shipping address.");
            setStep(0);
            return;
        }

        setIsPlacingOrder(true);
        try {
            const { data } = await axiosInstance.post("/user-orders", {
                shippingName: selectedAddress.recipientName,
                shippingPhone: selectedAddress.recipientPhone,
                shippingAddressId: selectedAddress.id,
                idempotencyKey,
                insuranceType: insurance,
                couponCode: appliedCoupon ? couponCode : undefined,
                shippingFee: shippingFee,
                estimatedDistanceKm: estimatedDistance,
                paymentMethod: payment,
                pay100Percent: depositPct === "100%",
                cartItemIds: selectedItemIds.length > 0 ? selectedItemIds : undefined
            });

            if (data.success) {
                toast.success("Order Created Successfully!");
                await fetchCart();
                router.push(`/orders/${data.data.orderId}/payment`);
            } else {
                toast.error(data.message || "Failed to create order.");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Checkout Blocked.");
        } finally {
            setIsPlacingOrder(false);
        }
    };

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setIsApplyingCoupon(true);
        setCouponError("");
        try {
            const { data } = await axiosInstance.post("/coupons/validate", {
                code: couponCode,
                orderTotal: checkoutTotalLiveMrp
            });
            if (data.success && data.data?.isValid) {
                setAppliedCoupon(data.data.coupon);
                toast.success("Coupon applied successfully");
            } else {
                setCouponError(data.data?.message || "Invalid coupon");
                setAppliedCoupon(null);
            }
        } catch (err: any) {
            setCouponError(err.response?.data?.message || "Invalid coupon");
            setAppliedCoupon(null);
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handleNextStep = () => {
        if (isAddressFormOpen) {
            toast.error("Please save your address before continuing.");
            return;
        }

        if (step === 0 && !selectedAddress) {
            toast.error("Please select a shipping address to continue.");
            return;
        }

        // Tier 2 eKYC Face Scan trigger
        if (step === 2 && grandTotal > 20000000 && !isBiometricVerified) {
            setIsFaceScanning(true);
            return;
        }

        setStep(step + 1);
    };

    const handleFaceScanSuccess = async (file: File) => {
        // Here we would normally upload the scan for server-side Liveness check
        // For checkout flow, we verify if it matches the current user's profile
        toast.loading("Verifying Biometrics...");

        try {
            const formData = new FormData();
            formData.append("file", file); // Must match IFormFile parameter name in backend

            // Call high-security endpoint for checkout verification
            const { data } = await axiosInstance.post("/user/kyc/verify-liveness", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            toast.dismiss();
            setIsFaceScanning(false);

            if (data?.success || data?.isMatch) {
                toast.success("Biometric verification successful. Identity matches KYC record.");
                setIsBiometricVerified(true);
                setStep(3); // Move to review step
            } else {
                toast.error("Biometric verification failed: Identity mismatch. Please try again.");
            }
        } catch (err: any) {
            toast.dismiss();
            toast.error(err.response?.data?.message || "Biometric verification failed. Please check your connection and try again.");
        }
    };

    // Conditional render for Level 1 KYC
    if (grandTotal >= 500 && !isKycApproved) {
        return (
            <>
                <PageHero
                    title="Action Required"
                    subtitle="Identity verification is required for high-value jewelry checkout."
                    breadcrumbs={[{ label: "Cart", href: "/cart" }, { label: "Verification Required" }]}
                />
                <section className="bg-white py-24 transition-colors dark:bg-[#050505]">
                    <div className="container mx-auto px-4 text-center">
                        <div className="mx-auto max-w-lg rounded-3xl border border-gold/20 bg-gold/5 p-12 shadow-2xl backdrop-blur-sm">
                            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl dark:bg-[#111]">
                                <Lock className="text-gold" size={40} />
                            </div>
                            <h2 className="font-serif text-3xl text-gray-900 dark:text-white">Security Check</h2>
                            <p className="mt-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                                To protect our clients and maintain the integrity of our Maison, we require identity verification for all jewelry purchases over <span className="font-bold text-gray-900 dark:text-white">5,000,000 USD</span>.
                            </p>

                            <div className="mt-10 flex flex-col gap-4">
                                <Link href="/auth/kyc" className="bg-gold rounded-xl py-4 text-xs font-bold tracking-[0.2em] text-white uppercase transition-all hover:brightness-110 shadow-lg shadow-gold/20">
                                    Verify My Identity Now
                                </Link>
                                <Link href="/cart" className="rounded-xl border border-gray-100 py-4 text-xs font-bold tracking-[0.2em] text-gray-500 uppercase transition-all hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/5">
                                    Return to Shopping Bag
                                </Link>
                            </div>

                            <p className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                <ShieldCheck size={14} /> Bank Grade Encryption Protected
                            </p>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    if (checkoutItems.length === 0) {
        return (
            <section className="py-24 text-center">
                <h2 className="text-2xl mb-4 font-serif">Your Cart is Empty or no items selected</h2>
                <Link href="/cart" className="text-gold">Return to Cart</Link>
            </section>
        );
    }


    return (
        <>
            <PageHero
                title="Checkout"
                subtitle="Complete your order securely"
                breadcrumbs={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]}
            />

            <section className="bg-white py-12 md:pt-12 md:pb-24 transition-colors dark:bg-dark-bg">
                <div className="container mx-auto px-4 lg:px-12">
                    {/* Progress Steps */}
                    <div className="mx-auto mb-12 flex max-w-2xl items-center justify-between">
                        {STEPS.map((s, i) => (
                            <div key={s} className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (i < step) setStep(i);
                                    }}
                                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${i <= step
                                        ? "bg-gold text-white shadow-lg shadow-gold/20"
                                        : "border border-gray-200 text-gray-400 dark:border-white/10"
                                        } ${i < step ? "cursor-pointer hover:scale-110" : i > step ? "cursor-not-allowed opacity-60" : "cursor-default"}`}
                                >
                                    {i < step ? <Check size={14} /> : i + 1}
                                </button>
                                <span className={`hidden text-[11px] font-bold tracking-widest uppercase md:block ${i <= step ? "text-gray-900 dark:text-white" : "text-gray-400"}`}>
                                    {s}
                                </span>
                                {i < STEPS.length - 1 && (
                                    <div className={`mx-2 hidden h-px w-8 md:block lg:w-16 ${i < step ? "bg-gold" : "bg-gray-200 dark:bg-white/10"}`} />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-7">
                            {/* Step 1: Address */}
                            {step === 0 && (
                                <div className="space-y-8">
                                    <AddressSection
                                        selectedId={selectedAddress?.id}
                                        onSelect={(addr) => {
                                            setSelectedAddress(addr);
                                            // We no longer immediately set distance from DB to avoid stale expensive shipping display
                                        }}
                                        onFormToggle={(isOpen) => setIsAddressFormOpen(isOpen)}
                                        onDistanceChange={(distance, isIntl) => {
                                            setEstimatedDistance(distance);
                                            setIsInternationalAddress(isIntl ?? false);
                                        }}
                                    />

                                    {selectedAddress && !isAddressFormOpen && (
                                        <div className="rounded-2xl border border-gray-100 p-6 md:p-8 dark:border-white/5 animate-in fade-in slide-in-from-bottom-4">
                                            <div className="flex items-center gap-3">
                                                <Truck size={20} className="text-gold" />
                                                <h2 className="font-serif text-xl text-gray-900 dark:text-white">Delivery Method</h2>
                                            </div>
                                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-lg">Choose your preferred delivery speed. Priority Express ensures your items are dispatched immediately with a dedicated courier.</p>

                                            <div className="mt-6 p-4 rounded-xl border border-gold/20 bg-gold/5 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${shipping === "priority" ? 'bg-gold text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-500'} transition-colors`}>
                                                        <Zap size={18} fill={shipping === "priority" ? "currentColor" : "none"} />
                                                    </div>
                                                    <div>
                                                        <h5 className="text-sm font-bold text-gray-900 dark:text-white">Priority Express Delivery</h5>
                                                        <p className="text-[11px] text-gray-500">Premium security & immediate dispatch</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setShipping(shipping === "priority" ? "standard" : "priority")}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${shipping === "priority" ? 'bg-gold' : 'bg-gray-300 dark:bg-white/10'}`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${shipping === "priority" ? 'translate-x-6' : 'translate-x-1'}`}
                                                    />
                                                </button>
                                            </div>

                                            {shippingEstimate && (
                                                <div className={`mt-4 rounded-xl border p-5 flex flex-col md:flex-row gap-5 items-start md:items-center animate-in fade-in slide-in-from-bottom-4 shadow-sm transition-all duration-300 ${shippingEstimate.isPriority ? 'bg-red-50/50 border-red-200 dark:bg-red-500/5 dark:border-red-500/20' : 'bg-gray-50 border-gold/30 dark:bg-gold/5 dark:border-gold/20'}`}>
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border transition-all ${shippingEstimate.isPriority ? 'bg-red-100 border-red-200 text-red-600' : 'bg-gold/10 border-gold/20 text-gold'}`}>
                                                        {shippingEstimate.isPriority ? <Zap size={22} fill="currentColor" /> : <Briefcase size={22} />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-[13px] font-bold text-gray-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
                                                            {shippingEstimate.method}
                                                            {shippingEstimate.isPriority && (
                                                                <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-sm tracking-wider font-semibold animate-pulse">PRIORITY</span>
                                                            )}
                                                            {shippingEstimate.cost === 0 && !shippingEstimate.isPriority && (
                                                                <span className="text-[10px] bg-gold text-white px-2 py-0.5 rounded-sm tracking-wider font-semibold">COMPLIMENTARY</span>
                                                            )}
                                                        </h4>
                                                        <p className="text-[13px] text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">{shippingEstimate.description}</p>
                                                        <div className="flex items-center gap-4 mt-2.5 text-[11px] font-medium text-gray-500 uppercase tracking-wide">
                                                            <div className="flex items-center gap-1.5"><MapPin size={13} className="text-gray-400" /> Distance: {isInternationalAddress ? "International" : (typeof shippingEstimate.distance === 'number' ? `${shippingEstimate.distance.toFixed(1)} km` : "--")}</div>
                                                            <div className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-green-500" /> ETA: {shippingEstimate.eta}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-left md:text-right shrink-0 mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-200 dark:border-white/10 w-full md:w-auto">
                                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Shipping Fee</div>
                                                        <div className="text-xl font-light text-gray-900 dark:text-white">
                                                            {shippingEstimate.cost === 0 ? "FREE" : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(shippingEstimate.cost)}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Step 2: Insurance */}
                            {step === 1 && (
                                <div className="space-y-6 rounded-2xl border border-gray-100 p-6 md:p-8 dark:border-white/5">
                                    <div className="flex items-center gap-3">
                                        <Shield size={20} className="text-gold" />
                                        <h2 className="font-serif text-xl text-gray-900 dark:text-white">Order Protection</h2>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg">Choose a protection plan for your precious items during transit and after delivery. Protect your luxury acquisition from the moment it leaves our Maison.</p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mt-4">
                                        {[
                                            {
                                                id: "none",
                                                title: "Standard",
                                                desc: "Standard transit care with baseline security.",
                                                price: "Free",
                                                icon: Package,
                                                features: ["3-Day Return & Refund", "Secure Seal Packaging", "Exempt from Accidental Damage"],
                                                isPopular: false
                                            },
                                            {
                                                id: "shipping",
                                                title: "Transit Shield",
                                                desc: "Immediate protection for transit-related risks.",
                                                price: `+${formatCurrency(getInsuranceFee("shipping"))}`,
                                                icon: Truck,
                                                features: ["7-Day Return & Refund", "Fast-track 100% Refund", "Transit Loss Guarantee"],
                                                isPopular: false
                                            },
                                            {
                                                id: "full",
                                                title: "Ultra Care",
                                                desc: "Comprehensive protection & lifetime maintenance.",
                                                price: `+${formatCurrency(getInsuranceFee("full"))}`,
                                                icon: ShieldCheck,
                                                features: ["30-Day Elite Return & Refund", "12-Month Structural Warranty", "2-Year Professional Polishing"],
                                                isPopular: true
                                            },
                                        ].map((opt) => (
                                            <button
                                                key={opt.id}
                                                onClick={() => setInsurance(opt.id)}
                                                className={`relative flex flex-col items-start gap-4 rounded-2xl border-2 p-5 lg:p-6 text-left transition-all ${insurance === opt.id
                                                    ? "border-gold bg-gold/5 shadow-xl shadow-gold/10 scale-[1.02]"
                                                    : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50 dark:border-white/5 dark:bg-[#111] dark:hover:border-white/10 dark:hover:bg-white/5"
                                                    }`}
                                            >
                                                {opt.isPopular && (
                                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white shadow-lg">
                                                        Most Popular
                                                    </span>
                                                )}
                                                <div className={`flex w-full items-center justify-between`}>
                                                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${insurance === opt.id ? "bg-gold text-white" : "bg-gray-50 text-gray-400 dark:bg-white/5"}`}>
                                                        <opt.icon size={22} />
                                                    </div>
                                                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all ${insurance === opt.id ? "border-gold" : "border-gray-300 dark:border-gray-600"}`}>
                                                        {insurance === opt.id && <div className="h-2 w-2 rounded-full bg-gold" />}
                                                    </div>
                                                </div>

                                                <div className="w-full mt-2">
                                                    <p className="text-base font-bold text-gray-900 dark:text-white capitalize">{opt.title}</p>
                                                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 h-10">{opt.desc}</p>
                                                    {!isGift && (
                                                        <p className={`mt-3 text-lg font-black tracking-tight ${insurance === opt.id ? "text-gold" : "text-gray-900 dark:text-white"}`}>
                                                            {opt.price}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="mt-4 w-full space-y-2 border-t border-gray-100/50 pt-4 dark:border-white/5">
                                                    {opt.features.map((feature, i) => (
                                                        <p key={i} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                            <Check size={12} className={insurance === opt.id ? "text-gold" : "text-gray-300 dark:text-gray-600"} />
                                                            {feature}
                                                        </p>
                                                    ))}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Payment */}
                            {step === 2 && (
                                <div className="space-y-4 rounded-2xl border border-gray-100 p-6 md:p-8 dark:border-white/5">
                                    <div className="flex items-center gap-3">
                                        <CreditCard size={20} className="text-gold" />
                                        <h2 className="font-serif text-xl text-gray-900 dark:text-white">Payment Method</h2>
                                    </div>

                                    {[
                                        { id: "card", title: "Credit / Debit Card", desc: "Visa, Mastercard, AMEX", disabled: false },
                                        { id: "bank", title: "Bank Transfer", desc: "Direct bank transfer with auto-verification", disabled: false },
                                        { id: "cod", title: "Cash on Delivery", desc: "Available for orders under $80", disabled: grandTotal > 80 },
                                    ].map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => !opt.disabled && setPayment(opt.id)}
                                            disabled={opt.disabled}
                                            className={`flex w-full items-center gap-4 rounded-xl border-2 p-5 text-left transition-all ${payment === opt.id
                                                ? "border-gold bg-gold/5"
                                                : opt.disabled
                                                    ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed dark:border-white/5 dark:bg-white/5"
                                                    : "border-gray-100 hover:border-gray-200 dark:border-white/5 dark:hover:border-white/10"
                                                }`}
                                        >
                                            <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${payment === opt.id ? "border-gold" : "border-gray-300 dark:border-white/20"}`}>
                                                {payment === opt.id && <div className="h-2.5 w-2.5 rounded-full bg-gold" />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{opt.title}</p>
                                                    {opt.disabled && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter line-through">Disabled</span>}
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{opt.desc}</p>
                                            </div>
                                        </button>
                                    ))}

                                    {/* Deposit Info */}
                                    <div className="mt-4 rounded-xl bg-gold/5 border border-gold/10 p-5">
                                        <div className="flex items-center justify-between mb-4 border-b border-gold/10 pb-4">
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white capitalize">Settlement Preference</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {isGift ? "Standard settlement applies for gift orders." : "Your deposit requirement is calculated based on the order value."}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">Required Deposit: {depositPct}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">
                                            {isGift
                                                ? "As the sender, you are responsible for the deposit. The recipient will receive the gift fully paid once you complete the final balance."
                                                : "For orders above $1,000, you may choose to pay a deposit and complete the remaining payment after vendor confirms your order."}
                                        </p>
                                        <div className="flex justify-between items-center rounded-lg bg-gold text-white px-4 py-3 font-bold text-sm">
                                            <span>To Pay Now:</span>
                                            <span>{formatCurrency(depositAmount)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Review */}
                            {step === 3 && (
                                <div className="space-y-6 rounded-2xl border border-gray-100 p-6 md:p-8 dark:border-white/5">
                                    <h2 className="font-serif text-xl text-gray-900 dark:text-white">Review Your Order</h2>

                                    <div className="space-y-4">
                                        {/* Address Row */}
                                        <div className="flex items-start gap-4 rounded-xl bg-gray-50 p-5 dark:bg-white/5 border border-transparent hover:border-gold/30 transition-colors cursor-pointer" onClick={() => setStep(0)}>
                                            <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-gold/10 text-gold">
                                                <MapPin size={18} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">Delivery Address</p>
                                                    <span className="text-gold text-[10px] font-bold uppercase tracking-widest hover:underline">Edit</span>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                                    {selectedAddress ? (
                                                        <>
                                                            <span className="font-medium text-gray-700 dark:text-gray-300">{selectedAddress.recipientName}</span> — {selectedAddress.recipientPhone} <br />
                                                            {selectedAddress.addressLine1}, {selectedAddress.ward}, {selectedAddress.district}, {selectedAddress.province}
                                                        </>
                                                    ) : (
                                                        <span className="text-red-500">Not selected</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Insurance Row */}
                                        <div className="flex items-start gap-4 rounded-xl bg-gray-50 p-5 dark:bg-white/5 border border-transparent hover:border-gold/30 transition-colors cursor-pointer" onClick={() => setStep(1)}>
                                            <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-gold/10 text-gold">
                                                <ShieldCheck size={18} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">Order Protection</p>
                                                    <span className="text-gold text-[10px] font-bold uppercase tracking-widest hover:underline">Edit</span>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                                    Plan: <span className="capitalize font-medium text-gray-700 dark:text-gray-300">{insurance === "none" ? "No Insurance" : insurance + " Protection"}</span><br />
                                                    {insurance === "none" ? "Standard delivery at your own risk." : "Covered against transit loss or damage."}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Payment Row */}
                                        <div className="flex items-start gap-4 rounded-xl bg-gray-50 p-5 dark:bg-white/5 border border-transparent hover:border-gold/30 transition-colors cursor-pointer" onClick={() => setStep(2)}>
                                            <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-gold/10 text-gold">
                                                <CreditCard size={18} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">Payment Method</p>
                                                    <span className="text-gold text-[10px] font-bold uppercase tracking-widest hover:underline">Edit</span>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                                    Method: <span className="capitalize font-medium text-gray-700 dark:text-gray-300">{payment.replace("-", " ")}</span><br />
                                                    {payment === "cod" ? "Pay securely upon delivery." : isGift ? "Secure checkout enabled." : `A deposit of ${depositPct} is required to secure the order.`}
                                                </p>
                                            </div>
                                        </div>

                                        {isGift && (
                                            <div className="flex items-start gap-4 rounded-xl bg-gold/5 p-5 border border-gold/10">
                                                <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-gold/10 text-gold">
                                                    <Gift size={18} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">Gift Details</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                                        <span className="font-medium text-gray-700 dark:text-gray-300">Recipient Email:</span> {selectedAddress?.recipientEmail} <br />
                                                        {selectedAddress?.giftMessage && (
                                                            <>
                                                                <span className="font-medium text-gray-700 dark:text-gray-300">Message:</span> "{selectedAddress.giftMessage}"
                                                            </>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Trust Elements UI */}
                                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 flex flex-col gap-4 text-center md:flex-row md:items-center md:justify-between md:text-left">
                                        <div className="flex items-center justify-center gap-2 text-xs font-medium text-gray-500">
                                            <ShieldCheck size={16} className="text-gold" />
                                            Stripe Secure Payments AES-256
                                        </div>
                                        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-400">
                                            <Link href="/policies/exchange" className="hover:text-gold transition-colors">Exchange</Link>
                                            <span>•</span>
                                            <Link href="/policies/payment-guide" className="hover:text-gold transition-colors">Payment Guide</Link>
                                            <span>•</span>
                                            <Link href="/policies/privacy" className="hover:text-gold transition-colors">Privacy</Link>
                                            <span>•</span>
                                            <Link href="/policies/warranty" className="hover:text-gold transition-colors">Warranty</Link>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="mt-8 flex justify-between">
                                <button
                                    onClick={() => setStep(Math.max(0, step - 1))}
                                    className={`flex items-center gap-2 rounded-xl border border-gray-200 px-6 py-3 text-xs font-bold tracking-wider text-gray-600 uppercase transition-colors hover:bg-gray-50 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5 ${step === 0 ? "invisible" : ""}`}
                                >
                                    Back
                                </button>
                                {step < STEPS.length - 1 ? (
                                    <button
                                        onClick={handleNextStep}
                                        disabled={step === 0 && (!selectedAddress || isAddressFormOpen)}
                                        className="bg-gold group flex items-center gap-2 rounded-xl px-8 py-3 text-xs font-bold tracking-[0.2em] text-white uppercase shadow-lg shadow-gold/20 transition-all hover:brightness-105 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                                    >
                                        Continue <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={isPlacingOrder || cart.checkoutBlocked}
                                        className="bg-gold disabled:opacity-50 disabled:cursor-not-allowed group flex items-center gap-2 rounded-xl px-8 py-3 text-xs font-bold tracking-[0.2em] text-white uppercase shadow-lg shadow-gold/20 transition-all hover:brightness-105"
                                    >
                                        {isPlacingOrder ? "Placing..." : "Place Order"} <Check size={14} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-5">
                            <div className="sticky top-32 rounded-2xl border border-gray-100 bg-gray-50/50 p-6 md:p-8 dark:border-white/5 dark:bg-white/2">
                                <h3 className="mb-6 font-serif text-lg text-gray-900 dark:text-white">Order Summary</h3>

                                <div className="mb-6 space-y-3">
                                    {checkoutItems.map((item) => (
                                        <div key={item.cartItemId} className="flex items-center gap-3">
                                            <img src={item.primaryImageUrl || "/images/placeholder-jewelry.png"} alt={item.productName} className="h-12 w-12 rounded-lg object-cover" />
                                            <div className="flex-1 text-sm">
                                                <p className="line-clamp-1 font-medium text-gray-900 dark:text-white">{item.productName}</p>
                                                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(item.currentLiveMrp)}</p>
                                        </div>
                                    ))}
                                </div>

                                {isGift && (
                                    <div className="mt-4 mb-6 rounded-2xl border border-gold/20 bg-gold/5 px-5 py-4 flex items-center gap-3">
                                        <div className="shrink-0 w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center">
                                            <Gift size={16} className="text-gold" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-800 dark:text-white">Gift Order Active</p>
                                            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed mt-0.5">
                                                Pricing is visible to you only. The recipient will receive a gift receipt without any price information.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-3 border-t border-gray-100 pt-4 dark:border-white/5">
                                    <div className="justify-between text-sm text-gray-500 flex"><span>Subtotal</span><span className="text-gray-900 dark:text-white">{formatCurrency(checkoutTotalLiveMrp)}</span></div>
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Shipping ({shipping === "priority" ? "Priority" : "Standard"})</span>
                                        <span className={!shippingEstimate ? "text-gray-400" : shippingFee === 0 ? "text-green-600 font-medium" : "text-gray-900 dark:text-white"}>
                                            {!shippingEstimate ? "-" : shippingFee === 0 ? "Free" : formatCurrency(shippingFee)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Insurance ({insurance})</span>
                                        <span className={insurance === "none" ? "text-gray-400" : "text-gray-900 dark:text-white"}>
                                            {insurance === "none" ? "-" : `+${formatCurrency(insuranceFee)}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>VAT ({cart.vatRate}%)</span>
                                        <div className="text-right">
                                            <span className="text-gray-900 dark:text-white">+{formatCurrency(calculatedVat)}</span>
                                        </div>
                                    </div>
                                    {appliedCoupon && (
                                        <div className="flex justify-between text-sm text-green-600 font-bold">
                                            <span>Discount ({appliedCoupon.code})</span>
                                            <span>-{formatCurrency(discountAmount)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Coupon Input */}
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Voucher / Coupon</p>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <input
                                                type="text"
                                                placeholder="Enter code..."
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                disabled={appliedCoupon !== null}
                                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-gold disabled:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:focus:border-gold"
                                            />
                                            {appliedCoupon && (
                                                <button onClick={() => { setAppliedCoupon(null); setCouponCode(""); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500">
                                                    <X size={14} />
                                                </button>
                                            )}
                                        </div>
                                        {appliedCoupon == null && (
                                            <button
                                                onClick={handleApplyCoupon}
                                                disabled={!couponCode || isApplyingCoupon}
                                                className="rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-gold disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gold dark:hover:text-white"
                                            >
                                                {isApplyingCoupon ? "..." : "APPLY"}
                                            </button>
                                        )}
                                    </div>
                                    {couponError && <p className="mt-1 text-xs text-red-500">{couponError}</p>}
                                </div>

                                <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 dark:border-white/5">
                                    <span className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">Total</span>
                                    <span className="text-gold text-xl font-bold">{formatCurrency(grandTotal)}</span>
                                </div>

                                {cart.checkoutBlocked && (
                                    <div className="mt-4 p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100">
                                        <AlertTriangle size={14} className="inline mr-1 mb-0.5" />
                                        Your cart contains items that have fluctuated heavily {`(>10%)`} in price. Please return to the Cart to review them.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Face Biometric Verification Modal (Tier 2 KYC) */}
            {isFaceScanning && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#111] p-8 rounded-3xl max-w-md w-full border border-gold/20 shadow-2xl">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-6">
                                <ShieldCheck className="text-gold" size={32} />
                            </div>
                            <h3 className="font-serif text-2xl text-gray-900 dark:text-white mb-2">Biometric Verification</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                                As your order value exceeds 20,000,000 USD, we require a quick face scan to ensure your identity matches your KYC record.
                            </p>

                            <div className="w-full mb-8">
                                <BiometricCapture onCapture={handleFaceScanSuccess} />
                            </div>

                            <div className="flex w-full gap-4">
                                <button
                                    onClick={() => setIsFaceScanning(false)}
                                    className="flex-1 py-3 px-4 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-bold uppercase hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Tier 2 Face Scan Overlay */}
        </>
    );
}
