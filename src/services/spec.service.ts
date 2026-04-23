/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient, { getErrorMessage } from "@/lib/api-client";
import { ApiResponse } from "@/types/user.types";

export interface JewelrySpecItem {
    id: string;
    isActive: boolean;
    // Common fields depending on spec
    name?: string;
    caratLabel?: string; 
    gradeName?: string; 
    certCode?: string; 
    description?: string;
    karatValue?: number;
    stoneType?: string;
    grade?: string;
    gradeCode?: string;
    subTypeCode?: string;
    diamondQualityId?: string;
    diamondQuality?: any;
}

const createSpecCrudService = (endpoint: string) => ({
    getAll: async (): Promise<{ success: boolean; data: JewelrySpecItem[] }> => {
        try {
            const { data } = await apiClient.get<ApiResponse<JewelrySpecItem[]>>(endpoint);
            return { success: data.success, data: data.success ? data.data : [] };
        } catch {
            return { success: false, data: [] };
        }
    },
    create: async (payload: any): Promise<{ success: boolean; message: string; data?: JewelrySpecItem }> => {
        try {
            const { data } = await apiClient.post<ApiResponse<JewelrySpecItem>>(endpoint, payload);
            return { success: data.success, message: data.message || "Created successfully", data: data.data };
        } catch (error) {
            return { success: false, message: getErrorMessage(error) ?? "An error occurred" };
        }
    },
    update: async (id: string, payload: any): Promise<{ success: boolean; message: string; data?: JewelrySpecItem }> => {
        try {
            const { data } = await apiClient.put<ApiResponse<JewelrySpecItem>>(`${endpoint}/${id}`, payload);
            return { success: data.success, message: data.message || "Updated successfully", data: data.data };
        } catch (error) {
            return { success: false, message: getErrorMessage(error) ?? "An error occurred" };
        }
    },
    delete: async (id: string): Promise<{ success: boolean; message: string }> => {
        try {
            const { data } = await apiClient.delete<ApiResponse<any>>(`${endpoint}/${id}`);
            return { success: data.success, message: data.message || "Deleted successfully" };
        } catch (error) {
            return { success: false, message: getErrorMessage(error) ?? "An error occurred" };
        }
    },
});

export const specService = {
    goldKarats: createSpecCrudService("/jewelry-specs/gold-karats"),
    diamondQualities: createSpecCrudService("/jewelry-specs/diamond-qualities"),
    diamondSubTypes: createSpecCrudService("/jewelry-specs/diamond-sub-types"),
    stoneQualities: createSpecCrudService("/jewelry-specs/stone-qualities"),
    stoneTypes: createSpecCrudService("/jewelry-specs/stone-types"),
    certifications: createSpecCrudService("/jewelry-specs/certifications"),
    jewelTypes: createSpecCrudService("/jewel-types"),
};
