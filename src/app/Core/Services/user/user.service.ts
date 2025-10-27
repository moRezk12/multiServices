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


    editDotorOrRealEstate( id : any , data: any): Observable<any> {
      return this.http.patch(`${environment.apiUrl}/auth/updateSubscription/${id}`, data);
    }

    editDriverOrDelivery( id : any , data: any): Observable<any> {
      return this.http.patch(`${environment.apiUrl}/auth/updateUser/${id}`, data);
    }


    // Total Profits
    getTotalProfits(id : any): Observable<any> {
      return this.http.get(`${environment.apiUrl}/auth/getDriverStats/${id}`);
    }


    // getDriverOrdersStats
    getDriverOrdersStats(id : any): Observable<any> {
      return this.http.get(`${environment.apiUrl}/auth/getDriverOrdersStats/${id}`);
    }

    // Delete User
    deleteUser(id: any): Observable<any> {
      return this.http.delete(`${environment.apiUrl}/auth/deleteUserByOwner/${id}`);
    }

}
