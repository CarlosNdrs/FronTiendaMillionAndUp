import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cartStore = this.dataService.cartStore$;

  constructor(private dataService:DataService, private router: Router) { }

  ngOnInit(): void {
  }

  updateCart(action:string, id:number, store:string)
  {
    // Obtiene el produto del carrito a actualizar
    const product = this.dataService.findProductById(id);

    // Si existe
    if(product){

      // Adciona 1 a la cantidad
      if(action == "add"){
        if(product.quantity < product.stock)
        {
          product.quantity = product.quantity + 1;
        }
      }
      // Resta 1 a la cantidad
      else if (action == "del") {
        if(product.quantity == 1)
        {
          this.deleteProduct(id);
        } else
        {
          product.quantity = product.quantity - 1;
        }
      }

      // Actualiza el local storage
      this.dataService.updateLocalStorage();
    }
  }

  // Elimina producto del carrito
  deleteProduct(id:number){
    this.dataService.deleteProduct(id);
  }

  // Calucula el total del carrito
  calcTotalCart() {

    const result = this.dataService.calcTotal();
    return result;

  }

  // Retorna si debe mostrar o no el button de checkout
  showCheckOutButton(){

    var totProducts = this.dataService.totalNumberProducts();

    // Retorna true si hay mas de 1 producto en el carrito
    if (totProducts > 0) {
      return true;
    } else {
      return false;
    }
  }

  // Realiza el checkout
  checkout()
  {
    // Realiza el checkout
    this.dataService.checkout().subscribe( response => {

      if (response.success) {
        // Limpia l carrito de compras
        this.dataService.clearCart();

        //Redirige a la pagina de gracias y resumen de compra
        this.router.navigate(['thank-you-page/'+response.orderId]);
      }
    })

  }

}
