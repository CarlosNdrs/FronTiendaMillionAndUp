import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductRequest } from '../interfaces/product-request.interface';
import { Product } from '../interfaces/product.interface';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  request:ProductRequest = {
    orderField: "Price",
    ascending: false
  }

  showLoader: boolean = true;

  useFilters:boolean = false;
  filterTextSearch:string = "";
  filterTextMinPrice:string = "";
  filterTextMaxPrice:string = "";

  products: Product[] | undefined;

  public formFilters!: FormGroup;

  constructor(private dataService:DataService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    // Formulario para filtrar los productos
    this.formFilters = this.formBuilder.group({
      search: [''],
      minPrice:[''],
      maxPrice:[''],
      order:['1']
    })

    // Request por defecto
    this.request = {
      search:"",
      category:"",
      orderField:"Price",
      ascending:false
    }

    // Obtiene los productos
    this.getProducts(this.request);

  }

  getProducts(request:ProductRequest){

    // Obtiene los productos mediante el API
    this.dataService.getProducts(request).subscribe(data => {

      // Oculta el loader
      this.showLoader = false;

      this.products = data;

      // Por defecto se muestran los productos ordenados por precio de mayor a menor
      this.request = {
        orderField: "Price",
        ascending: false
      }
    })

  }

  // Filtrar productos
  filterProducts()
  {

    // Muestra el loader
    this.showLoader = true;

    // Inicializa filtros
    this.filterTextSearch = "";
    this.filterTextMinPrice = "";
    this.filterTextMaxPrice = "";

    // Si está filtrando por nombre o título
    if (this.formFilters.value.search != null && this.formFilters.value.search != "")
    {
      this.useFilters = true;
      this.filterTextSearch = this.formFilters.value.search;
      this.request.search = this.formFilters.value.search
    }

    // SI está filtrando por precio mínimo
    if (this.formFilters.value.minPrice != null && this.formFilters.value.minPrice != "")
    {
      this.useFilters = true;
      this.filterTextMinPrice = "Min Price: "+this.formFilters.value.minPrice;
      this.request.minPrice = this.formFilters.value.minPrice
    }

    // Si está filtrando por precio máximo
    if (this.formFilters.value.maxPrice != null && this.formFilters.value.maxPrice != "")
    {
      this.useFilters = true;
      this.filterTextMaxPrice = "Max Price: "+this.formFilters.value.maxPrice;
      this.request.maxPrice = this.formFilters.value.maxPrice
    }

    // Si está ordenando descendentemente por precio
    if (this.formFilters.value.order == 1 || this.formFilters.value.order == 2){
      this.request.orderField = "Price";
    }

    // Si está ordenando descendentemente por nombre
    if (this.formFilters.value.order == 3 || this.formFilters.value.order == 4){
      this.request.orderField = "Title";
    }

    // Si está ordenando ascendentemente por precio
    if (this.formFilters.value.order == 1 || this.formFilters.value.order == 4){
      this.request.ascending = false;
    }

    // Si está ordenando ascendentemente por nombre
    if (this.formFilters.value.order == 2 || this.formFilters.value.order == 3){
      this.request.ascending = true;
    }

    // Obtiene los productos
    this.getProducts(this.request);

  }

  // Limipia los filtros
  limpiarFiltros(){

    // Muestra el loader
    this.showLoader = true;

    // Por defecto se muestran los productos ordenados por precio de mayor a menor
    this.request = {
      orderField: "Price",
      ascending: false
    }

    // Obtiene los productos
    this.getProducts(this.request);
  }

  // Cuando cambia el select de ordenamiento
  onChange(option:any) {

    switch (option.target.value) {
      case "1": // Ordenar por precio descendentemente
        this.showLoader = true;
        this.request = {
          search:"",
          category:"",
          orderField:"Price",
          ascending:false
        }
        this.getProducts(this.request);
        break;

        case "2": // Ordenar por precio ascendentemente
          this.showLoader = true;
          this.request = {
            search:"",
            category:"",
            orderField:"Price",
            ascending:true
          }
          this.getProducts(this.request);
          break;

          case "3": // Ordenar por nombre descendentemente
            this.showLoader = true;
            this.request = {
              search:"",
              category:"",
              orderField:"Title",
              ascending:true
            }
            this.getProducts(this.request);
            break;

            case "4": // Ordenar por nombre ascendentemente
              this.showLoader = true;
              this.request = {
                search:"",
                category:"",
                orderField:"Title",
                ascending:false
              }
              this.getProducts(this.request);
              break;

      default:
        break;
    }
  }

}
