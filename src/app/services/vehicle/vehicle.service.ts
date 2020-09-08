import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {VehicleModelModel} from '../../models/interface/vehicle-model.model';
import {VehicleBrandModel} from '../../models/interface/vehicle-brand.model';


@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  baseApiUrl = 'https://parallelum.com.br/fipe/api/v1/carros/marcas';

  constructor(private http: HttpClient) {
  }

  /**
   * Get a list of customers from localStorage.
   * @param codeBrand A array of customers.
   */
  getModelsByCodeBrand(codeBrand: string): Observable<{modelos: VehicleModelModel[], anos: any[]}> {
    return this.http.get<{modelos: VehicleModelModel[], anos: any[]}>(`${this.baseApiUrl}/${codeBrand}/modelos`);
  }

  /**
   * Get a list of customers from localStorage.
   * @returns A Observable of VehicleBrandModel[]
   */
  getBrands(): Observable<VehicleBrandModel[]> {
    return this.http.get<VehicleBrandModel[]>(this.baseApiUrl);
  }
}
