import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddproductComponent } from './addproduct/addproduct.component';
import { productComponent } from './product/product.component';

const routes: Routes = [
  { path: 'addproduct', component: AddproductComponent },
  { path: '**', component: productComponent }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }