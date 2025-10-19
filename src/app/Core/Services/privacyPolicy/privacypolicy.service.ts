import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PrivacypolicyService {

  constructor(private http: HttpClient) { }

  // get privacy policy
  getPrivacyPolicy(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/auth/getSettings`);
  }

  // add privacy policy
  addPrivacyPolicy(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/createOrUpdateSettings`, data);
  }

  // delete privacy policy
  deletePrivacyPolicy(): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/auth/deleteAppSettings`);
  }

}
