import { OrderDetail } from "./order-detail.interface";

export interface Order {
  total:number,
  products: OrderDetail[]
}
