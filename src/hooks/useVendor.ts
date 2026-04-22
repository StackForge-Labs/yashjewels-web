import { useQuery } from "@tanstack/react-query";
import { vendorService } from "@/services/vendor.service";

export const useVendorPendingKyc = () => {
    return useQuery({
        queryKey: ["vendor", "kyc", "pending"],
        queryFn: () => vendorService.getPendingKyc(),
    });
};

export const useVendorCustomers = (page: number, pageSize: number, search?: string) => {
    return useQuery({
        queryKey: ["vendor", "customers", page, pageSize, search],
        queryFn: () => vendorService.getCustomers(page, pageSize, search),
    });
};
