import {Injectable} from '@angular/core';
import {Customer} from '../../models/class/customer/customer';
import {StorageMap} from '@ngx-pwa/local-storage';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private storage: StorageMap) {
  }


  /**
   * Delete one user of localStorage
   * @param id of the user.
   */
  delete(id: number): Observable<Customer[] | string | unknown> {
    return new Observable(subscriber => {

      this.storage.get('customer').subscribe((customers: Customer[]) => {

        if (customers && Array.isArray(customers) && customers.length > 0) {

          const indexCustomer = customers.findIndex(item => item.id === id);
          if (indexCustomer >= 0) {
            customers.splice(indexCustomer, 1);
            this.storage.set('customer', customers).subscribe( () => {
              subscriber.next('Cliente deletado com sucesso!');
            }, () => {
              subscriber.error('Error ao salvar cliente.');
            });
          } else {
            subscriber.error('Cliente não encontrado');
          }
        } else {
          subscriber.error('Lista de clientes vazia');
        }
      });
    });
  }

  /**
   * Get all customers
   * @returns A Observable of Customer[]
   */
  getAll(): Observable<Customer[] | unknown> {
    return this.storage.get('customer');
  }

  /**
   * Create or update a customer to localStorage.
   * @param customer A customer.
   * @returns A Observable that returns to 'string message'.
   */
  createOrUpdate(customer: Customer): Observable<string | unknown> {
    return new Observable(subscriber => {

      this.storage.get('customer').subscribe((customers: Customer[]) => {

        if (customers && Array.isArray(customers) && customers.length > 0) {

          const indexCustomer = customers.findIndex(item => item.id === customer.id);

          if (indexCustomer >= 0) {
            customers[indexCustomer] = customer;
            this.storage.set('customer', customers).subscribe( () => {
              subscriber.next('Cliente alterado com sucesso!');
            }, () => {
              subscriber.error('Error ao salvar cliente.');
            });
          } else {
            customers.push(customer);
            this.storage.set('customer', customers).subscribe( () => {
              subscriber.next('Cliente criado com sucesso!');
            }, () => {
              subscriber.error('Error ao salvar cliente.');
            });
          }
        } else {
          this.storage.set('customer', [customer]).subscribe( () => {
            subscriber.next('Cliente criado com sucesso!');
          }, () => {
            subscriber.error('Error ao salvar cliente.');
          });
        }
      });
    });
  }

  /**
   * Get one customer from localStorage.
   * @param id The customer ID.
   * @returns A Observable that returns a Customer when is succeeds,
   * or a 'string error' on error.
   */
  getById(id: string): Observable<Customer | string> {
    return new Observable(subscriber => {
      this.storage.get('customer').subscribe((customers: Customer[]) => {

        if (customers && Array.isArray(customers) && customers.length > 0) {

          const indexCustomer = customers.findIndex(item => item.id === Number(id));

          if (indexCustomer >= 0) {
            subscriber.next(customers[indexCustomer]);
          } else {
            subscriber.error('Cliente não encontrado');
          }
        } else {
          subscriber.error('Lista de clientes vazia');
        }
        subscriber.complete();
      });
    });
  }


}


