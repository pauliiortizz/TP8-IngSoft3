import { Component, OnInit } from '@angular/core';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-addproduct',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})
export class AddproductComponent implements OnInit {
  newProduct: Product = new Product(0, '', '', 0, 0);
  submitBtnText: string = "Crear";
  imgLoadingDisplay: string = 'none';

  constructor(private productService: ProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toast: ToastService) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const productId = params['id'];
      if(productId)
      this.editProduct(productId);
    });
  }

  addProduct(product: Product) {
    const validation = this.validateAndFormat(product);
    if (!validation.valid) {
      // show Spanish-friendly error
      const err = validation.error ? validation.error : 'Error en los datos';
      this.toast.showError(err);
      return;
    }

    // Duplicate name check (case-insensitive). For edit, ignore the same id.
    this.productService.getAllProduct().subscribe(list => {
      const nameLower = (product.name || '').toLowerCase();
      const duplicate = list.find(p => p.name?.toLowerCase() === nameLower && p.id !== product.id);
      if (duplicate) {
        this.imgLoadingDisplay = 'none';
        this.toast.showError('No se puede usar un nombre duplicado');
        return;
      }

      // proceed with create/update after duplicate check
      this._performSave(product);
    }, err => { this.toast.showError('Error al validar duplicados'); });
  }

  private _performSave(product: Product) {
    // show spinner / disable button feedback
    const originalBtnText = this.submitBtnText;
    this.imgLoadingDisplay = 'inline';
    this.submitBtnText = product.id === 0 ? 'Creating...' : 'Saving...';

    if (product.id == 0) {
      product.createdDate = new Date().toISOString();
      this.productService.createProduct(product).subscribe({
        next: ()=> { this.imgLoadingDisplay = 'none'; this.submitBtnText = originalBtnText; this.toast.showSuccess('Producto creado correctamente'); this.router.navigate(['/']); },
        error: e => { this.imgLoadingDisplay = 'none'; this.submitBtnText = originalBtnText; this.toast.showError('Error en la API'); }
      });
    }
    else {
      product.createdDate = new Date().toISOString();
      this.productService.updateProduct(product).subscribe({
        next: ()=> { this.imgLoadingDisplay = 'none'; this.submitBtnText = originalBtnText; this.toast.showSuccess('Producto editado correctamente'); this.router.navigate(['/']); },
        error: e => { this.imgLoadingDisplay = 'none'; this.submitBtnText = originalBtnText; this.toast.showError('Error en la API'); }
      });
    }
  }
  private validateAndFormat(product: Product): { valid: boolean; error?: string } {
    if (!product || !product.name || product.name.trim().length === 0) return { valid: false, error: 'El nombre es obligatorio' };

    // Stock validations (align with backend 0..100 rule)
    if (product.stock == null || Number.isNaN(product.stock as any)) {
      return { valid: false, error: 'El stock es obligatorio' };
    }
    if (product.stock < 0 || product.stock > 100) {
      return { valid: false, error: 'El stock debe estar entre 0 y 100' };
    }

    // Price validations
    if (product.price == null || Number.isNaN(product.price as any)) {
      return { valid: false, error: 'El precio es obligatorio' };
    }
    if (product.price < 0) {
      return { valid: false, error: 'El precio no puede ser negativo' };
    }
    if (product.price > 1000) {
      return { valid: false, error: 'El precio no puede ser mayor a 1000' };
    }

    let name = product.name.replace(/\u00A0/g, ' ').trim().replace(/\s+/g, ' ');
  if (name.length < 2) return { valid: false, error: 'El nombre debe tener al menos 2 caracteres' };

  const forbidden = ['Empleado','N/A','Nombre','Anonimo','Test'];
  if (forbidden.includes(name) || forbidden.some(f => name.split(' ').includes(f))) return { valid: false, error: 'Nombre no permitido' };

    const parts = name.split(' ');
    for (const part of parts) {
      if (part.length < 1) return { valid: false, error: 'Cada parte debe tener al menos un caracter' };
      if (part.length > 100) return { valid: false, error: 'Cada parte admite hasta 100 caracteres' };
      if (/\d/.test(part)) return { valid: false, error: 'El nombre no debe contener números' };
      if (/([a-zA-Z'])\1{2,}/i.test(part)) return { valid: false, error: 'Caracteres repetidos en exceso' };
      if (!/^[\u00C0-\u017Fa-zA-Z'\-]+$/.test(part)) return { valid: false, error: 'El nombre contiene caracteres inválidos' };
    }

    // format: capitalize all given names, surname uppercase
    if (parts.length === 1) {
      product.name = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
    } else {
  const given = parts.slice(0, parts.length - 1).map((p: string) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase());
      const surname = parts[parts.length - 1].toUpperCase();
      product.name = [...given, surname].join(' ');
    }

    return { valid: true };
  }

  editProduct(productId: number) {
    this.productService.getProductById(productId).subscribe(res => {
      this.newProduct.id = res.id;
      this.newProduct.name = res.name
      this.newProduct.stock = (res as any).stock ?? 0;
      this.newProduct.price = (res as any).price ?? 0;
      this.submitBtnText = "Editar";
    });
  }

  cancel() {
    this.router.navigate(['/']);
  }

}
