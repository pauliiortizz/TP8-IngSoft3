import { TestBed } from '@angular/core/testing';
import { ProductComponent } from './product.component';
import { of, throwError } from 'rxjs';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';
import { ToastService } from '../toast.service';

describe('ProductComponent', () => {
  let mockService: any;
  let mockRouter: any;
  let mockToast: any;

  beforeEach(() => {
    mockService = {
      getAllProduct: jasmine.createSpy('getAllProduct').and.returnValue(of([])),
      deleteProductById: jasmine.createSpy('deleteProductById').and.returnValue(of({}))
    };
    mockRouter = { navigate: jasmine.createSpy('navigate') };
    mockToast = { showSuccess: jasmine.createSpy('showSuccess'), showError: jasmine.createSpy('showError') };

    TestBed.configureTestingModule({
      imports: [ProductComponent],
      providers: [
        { provide: ProductService, useValue: mockService },
        { provide: Router, useValue: mockRouter },
        { provide: ToastService, useValue: mockToast }
      ]
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ProductComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('deleteProduct success should refresh list and show success modal', () => {
    const fixture = TestBed.createComponent(ProductComponent);
    const component = fixture.componentInstance;

    component.deleteProduct(1);

    expect(mockService.deleteProductById).toHaveBeenCalledWith(1);
    expect(mockService.getAllProduct).toHaveBeenCalled();
    expect(mockToast.showSuccess).toHaveBeenCalled();
  });

  it('deleteProduct error should show error modal', () => {
    mockService.deleteProductById.and.returnValue(throwError(() => new Error('api error')));
    const fixture = TestBed.createComponent(ProductComponent);
    const component = fixture.componentInstance;

    component.deleteProduct(2);

    expect(mockService.deleteProductById).toHaveBeenCalledWith(2);
    expect(mockToast.showError).toHaveBeenCalled();
  });
});