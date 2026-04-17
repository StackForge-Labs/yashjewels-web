import apiClient from "@/lib/api-client";
import { ApiResponse } from "@/types/user.types";

export interface JewelrySpecItem {
    id: string;
    name?: string; // For general refs
    caratLabel?: string; // For Gold Karat
    gradeName?: string; // For Diamond Quality
    certCode?: string; // For Certification
    isActive: boolean;
}

export const specService = {
    // Gold Karats
    getGoldKarats: () => apiClient.get<ApiResponse<JewelrySpecItem[]>>("/jewelry-specs/gold-karats").then(r => r.data),
    createGoldKarat: (data: any) => apiClient.post<ApiResponse<any>>("/jewelry-specs/gold-karats", data).then(r => r.data),
    updateGoldKarat: (id: string, data: any) => apiClient.put<ApiResponse<any>>(`/jewelry-specs/gold-karats/${id}`, data).then(r => r.data),
    deleteGoldKarat: (id: string) => apiClient.delete<ApiResponse<any>>(`/jewelry-specs/gold-karats/${id}`).then(r => r.data),

    // Diamond Qualities
    getDiamondQualities: () => apiClient.get<ApiResponse<JewelrySpecItem[]>>("/jewelry-specs/diamond-qualities").then(r => r.data),
    createDiamondQuality: (data: any) => apiClient.post<ApiResponse<any>>("/jewelry-specs/diamond-qualities", data).then(r => r.data),
    updateDiamondQuality: (id: string, data: any) => apiClient.put<ApiResponse<any>>(`/jewelry-specs/diamond-qualities/${id}`, data).then(r => r.data),
    deleteDiamondQuality: (id: string) => apiClient.delete<ApiResponse<any>>(`/jewelry-specs/diamond-qualities/${id}`).then(r => r.data),

    // Jewel Types
    getJewelTypes: () => apiClient.get<ApiResponse<JewelrySpecItem[]>>("/jewelTypes").then(r => r.data),
    // ... we can add more as needed, but let's start with these primary ones for Attributes management
};
