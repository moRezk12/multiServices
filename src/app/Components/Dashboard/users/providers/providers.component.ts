import { UserService } from 'src/app/Core/Services/user/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.css']
})
export class ProvidersComponent implements OnInit {

  activeTab: string = 'Doctor'; // الافتراضي
  providers: any[] = [];

  // showModal
  showModal : boolean = false;

      // Pagination
    currentPage: number = 1;
    totalPages: number = 1;
    totalUsers: number = 0;
    visiblePages: number[] = [];

  constructor(private userService : UserService) { }
  ngOnInit(): void {
    // Initialize or fetch data if needed
    this.getAllProviders(this.activeTab , this.currentPage);

            // Pagination
    this.updateVisiblePages();

  }

   // Pagination
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.getAllProviders(this.activeTab, page);
    }
  }

  updateVisiblePages() {
    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(this.totalPages, startPage + 4);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    this.visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  trackBy(index: number, user: any): number {
    return user.id;
  }

  setActive(tab: string) {
    this.activeTab = tab;

    this.getAllProviders(tab);

  }
  // Get all providers
  getAllProviders(serviceType: string , page: number = 1) {
    this.userService.getProviders(serviceType).subscribe({
      next: (res) => {
        console.log(res);
        this.providers = res.data;
                this.totalPages = res.pages;
        this.totalUsers = res.total;
        this.currentPage = res.page;
      },
      error: (err) => {
        console.error('Error fetching providers:', err);
      }
    });
  }

  // Close modal
  closeModal() {
    this.showModal = false;
  }

  // Open view modal
selectedProvider: any = null;

openViewModal(provider: any) {
  this.selectedProvider = provider; // خزن البيانات
  this.showModal = true;
  console.log('Provider details:', provider);
}



}
