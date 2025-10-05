import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient  ) { }

  // Login
  login(data : any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/login`, data);
  }

  // Forget Password
  forgetpass(data : any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/forgetpasswordphone`, data);
  }

  // Confirm Password
  confirmpass(data : any): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/auth/resetPasswordphone`, data);
  }

}
