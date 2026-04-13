import apiClient from "@/lib/api-client";
import { ApiResponse, PendingKycDto } from "@/types/user.types";

export const getPendingKycApi = () =>
    apiClient.get<ApiResponse<PendingKycDto[]>>("/admin/kyc/pending").then((r) => r.data);

export const approveKycApi = (userId: string) =>
    apiClient.put<ApiResponse<string>>(`/admin/kyc/${userId}/approve`).then((r) => r.data);

export const rejectKycApi = (userId: string) =>
    apiClient.put<ApiResponse<string>>(`/admin/kyc/${userId}/reject`).then((r) => r.data);
