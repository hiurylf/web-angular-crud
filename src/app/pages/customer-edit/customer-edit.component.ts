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
import {ConstantsService} from '../../services/constants/constants.service';
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

  constructor(private router: Router,
              private utils: UtilsService,
              private vehicleService: VehicleService,
              private customerService: CustomerService,
              private formBuilder: FormBuilder,
              public constants: ConstantsService,
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

  async ngOnInit(): Promise<void> {
    await this.getVehicleBrands();

    await this.activatedRoute.params.subscribe(async params => {
      if (params && params.id) {
        await this.getCustomer(params.id);
      }
    });
  }

  async saveCustomer(): Promise<void> {
    const model = this.vehicleModels.find(mod => {
      return mod.codigo === this.form.controls.vehicleModelCode.value;
    });
    this.form.controls.vehicleModelName.setValue(model.nome);
    await this.customerService.createOrUpdate(this.form.value).subscribe(() => {
      this.utils.showMessage('Cliente salvo com sucesso!');
      this.router.navigate(['/customers']);
    }, error => {
      this.utils.showMessage(error);
    });
  }

  async getCustomer(id: string): Promise<void> {
    await this.customerService.getById(id).subscribe((customer: Customer) => {
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
      this.utils.showMessage(`Error ao buscar a cliente.)`);
    });
  }

  async getVehicleModels(brandCod: string): Promise<void> {
    this.loading = true;
    await this.vehicleService.getModelsByCodeBrand(brandCod).subscribe(res => {
      if (res && res.modelos && Array.isArray(res.modelos)) {
        this.vehicleModels = res.modelos;
      }
      this.loading = false;
    }, (error: HttpErrorResponse) => {
      this.utils.showMessage(`Error ao buscar a lista de modelos. (Código: ${error.status})`);
    });
  }

  async getVehicleBrands(): Promise<void> {
    await this.vehicleService.getBrands().subscribe((brands: VehicleBrandModel[]) => {
      if (brands && Array.isArray(brands)) {
        this.vehicleBrands = brands;
      }
    }, (error: HttpErrorResponse) => {
      this.utils.showMessage(`Error ao buscar a lista de marcas. (Código: ${error.status})`);
    });
  }

  stateChange(uf: string, resetCityForm: boolean = false): void {
    if (resetCityForm) {
      this.form.controls.city.reset();
    }
    this.availableCitys = [];
    if (this.constants && this.constants.city && Array.isArray(this.constants.city)) {
      this.availableCitys = this.constants.city.filter(item => {
        return item.uf === uf;
      });
    } else {
      this.availableCitys = [];
    }
  }

  async brandChange(brand: string, resetModelForm: boolean = false): Promise<void> {
    if (resetModelForm) {
      this.form.controls.vehicleModelCode.reset();
      this.form.controls.vehicleModelName.reset();
    }
    this.vehicleModels = [];
    await this.getVehicleModels(brand);
  }

}
