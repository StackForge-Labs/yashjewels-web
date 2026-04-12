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
  name: string; // From backend 'Name'
  slug: string;
  description: string;
  prodQuality: string;
  
  goldWeightGm: number;
  stoneWeightGm: number;
  netGoldGm: number;
  wastagePct: number;
  wastageGm: number;
  totalGrossWeightGm: number;
  
  goldMakingCharge: number;
  stoneMakingCharge: number;
  otherMakingCharge: number;
  vatRate: number;
  
  quantity: number; // From backend 'Quantity'
  status: string; // ACTIVE, INACTIVE, SOLD_OUT, COMING_SOON
  viewCount: number;
  soldCount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;

  estimatedFinalPrice: number;
  images: {
    id: string;
    imageUrl: string;
    altText?: string;
    isPrimary: boolean;
    sortOrder: number;
  }[];
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
  name: string;
  slug: string;
  description?: string;
  prodQuality: string;
  goldWeightGm: number;
  stoneWeightGm: number;
  netGoldGm: number;
  wastagePct: number;
  wastageGm: number;
  totalGrossWeightGm: number;
  goldMakingCharge: number;
  stoneMakingCharge: number;
  otherMakingCharge: number;
  vatRate: number;
  quantity: number;
}

export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {}
