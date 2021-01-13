import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { CartItemsComponent } from './cart/cart-items/cart-items.component';

const routes: Routes = [
  { path: 'products', component: ProductListComponent },
  { path: 'product-detail/:id', component : ProductDetailComponent },
  { path: 'my-cart', component : CartItemsComponent },
  { path: '', redirectTo: '/products', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
