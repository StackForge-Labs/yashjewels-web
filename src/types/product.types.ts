export interface ProductImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface Product {
  id: string;
  categoryId: string;
  categoryName?: string;
  brandId: string;
  brandName?: string;
  goldKaratName?: string;
  diamondQualityName?: string;
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
  diamondWeightCts: number;
  netGoldGm: number;
  wastagePct: number;
  wastageGm: number;
  totalGrossWeightGm: number;
  
  goldMakingCharge: number;
  stoneMakingCharge: number;
  diamondMakingCharge: number;
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
  stones: ProductStone[];
  diamonds: ProductDiamond[];
  images: ProductImage[];
}

export interface ProductStone {
  id: string;
  name: string;
  stoneQuality: string;
  stoneQualityId?: string;
  quantity: number;
  weightGm: number;
  ratePerGm: number;
  amount: number;
}

export interface ProductDiamond {
  id: string;
  diamondQuality: string;
  diamondQualityId?: string;
  diamondCut: string;
  diamondSubTypeId?: string;
  quantity: number;
  weightCts: number;
  ratePerCt: number;
  amount: number;
}

export interface StoneCreateRequest {
  name: string;
  stoneQuality: string;
  quantity: number;
  weightGm: number;
  ratePerGm: number;
}

export interface DiamondCreateRequest {
  diamondQuality: string;
  diamondCut: string;
  quantity: number;
  weightCts: number;
  ratePerCt: number;
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
  description?: string | null;
  prodQuality: string;
  goldWeightGm: number;
  stoneWeightGm: number;
  diamondWeightCts: number;
  netGoldGm: number;
  wastagePct: number;
  wastageGm: number;
  totalGrossWeightGm: number;
  goldMakingCharge: number;
  stoneMakingCharge: number;
  diamondMakingCharge: number;
  otherMakingCharge: number;
  vatRate: number;
  quantity: number;
  pairs: number;
  stones?: StoneCreateRequest[];
  diamonds?: DiamondCreateRequest[];
}

export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {}
