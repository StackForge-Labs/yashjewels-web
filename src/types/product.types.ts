export interface Product {
  id: string;
  categoryId: string;
  brandId: string;
  productTypeId: string;
  jewelTypeId: string;
  goldKaratId: string;
  certificationId: string;
  vendorId: string;
  styleCode: string;
  productName: string;
  slug: string;
  description: string;
  shortDescription: string;
  weightGrams: number;
  netGoldWeightGrams: number;
  sizeLength: string;
  unitOfMeasure: string;
  isCustomizable: boolean;
  basePrice: number;
  makingCharge: number;
  discountPct: number;
  taxPct: number;
  stockQuantity: number;
  minStockLevel: number;
  isAvailable: boolean;
  status: string; // ACTIVE, INACTIVE, IMPORTED
  createdAt: string;
  updatedAt: string;
}

export interface ProductCreateRequest {
  categoryId: string;
  brandId: string;
  productTypeId: string;
  jewelTypeId: string;
  goldKaratId: string;
  certificationId: string;
  vendorId: string;
  styleCode: string;
  productName: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  weightGrams: number;
  netGoldWeightGrams: number;
  sizeLength?: string;
  unitOfMeasure: string;
  isCustomizable?: boolean;
  basePrice: number;
  makingCharge: number;
  discountPct?: number;
  taxPct?: number;
  stockQuantity: number;
  minStockLevel?: number;
  isAvailable?: boolean;
}

export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {}
