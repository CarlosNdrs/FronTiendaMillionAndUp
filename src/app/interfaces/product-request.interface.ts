export interface ProductRequest {
  search?:string;
  category?:string;
  minPrice?:number;
  maxPrice?:number;
  orderField:string;
  ascending:boolean;
}
