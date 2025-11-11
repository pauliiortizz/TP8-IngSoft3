import { TestBed } from '@angular/core/testing';
import { AddproductComponent } from './addproduct.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs'; // para simular observables
import { DatePipe } from '@angular/common';
import { ProductService } from '../product.service';
import { ToastService } from '../toast.service';
import { Product } from '../product.model';

describe('AddproductComponent', () => {
  let mockproductService: any;
  let mockToastService: any;

  beforeEach(() => {
    mockproductService = {
      createProduct: jasmine.createSpy('createProduct').and.returnValue(of({})),
      updateProduct: jasmine.createSpy('updateProduct').and.returnValue(of({})),
      getProductById: jasmine.createSpy('getProductById').and.returnValue(of({ id: 1, name: 'John DOE' })),
      getAllProduct: jasmine.createSpy('getAllProduct').and.returnValue(of([]))
    };

    mockToastService = {
      showError: jasmine.createSpy('showError'),
      showSuccess: jasmine.createSpy('showSuccess')
    };

    TestBed.configureTestingModule({
      imports: [AddproductComponent, HttpClientTestingModule],
      providers: [
        DatePipe,
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        {
          provide: ActivatedRoute, // Simula ActivatedRoute
          useValue: {
            params: of({ id: 1 }) // simula el parámetro id en la URL
          }
        },
        { provide: ProductService, useValue: mockproductService },
        { provide: ToastService, useValue: mockToastService }
      ]
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AddproductComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should show toast and not call API when name contains digits', () => {
    const fixture = TestBed.createComponent(AddproductComponent);
    const component = fixture.componentInstance;
    const emp = new Product(0, 'John D0e', '', 0, 0);
    component.addProduct(emp);
    expect(mockToastService.showError).toHaveBeenCalled();
    expect(mockproductService.createProduct).not.toHaveBeenCalled();
  });

  it('should show toast and not call API when name has excessive repeats', () => {
    const fixture = TestBed.createComponent(AddproductComponent);
    const component = fixture.componentInstance;
    const emp = new Product(0, 'Juuuuaannnn Perez', '', 0, 0);
    component.addProduct(emp);
    expect(mockToastService.showError).toHaveBeenCalled();
    expect(mockproductService.createProduct).not.toHaveBeenCalled();
  });

  it('should format name before calling API', () => {
    const fixture = TestBed.createComponent(AddproductComponent);
    const component = fixture.componentInstance;
    const emp = new Product(0, 'juan carlos chamizo', '', 0, 0);
    component.addProduct(emp);
    expect(emp.name).toBe('Juan Carlos CHAMIZO');
    expect(mockproductService.createProduct).toHaveBeenCalled();
  });

  it('should reject negative stock', () => {
    const fixture = TestBed.createComponent(AddproductComponent);
    const component = fixture.componentInstance;
    const emp = new Product(0, 'John Doe', '', -1, 0);
    component.addProduct(emp);
    expect(mockToastService.showError).toHaveBeenCalled();
    expect(mockproductService.createProduct).not.toHaveBeenCalled();
  });

  it('should reject stock over 100', () => {
    const fixture = TestBed.createComponent(AddproductComponent);
    const component = fixture.componentInstance;
    const emp = new Product(0, 'John Doe', '', 101, 0);
    component.addProduct(emp);
    expect(mockToastService.showError).toHaveBeenCalled();
    expect(mockproductService.createProduct).not.toHaveBeenCalled();
  });

  it('should show error on duplicate name (case-insensitive) and not call API', () => {
    mockproductService.getAllProduct.and.returnValue(of([{ id: 5, name: 'John DOE' }]));
    const fixture = TestBed.createComponent(AddproductComponent);
    const component = fixture.componentInstance;
    const emp = new Product(0, 'john doe', '', 10, 0);
    component.addProduct(emp);
    expect(mockToastService.showError).toHaveBeenCalled();
    expect(mockproductService.createProduct).not.toHaveBeenCalled();
  });

  it('should show error toast when API returns error on create', () => {
    mockproductService.createProduct.and.returnValue(
      // eslint-disable-next-line rxjs/no-ignored-error
      new (class { subscribe = (o: any) => o.error(new Error('boom')); })() as any
    );
    const fixture = TestBed.createComponent(AddproductComponent);
    const component = fixture.componentInstance;
    const emp = new Product(0, 'John Doe', '', 10, 0);
    component.addProduct(emp);
    expect(mockToastService.showError).toHaveBeenCalled();
  });
});