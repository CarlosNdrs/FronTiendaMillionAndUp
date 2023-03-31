import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../interfaces/product.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductRequest } from '../interfaces/product-request.interface';
import { ProductCart } from '../interfaces/product-cart.interface';
import { Order } from '../interfaces/order.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  urlApi:string = environment.apiUrl;

  // Lista de productos en el carrito de compras
  private cartProducts:ProductCart[] = [];
  // LIsta de productos ya existentes en el carrito de compras
  private cartOldData:ProductCart[] = [];
  // Carrito de compras
  private cartStore = new BehaviorSubject<ProductCart[]>([]);
  // Observable del carrito de compras
  cartStore$ = this.cartStore.asObservable();

  constructor(private http:HttpClient) {

    // Consulta en el local storage si ya habia productos previamente en el carrito de compras
    var cartOldData = localStorage.getItem('cart');

    // Si existian produtos anteriormente en el carrito de compras
    if (cartOldData != null){
      // Los añade a la lista
      this.cartProducts = JSON.parse(cartOldData);
      // Emite el carrto de compras
      this.cartStore.next(this.cartProducts);
    }
  }

  // Obtiene los productos llamando al API
  getProducts(request:ProductRequest):Observable<Product[]> {
    return this.http.post<Product[]>(this.urlApi + 'Productos/GetProducts',request);
  }

  // Obtiene el detalle de un producto llamando al API
  getProductDetail(store:string, id:number):Observable<Product>{
    return this.http.get<Product>(this.urlApi + 'Productos/GetProduct?store=' +store+ '&id=' +id);
  }

  // Obtiene la info de una compra llamando al API
  getPurchaseInfo(purchaseId:number):Observable<Order> {
    return this.http.get<Order>(this.urlApi + 'Purchase/GetPurchase?purchaseId=' + purchaseId);
  }

  // ADicionar productos al carrito
  addProductToCart(product:ProductCart){

    // Si el carrito está vacio
    if (this.cartProducts.length === 0) {

      // Adiciona el producto a la lista
      this.cartProducts.push(product);
      // Emite el carrito
      this.cartStore.next(this.cartProducts);
      // Guarda la info en el localStorage
      localStorage.setItem('cart',JSON.stringify(this.cartProducts));
    }
    // Si el carrito ya tenia productos previamente
    else {

      // Busca si el producto a agregar ya existe en el carrito
      const existProd = this.cartProducts.find( p => {
        return p.id === product.id;
      });

      // Si el producto ya existe en el carrito
      if (existProd){
        // Aumenta su cantidad
        existProd.quantity = existProd.quantity + product.quantity;
        this.cartStore.next(this.cartProducts);
      }
      // Si el producto no existia en el carrito
      else {
        // lo adiciona
        this.cartProducts.push(product);
        this.cartStore.next(this.cartProducts);
      }

      // Actualiza el localStorage
      localStorage.setItem('cart',JSON.stringify(this.cartProducts));

    }
  }

  // Encontrar producto en el carrito por ID
  findProductById(id:number){
    return this.cartProducts.find( p => {
      return p.id === id;
    });
  }

  // Eliminar producto del carrito
  deleteProduct(id:number){

    this.cartProducts = this.cartProducts.filter( p => {
      return p.id != id;
    });

    this.cartStore.next(this.cartProducts);
    this.updateLocalStorage();

  }

  // Almacena informacion del carrito en el localStorage
  updateLocalStorage(){
    localStorage.setItem('cart',JSON.stringify(this.cartProducts));
  }

  // Calcula el total de precio de los productos en el carrito
  calcTotal(){

    const totalCart = this.cartProducts.reduce(
      function (tot, prod)
      {
        return tot + ( prod.quantity * prod.price );
      },
      0);

      return totalCart;
  }

  // Retorna el número de productos en el carrito
  totalNumberProducts()
  {
    const totNumProds = this.cartProducts.reduce(
      function (tot,prod)
      {
        return tot + prod.quantity;
      },
      0
    );
    return totNumProds;
  }

  // Realiza el checkout del carrito
  checkout()
  {
    // Inicializa el detalle de la compra
    var detailPurchase: any[] = [];

    // Por cada elemento en el carrito crea un detalle
    this.cartProducts.forEach(cartProduct => {
      const detail = {
        Store: cartProduct.store,
        IdProduct: cartProduct.id,
        Title: cartProduct.title,
        UnitPrice: cartProduct.price,
        Quantity: cartProduct.quantity,
        TotalProduct: cartProduct.price * cartProduct.quantity
      }

      // Adiciona al arreglo de detalles/productos
      detailPurchase.push(detail);

    });

    // Crea objeto de la compra
    const purchase =
    {
      Total: this.calcTotal(),
      Products: detailPurchase
    }

    // Guarda los datos de la compra mediante el API
    return this.http.post<any>(this.urlApi + 'Purchase/SavePurchase',purchase);

  }

  // Elimina todos los elementos del carrito
  clearCart()
  {
    this.cartProducts = [];
    this.cartStore.next(this.cartProducts);
    this.updateLocalStorage();
  }

}
