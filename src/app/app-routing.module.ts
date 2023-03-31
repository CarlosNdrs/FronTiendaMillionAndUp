import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ThankYouPageComponent } from './thank-you-page/thank-you-page.component';

const routes: Routes = [
  {path: '', pathMatch: 'full',redirectTo:'home'},
  {path: 'home', component:HomeComponent},
  {path: 'product/:store/:id',component:ProductDetailComponent},
  {path: 'thank-you-page/:orderId', component:ThankYouPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
