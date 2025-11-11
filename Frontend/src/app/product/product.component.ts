import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../product.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  products: Observable<Product[]> = new Observable<Product[]>();
  imgLoadingDisplay: string = 'none';
  visibleIds: Set<number> = new Set<number>();

  constructor(
    private productService: ProductService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.visibleIds.clear();
    this.products = this.productService.getAllProduct();
    // mark rows visible with slight stagger after data arrives
    this.products.subscribe(list => {
      let delay = 0;
      for (const p of list) {
        setTimeout(() => this.visibleIds.add(p.id), delay);
        delay += 70;
      }
    });
    return this.products;
  }

  addProduct() {
    this.router.navigate(['/addproduct']);
  }

  deleteProduct(id: number) {
    this.imgLoadingDisplay = 'inline';
    this.productService.deleteProductById(id).subscribe({
      next: () => {
        this.getProducts().subscribe(() => {
          this.imgLoadingDisplay = 'none';
          this.toast.showSuccess('Producto eliminado correctamente');
        });
      },
      error: () => {
        this.imgLoadingDisplay = 'none';
        this.toast.showError('Error al eliminar el producto');
      }
    });
  }

  editProduct(id: number) {
    this.router.navigate(['/addproduct'], { queryParams: { id: id } });
  }

  searchItem(value: string) {
    this.productService.getAllProduct().subscribe((res) => {
      this.products = of(res);

      this.products
        .pipe(
          map((plans) => plans.filter((results) => results.name.indexOf(value) != -1))
        )
        .subscribe((results) => {
          const productList = results.map((r) => new Product(r.id, r.name, r.createdDate, (r as any).stock ?? 0, (r as any).price ?? 0));
          this.products = of(productList);
        });
    });
  }
}
