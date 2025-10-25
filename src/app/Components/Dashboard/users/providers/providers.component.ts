import { UserService } from 'src/app/Core/Services/user/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.css']
})
export class ProvidersComponent implements OnInit {

  searchTerm: string = '';

  activeTab: string = 'Doctor' ; // الافتراضي
  providers: any[] = [];

  DoctorForm! : FormGroup;
  DriverForm! : FormGroup;

  // showModal
  showModal : boolean = false;

      // Pagination
    currentPage: number = 1;
    totalPages: number = 1;
    totalUsers: number = 0;
    visiblePages: number[] = [];

  constructor(private userService : UserService , private fb: FormBuilder) { }
  ngOnInit(): void {
    // Initialize or fetch data if needed
    this.getAllProviders(this.activeTab , this.currentPage);

            // Pagination
    this.updateVisiblePages();

    this.DoctorForm = this.fb.group({
      addDays: ['' , [Validators.required]],
    })

    this.DriverForm = this.fb.group({
      kiloPrice: [null, [Validators.required, Validators.min(0)]],
      isAgree: [false, [Validators.requiredTrue]],
      totalPoints: [null],
    });


  }

  filteredProviders() {
  if (!this.searchTerm) {
    return this.providers;
  }

  const term = this.searchTerm.toLowerCase();

  return this.providers.filter((driver: any) =>
    (driver.email && driver.email.toLowerCase().includes(term)) ||
    (driver.phone && driver.phone.toLowerCase().includes(term))
  );
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

  showEditModalDoctor: boolean = false;
  selectIdDotor : any ;
  showEditModalDriver: boolean = false;
  selectIdDriver : any ;

  openEditModalDoctor(doctor:any){
    this.showEditModalDoctor = true;
    this.selectIdDotor = doctor._id
  }

  closeEditModalDoctor(){
    this.showEditModalDoctor = false;
  }

  openEditModalDriver(driver :any ){
    this.showEditModalDriver = true;
    this.selectIdDriver = driver._id;

    this.DriverForm.patchValue({
      kiloPrice: driver.kiloPrice,
      isAgree: driver.isAgree,
      totalPoints: driver.totalPoints
    });


  }

  closeEditModalDriver(){
    this.showEditModalDriver = false;
  }

  saveChangesDoctor(){

    console.log(this.DoctorForm.value);
    this.userService.editDotorOrRealEstate(this.selectIdDotor , this.DoctorForm.value).subscribe({
      next: (res) => {
        console.log(res);
        Swal.fire({
          icon: 'success',
          title: res.message || 'Success',
          text: 'Subscription updated successfully!',
          confirmButtonColor: '#28a745',
          timer: 2500,
        }).then(() => {
          this.getAllProviders(this.activeTab);
          this.closeEditModalDoctor();
        })
      },
      error: (err) => {
        console.error('Error fetching providers:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update provider. Please try again.',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Close',
          timer: 2000,
          timerProgressBar: true,
        })
      }
    })

  }


  saveChangesDriver(){

    console.log(this.DriverForm.value);
    this.userService.editDriverOrDelivery(this.selectIdDriver , this.DriverForm.value).subscribe({
      next: (res) => {
        console.log(res);
        Swal.fire({
          icon: 'success',
          title: res.message || 'Success',
          text: 'Subscription updated successfully!',
          confirmButtonColor: '#28a745',
          timer: 2500,
        }).then(() => {
          this.getAllProviders(this.activeTab);
          this.closeEditModalDriver();
        })
      },
      error: (err) => {
        console.error('Error fetching providers:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update provider. Please try again.',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Close',
          timer: 2000,
          timerProgressBar: true,
        })
      }
    })

  }



  showFullImage = false;
  fullImageUrl: string | null = null;

  openFullImage(url: string) {
    this.fullImageUrl = url;
    this.showFullImage = true;
  }

  closeFullImage() {
    this.showFullImage = false;
    this.fullImageUrl = null;
  }



  showTotalProfits = false;

  totalProficts : any
  openTotalProfitsModal(driver: any) {
    console.log(driver);
    this.userService.getTotalProfits(driver._id).subscribe({
      next: (res) => {
        console.log(res);
        this.showTotalProfits = true;
        this.totalProficts = res.data

      },
      error: (err) => {
        console.error('Error fetching providers:', err);
      }
    })

  }

  closeshowTotalProfits() {
    this.showTotalProfits = false;
  }


    showDlivery = false;

  totalDlivery : any
  openDliveryModal(driver: any) {
    console.log(driver);
    this.userService.getDriverOrdersStats(driver._id).subscribe({
      next: (res) => {
        console.log(res);
        this.showDlivery = true;
        this.totalDlivery = res.data

      },
      error: (err) => {
        console.error('Error fetching providers:', err);
      }
    })

  }

  closeshowDlivery() {
    this.showDlivery = false;
  }



}
