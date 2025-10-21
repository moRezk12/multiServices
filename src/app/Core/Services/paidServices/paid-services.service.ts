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





}
