import apiClient from "@/lib/api-client";
import { ApiResponse } from "@/types/user.types";

export interface InvoiceDto {
    id: string;
    invoiceNumber: string;
    orderId: string;
    totalAmount: number;
    subTotal: number;
    taxAmount: number;
    discountAmount: number;
    buyerName: string;
    buyerAddress: string;
    status: string;
    issuedAt: string;
    pdfUrl?: string;
}

export const listInvoicesApi = (page: number = 1, pageSize: number = 20) =>
    apiClient.get<ApiResponse<InvoiceDto[]>>(`/invoices?page=${page}&pageSize=${pageSize}`).then((r) => r.data);

export const getInvoiceApi = (id: string) =>
    apiClient.get<ApiResponse<InvoiceDto>>(`/invoices/${id}`).then((r) => r.data);

export const generateInvoiceApi = (orderId: string) =>
    apiClient.post<ApiResponse<string>>(`/invoices/generate/${orderId}`).then((r) => r.data);
