import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient) { }


    // Get All Users
    getUsers(page?: number): Observable<any> {
      let params = new HttpParams();
      if (page) {
        params = params.set('page', page);
      }
      return this.http.get(`${environment.apiUrl}/auth/getAllNormalUsers` , { params });
    }

    // Providers

    getProviders(servicesType?: string , page?: number): Observable<any> {
      let params = new HttpParams();
      if (servicesType) {
        params = params.set('serviceType', servicesType);
      }
      if (page) {
        params = params.set('page', page);
      }
      return this.http.get(`${environment.apiUrl}/auth/getAllServiceProviders`, { params });
    }


}
