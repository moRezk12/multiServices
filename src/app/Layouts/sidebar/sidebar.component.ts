import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/Core/Services/localStorage/local-storage.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  accountType: string = '';
  links = [
    { url: '/admin', name: 'Admin', icon: 'fa-user' },
    { url: '/add-supermarket', name: 'Supermarket', icon: 'fa-shopping-cart' },
    { url: '/restaurant', name: 'Restaurant', icon: 'fa-utensils' },
    { url: '/subscription', name: 'Subscription', icon: 'fa-sync-alt' },
    { url: '/addServices', name: 'Add Services', icon: 'fa-credit-card' },
    { url: '/paidServices', name: 'Paid Services', icon: 'fa-info-circle' },
    { url: '/privacy-policy', name: 'Privacy Policy', icon: 'fa-shield-alt' },
    {
      name: 'Users',
      children: [
        { url: '/customer', name: 'Customer', icon: 'fa-user' },
        { url: '/provider', name: 'Provider', icon: 'fa-user-tie' }
      ]
    },
  ];

  displayLinks: any[] = [];

  constructor(
    private _router: Router,
    private localStorage: LocalStorageService
  ) {}

  ngOnInit() {
    this.localStorage.accountTypeObservable.subscribe(type => {
      // this.accountType = type.trim().toLowerCase();
      this.accountType = type.replace(/['"]+/g, '').trim().toLowerCase();

      this.buildDisplayLinks();
    });
  }

  buildDisplayLinks() {
    console.log('🧩 AccountType:', this.accountType);

    if (this.accountType === 'owner') {
      // ✅ لو Owner → اعرض كل اللينكات
      this.displayLinks = this.links;
    } else {
      // ✅ غير كده → اخفي "Add Services"
      this.displayLinks = this.links
        .filter(item => {
          // استبعد Add Services فقط من العناصر اللي مش children
          if (!item.children && item.name.trim().toLowerCase() === 'add services') {
            return false;
          }
          return true;
        })
        .map(item => {
          if (item.children) {
            const children = item.children.filter(
              (child: any) => child.name.trim().toLowerCase() !== 'add services'
            );
            return { ...item, children };
          }
          return item;
        });
    }

    console.log('✅ Display Links:', this.displayLinks);
  }

  Logout() {
    localStorage.clear();
    this._router.navigate(['/login']);
  }

  openDropdown: string | null = null;
  toggleDropdown(name: string) {
    this.openDropdown = this.openDropdown === name ? null : name;
  }
}
