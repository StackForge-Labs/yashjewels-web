"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getAddressesApi,
    createAddressApi,
    updateAddressApi,
    deleteAddressApi,
    setDefaultAddressApi
} from "@/lib/auth";
import { toast } from "sonner";

export function useAddresses() {
    return useQuery({
        queryKey: ["addresses"],
        queryFn: getAddressesApi,
        select: (res) => res.data || [],
    });
}

export function useCreateAddress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createAddressApi,
        onSuccess: (res) => {
            if (res.success) {
                toast.success("Address added successfully");
                queryClient.invalidateQueries({ queryKey: ["addresses"] });
            } else {
                toast.error(res.message || "Failed to add address");
            }
        },
        onError: () => {
            toast.error("Error connecting to server");
        }
    });
}

export function useUpdateAddress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateAddressApi,
        onSuccess: (res) => {
            if (res.success) {
                toast.success("Address updated successfully");
                queryClient.invalidateQueries({ queryKey: ["addresses"] });
            } else {
                toast.error(res.message || "Failed to update address");
            }
        },
        onError: () => {
            toast.error("Error connecting to server");
        }
    });
}

export function useDeleteAddress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteAddressApi,
        onSuccess: (res) => {
            if (res.success) {
                toast.success("Address deleted");
                queryClient.invalidateQueries({ queryKey: ["addresses"] });
            }
        }
    });
}

export function useSetDefaultAddress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: setDefaultAddressApi,
        onSuccess: (res) => {
            if (res.success) {
                queryClient.invalidateQueries({ queryKey: ["addresses"] });
            }
        }
    });
}
