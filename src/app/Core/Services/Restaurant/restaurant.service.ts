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

  // Update Restaurant
  updateRestaurant(restaurantId: string, data: any): Observable<any> {
  const formData = new FormData();

  Object.keys(data).forEach(key => {
    if (key === 'image' || key === 'menuImages') {
      if (data[key]) {
        if (key === 'image') {
          // ✅ لو الصورة القديمة (مش فايل جديد)
          if (data.image.secure_url) {
            formData.append('image', JSON.stringify(data.image)); // 👈 نحولها JSON string
          }
          // ✅ لو المستخدم اختار فايل جديد
          else if (data.image instanceof File) {
            formData.append('image', data.image);
          }
        }
        // ✅ لو الصور المتعددة (menuImages)
        else if (key === 'menuImages') {
          data.menuImages.forEach((file: any) => {
            if (file instanceof File) {
              formData.append('menuImages', file); // فايل جديد
            } else if (file.secure_url) {
              // ✅ نحول الصورة القديمة إلى JSON string
              formData.append('menuImages', JSON.stringify(file));
            }
          });
        }
      }
    } else if (key === 'removedMenuImages') {
      // ✅ نضيف كل public_id محذوف
      if (Array.isArray(data.removedMenuImages)) {
        data.removedMenuImages.forEach((id: string) => {
          formData.append('removedMenuImages', id);
        });
      }
    } else {
      formData.append(key, data[key]);
    }
  });


    return this.http.patch(`${environment.apiUrl}/auth/updateRestaurant/${restaurantId}`, formData);
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
    const formData = new FormData();

    // نمشي على كل المفاتيح في الفورم
    Object.keys(data).forEach(key => {
      if (key === 'images') {
        // لو الحقل هو صور متعددة
        if (data[key]) {
          if (Array.isArray(data[key])) {
            // لو array => نضيف كل صورة لوحدها
            data[key].forEach((file: File) => formData.append(key, file));
          }
        }
      } else {
        // باقي الحقول العادية (string / number)
        formData.append(key, data[key]);
      }
    });

    // POST request للـ API
    return this.http.post(`${environment.apiUrl}/auth/createProduct`, formData);
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
    const formData = new FormData();

    // نمشي على كل المفاتيح في الفورم
    Object.keys(data).forEach(key => {
      if (key === 'images') {
        // لو الحقل هو صور متعددة
        if (data[key]) {
          if (Array.isArray(data[key])) {
            // لو array => نضيف كل صورة لوحدها
            data[key].forEach((file: File) => formData.append(key, file));
          }
        }
      } else {
        // باقي الحقول العادية (string / number)
        formData.append(key, data[key]);
      }
    });

    return this.http.patch(`${environment.apiUrl}/auth/updateProduct/${productId}`, formData);
  }

}
