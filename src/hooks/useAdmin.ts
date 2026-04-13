import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPendingKycApi, approveKycApi, rejectKycApi } from "@/services/admin.service";

export function usePendingKyc() {
    return useQuery({
        queryKey: ["admin", "kyc", "pending"],
        queryFn: getPendingKycApi,
    });
}

export function useApproveKyc() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: approveKycApi,
        onSuccess: (res) => {
            if (res.success) {
                queryClient.invalidateQueries({ queryKey: ["admin", "kyc", "pending"] });
            }
        },
    });
}

export function useRejectKyc() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: rejectKycApi,
        onSuccess: (res) => {
            if (res.success) {
                queryClient.invalidateQueries({ queryKey: ["admin", "kyc", "pending"] });
            }
        },
    });
}
