import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {

  private token$ = new BehaviorSubject<string>(localStorage.getItem('token') || '');
  tokenObservable = this.token$.asObservable();

  private accountType$ = new BehaviorSubject<string>(localStorage.getItem('accountType')?.trim().toLowerCase() || '');
  accountTypeObservable = this.accountType$.asObservable();

  constructor(private _router: Router) { }

  setToken(token: string) {
    localStorage.setItem('token', token);
    this.token$.next(token);
  }

  getToken(): string {
    return this.token$.getValue();
  }

  clearLocalStorage() {
    localStorage.clear();
    this._router.navigate(['/login']);

  }


  setAccountType(type: string) {
    // إزالة أي علامات اقتباس زائدة
    const cleanType = type.replace(/['"]+/g, '').trim().toLowerCase();
    localStorage.setItem('accountType', cleanType);
    this.accountType$.next(cleanType);
  }

  getAccountType(): string {
    return this.accountType$.getValue().replace(/['"]+/g, '').trim().toLowerCase();
  }

}
