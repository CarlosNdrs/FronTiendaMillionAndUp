export interface Product {

  source:string;
  id:number;
  title:string;
  price:number;
  discountpercentage:number;
  description:string;
  stock:number;
  brand:string;
  category:string;
  thumbnail:string;
  images:string[];
  rating:{ rate:number, count:number};


}
