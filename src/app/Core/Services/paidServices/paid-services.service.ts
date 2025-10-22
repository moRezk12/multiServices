import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PaidServicesService {

  constructor(private http: HttpClient) { }

  getAllProviders(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/auth/getAllPaidServices`);
  }


  getAllProvidersDriver(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/auth/getAllPaidServiceDrivers`);
  }


  // Get All Services
  getAllServices(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/auth/getAllPaidServicesadmin`);
  }


  // Add Service
  addService(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/createPaidService`, data);
  }


  // Update Service
  updateService(id: any, data: any): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/auth/updatePaidService/${id}`, data);
  }


  // Delete Service
  deleteService(id: any): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/auth/deletePaidService/${id}`);
  }



}
