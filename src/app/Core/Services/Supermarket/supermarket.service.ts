import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SupermarketService {

  constructor(private http : HttpClient) { }

  // Get All Supermarket
  getSupermarket(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/auth/getSupermarketAdmin` );
  }


  // Add Supermarket
  addSupermarket(data: any): Observable<any> {
    const formData = new FormData();

    Object.keys(data).forEach(key => {
      if (key === 'image') {
        if (data[key]) {
          if (Array.isArray(data[key])) {
            data[key].forEach((file: File) => formData.append(key, file));
          } else {
            formData.append(key, data[key]); // صورة واحدة
          }
        }
      } else if (typeof data[key] === 'object' && data[key] !== null) {
        // نحول الـ object (زي name, description) ل JSON
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });

    return this.http.post(`${environment.apiUrl}/auth/createSupermarket`, formData);
  }




  // All Sections
  getAllSections(id : any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/auth/getSupermarketSections/${id}` );
  }

  // Add Section
  addSection (id : any , data: any): Observable<any> {

    return this.http.post(`${environment.apiUrl}/auth/addSection/${id}`, data);
  }


  // All Products

  addProduct (id : any , data: any): Observable<any> {

    const formData = new FormData();

    Object.keys(data).forEach(key => {
      if (key === 'images') { // بدل image بـ images
        if (data[key]) {
          if (Array.isArray(data[key])) {
            data[key].forEach((file: File) => formData.append('images', file));
          } else {
            formData.append('images', data[key]); // fallback لو صورة واحدة
          }
        }
      } else if (typeof data[key] === 'object' && data[key] !== null) {
        // لو عندك object زي name, description لازم تبعته كـ JSON
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });


    return this.http.post(`${environment.apiUrl}/auth/addProduct/${id}`, formData);
  }


    // Add Authorization
  addAuthorization(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/addAuthorizedUserToSupermarket`, data);
  }



}
