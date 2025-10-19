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
    if (key === 'image') {
      const image = data[key];
      if (image instanceof File) {
        formData.append('image', image);
      } else if (image && typeof image === 'object' && image.secure_url) {
        // لو الصورة القديمة (object فيه secure_url)
        formData.append('image', JSON.stringify(image));
      }
    }

    else if (key === 'menuImages') {
      const menuImgs = data[key];
      if (Array.isArray(menuImgs)) {
        menuImgs.forEach((img: any) => {
          if (img instanceof File) {
            formData.append('menuImages', img);
          } else if (img && typeof img === 'object' && img.secure_url) {
            // الصورة القديمة
            formData.append('menuImages', JSON.stringify(img));
          }
        });
      }
    }

    else if (key === 'removedMenuImages') {
      if (Array.isArray(data[key])) {
        data[key].forEach((id: string) => {
          formData.append('removedMenuImages', id);
        });
      }
    }

    else {
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

  Object.keys(data).forEach(key => {
    if (key === 'images') {
      if (Array.isArray(data.images) && data.images.length > 0) {
        data.images.forEach((img: any) => {
          // ✅ لو الصورة object فيها secure_url => معناها صورة قديمة => نضيفها كـ string
          if (img && typeof img === 'object' && img.secure_url) {
            formData.append('existingImages', img.secure_url);
          }
          // ✅ لو الصورة File جديد => نضيفها كـ ملف
          else if (img instanceof File) {
            formData.append('images', img);
          }
        });
      }
    } else {
      if (data[key] !== null && data[key] !== undefined)
        formData.append(key, data[key]);
    }
  });

  return this.http.patch(
    `${environment.apiUrl}/auth/updateProduct/${productId}`,
    formData
  );
}


}
