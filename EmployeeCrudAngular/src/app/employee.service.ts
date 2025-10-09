import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './employee.model';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { environment } from '../environments/environment'; // Importa el environment


@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  apiUrlEmployee = environment.apiUrl;  // Usa el valor de environment (ahora apunta a /api/Product)

  constructor(private http: HttpClient, private datepipe: DatePipe) {}

  getAllEmployee(): Observable<Product[]> {
    return this.http
      .get<Product[]>(this.apiUrlEmployee)
      .pipe(
        map((data: Product[]) =>
          data.map(
            (item: Product) =>
              new Product(
                item.id,
                item.name,
                this.datepipe
                  .transform(item.createdDate, 'dd/MM/yyyy HH:mm:ss',undefined)
                  ?.toString()
                , item.stock ?? 0
              )
          )
        )
      );
  }


  getEmployeeById(employeeId: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrlEmployee}/${employeeId}`);
  }
  createEmployee(employee: Product): Observable<Product> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post<Product>(this.apiUrlEmployee, employee, httpOptions);
  }
  updateEmployee(employee: Product): Observable<Product> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.put<Product>(this.apiUrlEmployee, employee, httpOptions);
  }

  deleteEmployeeById(employeeid: number) {
    return this.http.delete(`${this.apiUrlEmployee}/${employeeid}`);
  }
}
