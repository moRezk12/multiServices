import { UserService } from 'src/app/Core/Services/user/user.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  // show modal
  showModal: boolean = false;

  users: any[] = []; // Array to hold user data

  searchTerm: string = '';

    // Pagination
    currentPage: number = 1;
    totalPages: number = 1;
    totalUsers: number = 0;
    visiblePages: number[] = [];

  constructor(private UserService : UserService) { }

  ngOnInit(): void {

    // Initialize or fetch data if needed
    this.getAllUsers(this.currentPage);

        // Pagination
    this.updateVisiblePages();
  }

    filteredProviders() {
  if (!this.searchTerm) {
    return this.users;
  }

  const term = this.searchTerm.toLowerCase();

  return this.users.filter((user: any) =>
    (user.email && user.email.toLowerCase().includes(term)) ||
    (user.phone && user.phone.toLowerCase().includes(term))
  );
}

  trackBy(index: number, user: any): number {
    return user.id;
  }

  // Get all users
  getAllUsers(page: number = 1) {
    this.UserService.getUsers(page).subscribe({
      next: (res) => {
        console.log(res);
        this.users = res.data;
        this.totalPages = res.pages;
        this.totalUsers = res.total;
        this.currentPage = res.page;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }



    // Pagination
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.getAllUsers(page);
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


    // Close modal
  closeModal() {
    this.showModal = false;
  }

  // Open view modal
  selectedProvider: any = null;
  openViewModal(provider: any) {
    this.showModal = true;
    console.log('Provider details:', provider);
    this.selectedProvider = provider;

  }


  onDelete(user: any) {
    console.log(user._id);
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action will permanently delete the restaurant!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.UserService.deleteUser(user._id).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: res.message || 'Success',
              text: 'Restaurant deleted successfully!',
              confirmButtonColor: '#28a745',
              confirmButtonText: 'OK',
              timer: 2000,
              timerProgressBar: true,
            }).then(() => {
              this.getAllUsers(this.currentPage);
            });
          },
          error: (err) => {
            console.error('Error deleting restaurant:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete restaurant. Please try again.',
              confirmButtonColor: '#d33',
              confirmButtonText: 'Close',
              timer: 2000,
              timerProgressBar: true,
            });
          }
        });
      }
    });

  }


}
