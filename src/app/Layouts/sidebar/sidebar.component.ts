import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

 constructor(private _router: Router) { }

links = [
  { url: '/admin', name: 'Admin', icon: 'fa-user' },
  { url: '/restaurant', name: 'Restaurant', icon: 'fa-utensils' },
  { url: '/add-supermarket', name: 'Supermarket', icon: 'fa-shopping-cart' },
  {
    name: 'User',
    children: [
      { url: '/customer', name: 'Customer', icon: 'fa-user' },
      { url: '/provider', name: 'Provider', icon: 'fa-user-tie' }
    ]
  },
  // {
  //   name: 'Supermarket',
  //   children: [
  //     { url: '/add-supermarket', name: 'Add-Supermarket', icon: 'fa-user' },
  //     // { url: '/add-section', name: 'Add-Section', icon: 'fa-user-tie' },
  //     // { url: '/add-product', name: 'Add-Product', icon: 'fa-user-tie' },
  //   ]
  // },
]

Logout() {
  localStorage.clear();
  this._router.navigate(['/login']);
}

// هنا بنخزن اسم الـ dropdown المفتوح
openDropdown: string | null = null;

toggleDropdown(name: string) {
  this.openDropdown = this.openDropdown === name ? null : name;
}



}
