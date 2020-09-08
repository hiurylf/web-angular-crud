import {VehicleModelModel} from '../../interface/vehicle-model.model';
import {VehicleBrandModel} from '../../interface/vehicle-brand.model';

export class Customer {
  id?: number;
  name: string;
  cpf: string;
  phone: string;
  birth: string;
  address: string;
  city: string;
  state: string;
  vehicleBrandCode: string;
  vehicleModelCode: number;
  vehicleModelName: string;
}
