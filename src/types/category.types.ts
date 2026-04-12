export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  iconUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface CategoryCreateRequest {
  name: string;
  slug: string;
  parentId?: string | null;
  iconUrl?: string | null;
  sortOrder?: number;
}

export interface CategoryUpdateRequest {
  name?: string;
  slug?: string;
  parentId?: string | null;
  iconUrl?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}
