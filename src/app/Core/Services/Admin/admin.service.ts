import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  // Get All Admins
  getAdmins(accountType: string): Observable<any> {

    return this.http.get(`${environment.apiUrl}/auth/getUsersByOwner?accountType=${accountType}`);
  }

  // Add Admin
  addAdmin(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/createUserByOwner`, data);
  }

  // Update Admin
  updateAdmin(id: any, data: any): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/auth/updateUserByOwner/${id}`, data);
  }

  // Delete Admin
  deleteAdmin(id: any): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/auth/deleteUserByOwner/${id}`);
  }

}
