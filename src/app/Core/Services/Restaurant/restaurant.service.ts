import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  constructor(private http: HttpClient) { }

  // Get All Restaurants
  getRestaurants(page?: number): Observable<any> {
    let params = new HttpParams();
    if (page) {
      params = params.set('page', page);
    }
    return this.http.get(`${environment.apiUrl}/auth/getOwnerRestaurants`, { params });
  }

  // Add Restaurant
  addRestaurant(data: any): Observable<any> {
    const formData = new FormData();

    // نمشي على كل المفاتيح في الفورم
    Object.keys(data).forEach(key => {
      if (key === 'image' || key === 'menuImages') {
        // لو الحقل هو صورة أو صور متعددة
        if (data[key]) {
          if (Array.isArray(data[key])) {
            // لو array => نضيف كل صورة لوحدها
            data[key].forEach((file: File) => formData.append(key, file));
          } else {
            // صورة واحدة
            formData.append(key, data[key]);
          }
        }
      } else {
        // باقي الحقول العادية (string / number)
        formData.append(key, data[key]);
      }
    });

    // POST request للـ API
    return this.http.post(`${environment.apiUrl}/auth/createRestaurant`, formData);
  }





  // Add Authorization
  addAuthorization(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/addAuthorizedUser`, data);
  }



}
