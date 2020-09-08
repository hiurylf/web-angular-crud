import {Component, OnInit, TemplateRef} from '@angular/core';
import {CustomerService} from '../../services/customer/customer.service';
import {Customer} from '../../models/class/customer/customer';
import {UtilsService} from '../../services/utils/utils.service';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  customers: Customer[] = [];
  emptyList: boolean = false;

  constructor(private customerService: CustomerService, private utils: UtilsService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getAllCustomers();
  }

  getAllCustomers(): void {
    this.customerService.getAll().subscribe((res: Customer[]) => {
      if (res && Array.isArray(res) && res.length > 0) {
        this.customers = res;
      } else {
        this.customers = [];
        this.emptyList = true;
      }
    });
  }

  /**
   * Delete a customer from localStorage.
   * @param customer A customer.
   * @returns A void Promise.
   */
  deleteCustomer(customer: Customer): void {
      this.customerService.delete(customer.id).subscribe(() => {
        this.getAllCustomers();
        this.utils.showMessage('Cliente deletado com sucesso!');
      });
  }

  deleteCustomerAlert(template: TemplateRef<any>, customer: Customer): void {
    this.dialog.open(template, {
      data: {customer},
    });
  }
}
