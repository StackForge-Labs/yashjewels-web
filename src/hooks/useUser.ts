import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { UserAddressDto, CreateAddressRequest, UserProfile, ApiResponse } from "@/types/user.types";

// ── Profile APIs ───────────────────────────────────────────────

const updateProfileApi = async (data: { fullName: string; phone?: string; dateOfBirth?: string }) => {
    const res = await apiClient.put<ApiResponse<UserProfile>>("/user/profile", data);
    return res.data;
};

const updateAvatarApi = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiClient.post<ApiResponse<string>>("/user/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

// ── Address APIs ───────────────────────────────────────────────

const fetchAddressesApi = async () => {
    const res = await apiClient.get<ApiResponse<UserAddressDto[]>>("/user/addresses");
    return res.data;
};

const createAddressApi = async (data: CreateAddressRequest) => {
    const res = await apiClient.post<ApiResponse<UserAddressDto>>("/user/addresses", data);
    return res.data;
};

const deleteAddressApi = async (id: string) => {
    const res = await apiClient.delete<ApiResponse<string>>(`/user/addresses/${id}`);
    return res.data;
};

const setDefaultAddressApi = async (id: string) => {
    const res = await apiClient.patch<ApiResponse<string>>(`/user/addresses/${id}/set-default`);
    return res.data;
};

// ── Hooks ──────────────────────────────────────────────────────

export function useUpdateProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateProfileApi,
        onSuccess: (res) => {
            if (res.success) {
                queryClient.invalidateQueries({ queryKey: ["profile"] });
            }
        },
    });
}

export function useUpdateAvatar() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateAvatarApi,
        onSuccess: (res) => {
            if (res.success) {
                queryClient.invalidateQueries({ queryKey: ["profile"] });
            }
        },
    });
}

export function useAddresses() {
    return useQuery({
        queryKey: ["addresses"],
        queryFn: fetchAddressesApi,
        select: (data) => data.data || [],
    });
}

export function useCreateAddress() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createAddressApi,
        onSuccess: (res) => {
            if (res.success) {
                queryClient.invalidateQueries({ queryKey: ["addresses"] });
            }
        },
    });
}

export function useDeleteAddress() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteAddressApi,
        onSuccess: (res) => {
            if (res.success) {
                queryClient.invalidateQueries({ queryKey: ["addresses"] });
            }
        },
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
        },
    });
}
