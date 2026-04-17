export enum DiscountType {
    PERCENTAGE = 0,
    FIXED_AMOUNT = 1,
    FREE_SHIPPING = 2
}

export interface Coupon {
    id: string;
    code: string;
    description?: string;
    createdBy: string;
    discountType: DiscountType;
    discountValue: number;
    minOrderAmount?: number;
    maxUsesTotal?: number;
    usedCount: number;
    validFrom: string; // ISO Date
    validUntil: string; // ISO Date
    isActive: boolean;
}

export interface CreateCouponRequest {
    code: string;
    description?: string;
    discountType: DiscountType;
    discountValue: number;
    minOrderAmount?: number;
    maxUsesTotal?: number;
    validFrom: string;
    validUntil: string;
    createdBy?: string;
}

export interface UpdateCouponRequest extends CreateCouponRequest {
    isActive: boolean;
}
