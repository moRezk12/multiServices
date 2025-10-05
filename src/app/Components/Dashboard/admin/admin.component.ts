import { AdminService } from './../../../Core/Services/Admin/admin.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  showModal = false;
  show: boolean = false;
  mode : boolean = false;
  admins: any[] = []; // Array to hold restaurant data

  // Form Group
  adminForm! : FormGroup;

  accountType : string = 'Admin' ;

  constructor( private adminService : AdminService ,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    // Initialize the form
    this.adminForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      accountType: ['', [Validators.required]],
    });

    // Initialize or fetch data if needed
    this.getAlladmins(this.accountType);
  }


  trackBy(index: number, restaurant: any): number {
    return restaurant.id;
  }


  // Get all admins
  getAlladmins(admin: string) {
    console.log(this.accountType);

    this.adminService.getAdmins(admin).subscribe({
      next: (res) => {
        console.log(res);
        this.admins = res.data;
      },
      error: (err) => {
        console.error('Error fetching admins:', err);
      }
    });
  }

  // Open the modal to add a new restaurant
  openAddModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.adminForm.reset();
    this.adminForm.enable();
    this.mode = false;
    this.viewData = false;
  }

  // Submit the form
  onSubmit() {
    console.log(this.adminForm.value);

    if (this.adminForm.valid) {
      const formData = this.adminForm.value;

      if(!this.mode) {
        this.adminService.addAdmin(formData).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: res.message || 'Success',
            text: 'Restaurant added successfully!',
            confirmButtonColor: '#28a745',
            confirmButtonText: 'OK',
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            this.getAlladmins(this.accountType);
            this.closeModal();
            this.adminForm.reset();
          });
        },
        error: (err) => {
          console.error('Error adding restaurant:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to add restaurant. Please try again.',
            confirmButtonColor: '#d33',
            confirmButtonText: 'Close',
            timer: 2000,
            timerProgressBar: true,
          });
        }
      });
      } else {
        this.adminService.updateAdmin(this.selectedId, formData).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: res.message || 'Success',
              text: 'Restaurant updated successfully!',
              confirmButtonColor: '#28a745',
              confirmButtonText: 'OK',
              timer: 2000,
              timerProgressBar: true,
            }).then(() => {
              this.getAlladmins(this.accountType);
              this.closeModal();
              this.adminForm.reset();
            });
          },
          error: (err) => {
            console.error('Error adding restaurant:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to update restaurant. Please try again.',
              confirmButtonColor: '#d33',
              confirmButtonText: 'Close',
              timer: 2000,
              timerProgressBar: true,
            });
          }
        });
      }

    } else {
      console.error('Form is invalid');
    }

  }


  // Open the modal to edit a restaurant
  selectedId: number | null = null;
  openEditModal(restaurant: any) {

    console.log('restaurant', restaurant);
    this.selectedId = restaurant._id;

    this.adminForm.get('password')?.clearValidators();

    this.showModal = true;
    this.mode = true; // Set mode to edit
    this.adminForm.patchValue({
      fullName: restaurant.fullName,
      email: restaurant.email,
      password: restaurant.password,
      accountType: restaurant.accountType,
    });


  }

  // Delete a restaurant
  deleteRestaurant(restaurantId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteAdmin(restaurantId).subscribe({
          next: (res) => {
            Swal.fire(
              'Deleted!',
              'Your restaurant has been deleted.',
              'success'
            );
            this.getAlladmins(this.accountType);
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

  //
  viewData : boolean = false;
  openViewModal(restaurant: any) {
    this.viewData = true;
    console.log('restaurant', restaurant);


    this.show = true;
    this.showModal = true;
    this.adminForm.patchValue({
      fullName: restaurant.fullName,
      email: restaurant.email,
      password: restaurant.password,
      accountType: restaurant.accountType,
    });

    this.adminForm.disable();




  }
}
