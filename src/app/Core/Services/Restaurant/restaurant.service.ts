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

    return this.http.post(`${environment.apiUrl}/auth/createRestaurant`, data);
  }

  // Update Restaurant
  updateRestaurant(restaurantId: string, data: any): Observable<any> {

      return this.http.patch(`${environment.apiUrl}/auth/updateRestaurant/${restaurantId}`, data);
  }




  // Delete Restaurant
  deleteRestaurant(restaurantId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/auth/deleteRestaurant/${restaurantId}`);
  }



  // Add Authorization
  addAuthorization(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/addAuthorizedUser`, data);
  }




  // ===============================  Product   ===============================================


  // Add Product to Restaurant
  addProductToRestaurant(data: any): Observable<any> {

    return this.http.post(`${environment.apiUrl}/auth/createProduct`,data);
  }

  // Get Products by Restaurant ID
  getProductsByRestaurantId(restaurantId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/auth/getMyRestaurantsProducts/${restaurantId}`);
  }

  // // Delete Product by ID
  deleteProductById(productId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/auth/deleteProduct/${productId}`);
  }

  // Update Product by ID
updateProductById(productId: string, data: any): Observable<any> {

  return this.http.patch(`${environment.apiUrl}/auth/updateProduct/${productId}`,data);
}


}
