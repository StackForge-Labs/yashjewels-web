export enum ReturnRequestStatus {
    SUBMITTED = 0,
    VENDOR_REVIEWING = 1,
    VENDOR_APPROVED = 2,
    VENDOR_REJECTED = 3,
    ADMIN_ARBITRATING = 4,
    APPROVED = 5,
    REJECTED = 6,
    REFUNDING = 7,
    COMPLETED = 8
}

export interface ReturnRequest {
    id: string;
    orderId: string;
    orderNumber: string;
    customerId: string;
    customerName: string;
    reason: string;
    evidenceUrls: string[];
    refundAmount?: number;
    refundMethod?: string;
    status: ReturnRequestStatus;
    vendorNote?: string;
    adminNote?: string;
    createdAt: string; // ISO Date
    resolvedAt?: string; // ISO Date
}

export interface SubmitReturnRequestRequest {
    orderId: string;
    reason: string;
    evidenceUrls: string[];
}

export interface ReviewReturnRequestRequest {
    status: ReturnRequestStatus;
    refundAmount?: number;
    note?: string;
}
