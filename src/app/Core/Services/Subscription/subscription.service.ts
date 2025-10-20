import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(private http: HttpClient) { }


  // Get All Subscription
  getAllSubscription(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/auth/getAllSubscriptionPlans`);
  }

  // Add Subscription
  addSubscription(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/createSubscriptionPlan`, data);
  }

  // Update Subscription
  updateSubscription(id: any, data: any): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/auth/updateSubscriptionPlan/${id}`, data);
  }

  // Delete Subscription
  deleteSubscription(id: any): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/auth/deleteSubscriptionPlan/${id}`);
  }


}
