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