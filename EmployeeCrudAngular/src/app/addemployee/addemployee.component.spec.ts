import { TestBed } from '@angular/core/testing';
import { AddemployeeComponent } from './addemployee.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs'; // para simular observables
import { DatePipe } from '@angular/common';
import { EmployeeService } from '../employee.service';
import { ToastService } from '../toast.service';
import { Product } from '../employee.model';

describe('AddemployeeComponent', () => {
  let mockEmployeeService: any;
  let mockToastService: any;

  beforeEach(() => {
    mockEmployeeService = {
      createEmployee: jasmine.createSpy('createEmployee').and.returnValue(of({})),
      updateEmployee: jasmine.createSpy('updateEmployee').and.returnValue(of({})),
      getEmployeeById: jasmine.createSpy('getEmployeeById').and.returnValue(of({ id: 1, name: 'John DOE' })),
      getAllEmployee: jasmine.createSpy('getAllEmployee').and.returnValue(of([]))
    };

    mockToastService = {
      showError: jasmine.createSpy('showError'),
      showSuccess: jasmine.createSpy('showSuccess')
    };

    TestBed.configureTestingModule({
      imports: [AddemployeeComponent, HttpClientTestingModule],
      providers: [
        DatePipe,
        {
          provide: ActivatedRoute, // Simula ActivatedRoute
          useValue: {
            params: of({ id: 1 }) // simula el parámetro id en la URL
          }
        },
        { provide: EmployeeService, useValue: mockEmployeeService },
        { provide: ToastService, useValue: mockToastService }
      ]
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AddemployeeComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should show toast and not call API when name contains digits', () => {
    const fixture = TestBed.createComponent(AddemployeeComponent);
    const component = fixture.componentInstance;
    const emp = new Product(0, 'John D0e', '', 0);
    component.addEmployee(emp);
    expect(mockToastService.showError).toHaveBeenCalled();
    expect(mockEmployeeService.createEmployee).not.toHaveBeenCalled();
  });

  it('should show toast and not call API when name has excessive repeats', () => {
    const fixture = TestBed.createComponent(AddemployeeComponent);
    const component = fixture.componentInstance;
    const emp = new Product(0, 'Juuuuaannnn Perez', '', 0);
    component.addEmployee(emp);
    expect(mockToastService.showError).toHaveBeenCalled();
    expect(mockEmployeeService.createEmployee).not.toHaveBeenCalled();
  });

  it('should format name before calling API', () => {
    const fixture = TestBed.createComponent(AddemployeeComponent);
    const component = fixture.componentInstance;
    const emp = new Product(0, 'juan carlos chamizo', '', 0);
    component.addEmployee(emp);
    expect(emp.name).toBe('Juan Carlos CHAMIZO');
    expect(mockEmployeeService.createEmployee).toHaveBeenCalled();
  });
});