import { Routes } from '@angular/router';
import { AddproductComponent } from './addproduct/addproduct.component';
import { ProductComponent } from './product/product.component';

export const routes: Routes = [
  { path: 'addproduct', component: AddproductComponent },
  { path: '**', component: ProductComponent },
];
