import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../interfaces/product.interface';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  id: any;
  store: any;
  product: any;
  newProduct: any;
  inStock:boolean = false;
  yellowStars:string[]=[];
  grayStars:string[]=[];
  reviewsText: string = "";
  numberYellowStars:number = 0;
  qtyOptions:number[]= [];
  mainImage?:string;
  public classSuccessToast:string = "bg-success text-light";
  public notifications: any[] = [];
  public formBuy!: FormGroup;

  constructor(private route: ActivatedRoute, private dataService:DataService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    // Obtiene los parámetros de la ruta
    this.id = this.route.snapshot.paramMap.get('id');
    this.store = this.route.snapshot.paramMap.get('store');

    // Consulta los datos del producto
    this.dataService.getProductDetail(this.store,this.id).subscribe(prod => {

      this.product = prod;

      // Si el producto tiene stock
      if (this.product.stock != null && this.product.stock > 0){
        this.inStock = true;
      }

      // Calcula la calificación en estrellas amarillas
      for(let index = 1; index <= Math.floor(prod.rating.rate); index++)
      {
        this.yellowStars.push(index.toString());
        this.numberYellowStars = this.numberYellowStars + 1;
      }

      // Calcula las estrellas grises de la calificación
      for(let index = this.numberYellowStars + 1; index <= 5; index++)
      {
        this.grayStars.push(index.toString());
      }

      // Si el producto tiene un numero de reviews
      if (prod.rating.count != null){
        this.reviewsText = prod.rating.count.toString() + " Ratings";
      }

      // Arreglo para el select de cantidad de productos a agregar en el carrito
      for (let index = 1; index <= this.quantityAvailable() ; index++)
      {
        this.qtyOptions.push(index);
      }

      // Si el producto tiene varias imagenes
      if (this.product.images != null) {

        // Asigna como imagen principal la primera del arreglo
        this.mainImage = this.product.images[0];

        this.product.images = this.product.images.filter( (i: string | undefined) => {
          return i !== this.mainImage;
        });

      }
      // Si el producto no tiene varias imagenes
      else {
        // Asigna como imagen principal el thumbnail
        this.mainImage = this.product.thumbnail;
      }

    });

    // Inicializa el formulario para adicional al carrito
    this.formBuy = this.formBuilder.group({
      quantity: [1]
    })
  }

  // Adicionar producto al carrito
  addToCart(product:Product)
  {

    // Crea un nuevo objeto
    this.newProduct=  {
      store: product.source,
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: this.formBuy.value.quantity,
      stock: product.stock
    }

    // Adiciona el producto al carrito
    this.dataService.addProductToCart(this.newProduct);

    // Crea una nueva notificación
    const noti = {
      time: new Date(),
      text: this.formBuy.value.quantity + " product(s) Added to cart successfully."
    }
    // Muestra la notificación
    this.notifications.push(noti)

    // Deja en 1 el select de cantidad
    this.formBuy.patchValue({quantity:1})

  }

  // Remueve las notificaciones
  removeNotification(notification:any) {
		this.notifications = this.notifications.filter((n) => n !== notification);
	}

  // Calcula la cantidad de productos disponibles para comprar
  quantityAvailable(){

    var result = 0;

    // Solo si el producto tiene stock
    if (this.product.stock != null)
    {
      // COnsulta los datos del producto
      const prodInCart = this.dataService.findProductById(this.product.id);

      // SI ya hay elementos del producto en el carro de compras
      if (prodInCart) {
        // la cantidad es el stock menos lo que haya en el carrito
        result = this.product.stock - prodInCart.quantity;
      }
      // Si no hay elementos del producto en el carro de compras
      else {
        // la cantidad es igual al stock
        result = this.product.stock;
      }

      // inicializa de nuevo el select de cantidad
      this.qtyOptions = [];

      // Si la cantidad disponible es mayor o igual 1
      if (result >= 1)
      {

        // llena las opciones del select de cantidad
        for (let index = 1; index <= result ; index++)
        {
          this.qtyOptions.push(index);
        }
      }
    }

    return result;
  }

}
