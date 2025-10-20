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



  // deleteSupermarket
  deleteSupermarket(id : any): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/auth/deleteSupermarket/${id}` );
  }

  // Add Supermarket
  addSupermarket(data: any): Observable<any> {


    return this.http.post(`${environment.apiUrl}/auth/createSupermarket`, data);
  }

  // Update Supermarket
  updateSupermarket(id : any , data: any): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/auth/updateSupermarket/${id}`, data);
  }


  // All Sections
  getAllSections(id : any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/auth/getSupermarketSections/${id}` );
  }

  // Add Section
  addSection (id : any , data: any): Observable<any> {

    return this.http.post(`${environment.apiUrl}/auth/addSection/${id}`, data);
  }

  updateSection(id : any , data: any): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/auth/updateSection/${id}`, data);
  }

  deleteSection(id : any): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/auth/deleteSection/${id}` );
  }


  // All Products

  addProduct (id : any , data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/addProduct/${id}`, data);
  }


  updateProduct(id : any , data: any): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/auth/updateProductsupermarket/${id}`, data);
  }


  deleteProduct(id : any): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/auth/deleteProducts/${id}` );
  }

    // Add Authorization
  addAuthorization(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/addAuthorizedUserToSupermarket`, data);
  }


}
