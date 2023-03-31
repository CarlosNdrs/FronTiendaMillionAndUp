import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  numProducts:string = "";

  constructor(private dataService:DataService) { }

  ngOnInit(): void {

  }

  totalNumberProducts() {

    // Calcula el total de productos para mostrarlo en el badge del carrito
    const totProducts = this.dataService.totalNumberProducts();
    var result = "";

    // Si son mas de 99 se mostrara +99
    if (totProducts > 99) {
      result = "+99";
    } else
    {
      result = totProducts.toString();
    }

    return result;

  }

  // Retorna si debe mostrar el icono del carrito o no
  showIconCart() {

    // Numero de productos en el carrito
    const totProducts = this.dataService.totalNumberProducts();

    // Si es mayor a cero se muesta el carrito
    if (totProducts > 0) {
      return true;
    } else {
      return false;
    }

  }

}
