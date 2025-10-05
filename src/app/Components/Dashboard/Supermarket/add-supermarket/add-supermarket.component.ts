import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/Core/Services/Admin/admin.service';
import { SupermarketService } from 'src/app/Core/Services/Supermarket/supermarket.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-supermarket',
  templateUrl: './add-supermarket.component.html',
  styleUrls: ['./add-supermarket.component.css']
})
export class AddSupermarketComponent implements OnInit {

  showModal = false;
  show: boolean = false;
  mode : boolean = false;
  supermarket: any[] = []; // Array to hold restaurant data

  // Form Group
  supermarketForm! : FormGroup;
  autharizaForm! : FormGroup;

  accountType!: string
  role: string = 'staff';

  constructor( private _supermarketService : SupermarketService ,
    private adminService : AdminService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    // Initialize the form
    this.supermarketForm = this.fb.group({
      supermarketLocationLink: ['', [Validators.required, Validators.pattern(/^https:\/\/.+$/)]],
      name: this.fb.group({
        en: ['', [Validators.required]],
        ar: ['', [Validators.required]],
        fr : ['', [Validators.required]],
      }),
      description: this.fb.group({
        en: ['', [Validators.required]],
        ar: ['', [Validators.required]],
        fr : ['', [Validators.required]],
      }),
      isOpen: [false, [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^\+20[0-9]{9}$/)]],
      image: [null, [Validators.required]],
    });

    this.autharizaForm = this.fb.group({
      role: ['staff' , [Validators.required]],
      userId: ['', [Validators.required]],
      supermarketId: [''],
    });

    // Initialize or fetch data if needed
    this.getAllSupermarket();
  }

    admins : any[] = [];
  getAlladmins(  accountType : string) {
    this.adminService.getAdmins(accountType).subscribe({
      next: (res) => {
        console.log(res);
        this.admins = res.data;
      },
      error: (err) => {
        console.error('Error fetching admins:', err);
      }
    });

  }


  // images
// Getter للـ menuImages (FormArray)
get menuImages(): FormArray {
  return this.supermarketForm.get('menuImages') as FormArray;
}

// -----------------------------
// ✅ Single Image
imagePreview: string | null = null;

onImageSelected(event: any) {
  const file: File = event.target.files[0];
  if (file) {
    this.supermarketForm.patchValue({ image: file });
    const reader = new FileReader();
    reader.onload = () => (this.imagePreview = reader.result as string);
    reader.readAsDataURL(file);
  }
}

onRemoveImage(event: MouseEvent) {
  event.stopPropagation(); // يمنع فتح نافذة اختيار صور
  this.supermarketForm.patchValue({ image: null });
  this.imagePreview = null;
}

// -----------------------------





  trackBy(index: number, restaurant: any): number {
    return restaurant.id;
  }


  // Get all supermarket
  getAllSupermarket() {
    console.log('getAllSupermarket');

    this._supermarketService.getSupermarket().subscribe({
      next: (res) => {

        console.log(res);
        this.supermarket = res.data;
      },
      error: (err) => {
        console.error('Error fetching supermarket:', err);
      }
    });
  }

  // Open the modal to add a new restaurant
  openAddModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.supermarketForm.reset();
    this.imagePreview = null;
    // this.supermarketForm.enable();
    this.mode = false;
    this.viewData = false;
  }

  // Submit the form
  onSubmit() {



    if (this.supermarketForm.valid) {
      console.log(this.supermarketForm.value);

      const formData = this.supermarketForm.value;
      this._supermarketService.addSupermarket(formData).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: res.message || 'Success',
            text: 'Restaurant added successfully!',
            confirmButtonColor: '#28a745',
            confirmButtonText: 'OK',
            timer: 2000,
            timerProgressBar: true,
            customClass: {
              popup: 'custom-popup',
              confirmButton: 'custom-confirm',
              title: 'custom-title',
              htmlContainer: 'custom-text',
            }
          }).then(() => {
            this.getAllSupermarket();
            this.closeModal();
            this.supermarketForm.reset();
            // this.menuImages.clear();
            this.imagePreview = null;
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
      console.error('Form is invalid');
    }

  }


  // Open the modal to edit a restaurant
  openEditModal(supermarket: any) {

    console.log('supermarket', supermarket);

    this.showModal = true;
    this.show = false;
    this.mode = true; 
    this.supermarketForm.patchValue({
      isOpen: supermarket.isOpen,
      phone: supermarket.phone,
      supermarketLocationLink: supermarket.supermarketLocationLink,
    });

    this.supermarketForm.get('name')?.patchValue({
      en: supermarket.name.en,
      ar: supermarket.name.ar,
      fr: supermarket.name.fr,
    });

    this.supermarketForm.get('description')?.patchValue({
      en: supermarket.description.en,
      ar: supermarket.description.ar,
      fr: supermarket.description.fr,
    });

    this.supermarketForm.disable();

    if (supermarket.image && supermarket.image.secure_url) {
      this.imagePreview = supermarket.image.secure_url ;
    }

  }

  // Delete a restaurant
  deleteRestaurant(restaurantId: number) {

  }

  //
  viewData : boolean = false;
  openViewModal(supermarket: any) {
    this.viewData = true;
    console.log('supermarket', supermarket);


    this.show = true;
    this.showModal = true;
    this.supermarketForm.patchValue({
      isOpen: supermarket.isOpen,
      phone: supermarket.phone,
      supermarketLocationLink: supermarket.supermarketLocationLink,
    });

    this.supermarketForm.get('name')?.patchValue({
      en: supermarket.name.en,
      ar: supermarket.name.ar,
      fr: supermarket.name.fr,
    });

    this.supermarketForm.get('description')?.patchValue({
      en: supermarket.description.en,
      ar: supermarket.description.ar,
      fr: supermarket.description.fr,
    });

    this.supermarketForm.disable();

    if (supermarket.image && supermarket.image.secure_url) {
      this.imagePreview = supermarket.image.secure_url ;
    }



  }


    showModalAddRole = false;
    openAddRoleModal(supermarketId: number) {

      this.getAlladmins(this.accountType);
      console.log('supermarketId', supermarketId);
      this.showModalAddRole = true;
      this.autharizaForm.patchValue({ supermarketId: supermarketId });

    }


    closeModalAddRole() {
      this.showModalAddRole = false;
      this.autharizaForm.reset();
      this.viewData = false;
    }


    onSubmitAddRole() {
      if (this.autharizaForm.valid) {
        const formData = this.autharizaForm.value;
        console.log('formData', formData);
        this._supermarketService.addAuthorization(formData).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: res.message || 'Success',
              text: 'Authorization added successfully!',
              confirmButtonColor: '#28a745',
              confirmButtonText: 'OK',
              timer: 2000,
              timerProgressBar: true,
            }).then(() => {
              this.closeModalAddRole();
              this.autharizaForm.reset();
            });
          },
          error: (err) => {
            console.error('Error adding authorization:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to add authorization. Please try again.',
              confirmButtonColor: '#d33',
              confirmButtonText: 'Close',
              timer: 2000,
              timerProgressBar: true,
            });
          }
        });
      }
    }



}
