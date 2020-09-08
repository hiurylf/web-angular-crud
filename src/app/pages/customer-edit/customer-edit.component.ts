import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';

import {UtilsService} from '../../services/utils/utils.service';
import {VehicleService} from '../../services/vehicle/vehicle.service';
import {CustomerService} from '../../services/customer/customer.service';

import {Customer} from '../../models/class/customer/customer';
import {VehicleModelModel} from '../../models/interface/vehicle-model.model';
import {VehicleBrandModel} from '../../models/interface/vehicle-brand.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { city, uf} from '../../services/constants/constants';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss']
})
export class CustomerEditComponent implements OnInit {

  customer: Customer = new Customer();
  form: FormGroup;
  vehicleBrands: VehicleBrandModel[] = [];
  vehicleModels: VehicleModelModel[] = [];
  availableCitys: { municipio: string, uf: string }[] = [];
  editMode: boolean = false;
  loading: boolean = false;

  city = city;
  uf = uf;

  constructor(private router: Router,
              private utils: UtilsService,
              private vehicleService: VehicleService,
              private customerService: CustomerService,
              private formBuilder: FormBuilder,
              private dialog: MatDialog,
              private activatedRoute: ActivatedRoute) {

    this.form = this.formBuilder.group({
      id: [Date.now()],
      name: ['', Validators.compose([Validators.required])],
      cpf: ['', Validators.compose([Validators.required, this.utils.cpfValidatetoForms()])],
      phone: ['', Validators.compose([Validators.required])],
      birth: ['2000-01-01', Validators.compose([Validators.required])],
      address: ['', Validators.compose([Validators.required])],
      city: ['', Validators.compose([Validators.required])],
      state: ['', Validators.compose([Validators.required])],
      vehicleBrandCode: [null, Validators.compose([Validators.required])],
      vehicleModelCode: [null, Validators.compose([Validators.required])],
      vehicleModelName: [''],
    });
  }

  ngOnInit(): void {
    this.getVehicleBrands();

    this.activatedRoute.params.subscribe(params => {
      if (params && params.id) {
        this.getCustomer(params.id);
      }
    });
  }

  saveCustomer(): void {
    const model = this.vehicleModels.find(mod => {
      return mod.codigo === this.form.controls.vehicleModelCode.value;
    });
    this.form.controls.vehicleModelName.setValue(model.nome);
    this.customerService.createOrUpdate(this.form.value).subscribe(() => {
      this.utils.showMessage('Cliente salvo com sucesso!');
      this.router.navigate(['/customers']);
    }, error => {
      this.utils.showMessage(error);
    });
  }

  getCustomer(id: string): void {
    this.customerService.getById(id).subscribe((customer: Customer) => {
      this.editMode = true;
      this.form.patchValue(customer);
      if (customer) {
        if (customer.vehicleBrandCode) {
          this.getVehicleModels(customer.vehicleBrandCode);
        }
        if (customer.state) {
          this.stateChange(customer.state);
        }
      }
    }, () => {
      this.utils.showMessage(`Error ao buscar o cliente.`);
    });
  }

  getVehicleModels(brandCod: string): void {
    this.loading = true;
    this.vehicleService.getModelsByCodeBrand(brandCod).subscribe(res => {
      if (res && res.modelos && Array.isArray(res.modelos)) {
        this.vehicleModels = res.modelos;
      }
      this.loading = false;
    }, (error: HttpErrorResponse) => {
      this.utils.showMessage(`Error ao buscar a lista de modelos. (Código: ${error.status})`);
    });
  }

  getVehicleBrands(): void {
    this.vehicleService.getBrands().subscribe((brands: VehicleBrandModel[]) => {
      if (brands && Array.isArray(brands)) {
        this.vehicleBrands = brands;
      }
    }, (error: HttpErrorResponse) => {
      this.utils.showMessage(`Error ao buscar a lista de marcas. (Código: ${error.status})`);
    });
  }

  stateChange(ufParam: string, resetCityForm: boolean = false): void {
    if (resetCityForm) {
      this.form.controls.city.reset();
    }
    this.availableCitys = [];
    if (this.city && Array.isArray(this.city)) {
      this.availableCitys = this.city.filter(item => {
        return item.uf === ufParam;
      });
    } else {
      this.availableCitys = [];
    }
  }

  brandChange(brand: string, resetModelForm: boolean = false): void {
    if (resetModelForm) {
      this.form.controls.vehicleModelCode.reset();
      this.form.controls.vehicleModelName.reset();
    }
    this.vehicleModels = [];
    this.getVehicleModels(brand);
  }

}
