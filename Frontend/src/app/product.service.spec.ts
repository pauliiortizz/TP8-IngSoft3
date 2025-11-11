import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from './product.model';
import { DatePipe } from '@angular/common';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  let datePipe: DatePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductService,
        DatePipe
      ]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
    datePipe = TestBed.inject(DatePipe);
  });

  afterEach(() => {
    httpMock.verify();
  });



  it('should retrieve all products', () => {
  const today = new Date();
  const expectedDateTime = datePipe.transform(today, 'dd/MM/yyyy HH:mm:ss', undefined) ?? '';

    const dummyproducts: Product[] = [
      new Product(1, 'John Doe', expectedDateTime, 10, 100),
      new Product(2, 'Jane Smith', expectedDateTime, 20, 200)
    ];

    service.getAllProduct().subscribe((products: Product[]) => {
      expect(products.length).toBe(2);
      products.forEach((product: Product, index: number) => {
        console.log('product createdDate:', product.createdDate ?? '');
        console.log('Dummy product createdDate:', dummyproducts[index].createdDate ?? '');

        expect(product.createdDate).toEqual(expectedDateTime);
      });
    });

  const req = httpMock.expectOne(`${service.apiUrlProduct}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyproducts);
  });


  it('should call GET by id with correct URL', () => {
    service.getProductById(42).subscribe();
    const req = httpMock.expectOne(`${service.apiUrlProduct}/42`);
    expect(req.request.method).toBe('GET');
  });

  it('should POST to create with correct URL and body', () => {
    const p = new Product(0, 'John DOE', '', 10, 100);
    service.createProduct(p).subscribe();
    const req = httpMock.expectOne(`${service.apiUrlProduct}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(p);
  });

  it('should PUT to update with correct URL and body', () => {
    const p = new Product(5, 'John DOE', '', 20, 200);
    service.updateProduct(p).subscribe();
    const req = httpMock.expectOne(`${service.apiUrlProduct}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(p);
  });

  it('should DELETE with correct URL', () => {
    service.deleteProductById(99).subscribe();
    const req = httpMock.expectOne(`${service.apiUrlProduct}/99`);
    expect(req.request.method).toBe('DELETE');
  });

});