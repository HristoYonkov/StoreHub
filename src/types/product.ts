export interface Product {
  id: number;
  category: string;
  name: string;
  shortDesc: string;
  price: number;
  discountPrice?: number;
  image: string;
  color: string;
  rating: number;
  stock?: number;
}

export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';