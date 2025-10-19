import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/Core/Services/Admin/admin.service';
import { RestaurantService } from 'src/app/Core/Services/Restaurant/restaurant.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent implements OnInit {

  showModal = false;
  show: boolean = false;
  mode : boolean = false;
  restaurants: any[] = []; // Array to hold restaurant data

    // ✅ Preview variables
  imagePreview: string | null = null;
  menuImagePreviews: string[] = [];

  // Form Group
  restaurantForm! : FormGroup;
  autharizaForm! : FormGroup;

  accountType!: string
  role: string = 'manager';
  constructor( private resturantServices : RestaurantService ,
    private adminService : AdminService,
    private fb: FormBuilder
  ) { }

ngOnInit(): void {

  // Initialize the form
  this.restaurantForm = this.fb.group({
    name: ['', [Validators.required]],
    rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
    isOpen: [false, [Validators.required]],
    discripion: ['', [Validators.required]],
    phone: ['+222', [Validators.required, Validators.pattern(/^\+222[0-9]{8}$/)]], // +222 + 9 أرقام
    websiteLink: ['', [Validators.required, Validators.pattern(/^https:\/\/.+$/)]], // يبدأ بـ https
    image: [null, [Validators.required]],
    menuImages: this.fb.array([], Validators.required),
    removedMenuImages: this.fb.array([]),
  });

  // خلي +222 ثابتة في الحقل
  this.restaurantForm.get('phone')?.valueChanges.subscribe(value => {
    if (value && !value.startsWith('+222')) {
      const newValue = '+222' + value.replace('+222', '');
      this.restaurantForm.patchValue({ phone: newValue }, { emitEvent: false });
    }
    // منع حذف البادئة
    if (value === '+22' || value === '+2' || value === '+' || value === '') {
      this.restaurantForm.patchValue({ phone: '+222' }, { emitEvent: false });
    }
  });

  this.autharizaForm = this.fb.group({
    role: ['manager', [Validators.required]],
    userId: ['', [Validators.required]],
    restaurantId: [''],
  });

  // Initialize or fetch data if needed
  this.getAllRestaurants();
}


  isPhoneNumber(value: string): boolean {
    return /^[0-9]{1,}$/.test(value);
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

// -----------------------------
 // ✅ Getters for form arrays
  get menuImages(): FormArray {
    return this.restaurantForm.get('menuImages') as FormArray;
  }

  get removedMenuImages(): FormArray {
    return this.restaurantForm.get('removedMenuImages') as FormArray;
  }

  // ✅ Phone fix for +222
  private fixPhonePrefix() {
    this.restaurantForm.get('phone')?.valueChanges.subscribe(value => {
      if (value && !value.startsWith('+222')) {
        const newValue = '+222' + value.replace('+222', '');
        this.restaurantForm.patchValue({ phone: newValue }, { emitEvent: false });
      }
      if (value === '+22' || value === '+2' || value === '+' || value === '') {
        this.restaurantForm.patchValue({ phone: '+222' }, { emitEvent: false });
      }
    });
  }

  // ✅ Single image
  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.restaurantForm.patchValue({ image: file });
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  onRemoveImage(event: MouseEvent) {
    event.stopPropagation();
    this.restaurantForm.patchValue({ image: null });
    this.imagePreview = null;
  }

  // ✅ Multiple images
  onMenuImagesSelected(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        this.addMenuImage(files[i]);
      }
    }
  }

  addMenuImage(file: File) {
    this.menuImages.push(this.fb.control(file));
    const reader = new FileReader();
    reader.onload = () => this.menuImagePreviews.push(reader.result as string);
    reader.readAsDataURL(file);
  }

  removeMenuImage(index: number) {
    const removedImage = this.menuImages.at(index).value;
    if (this.mode && removedImage && removedImage.public_id) {
      this.removedMenuImages.push(this.fb.control(removedImage.public_id));
    }
    this.menuImages.removeAt(index);
    this.menuImagePreviews.splice(index, 1);
  }

  onRemoveMenuImage(event: MouseEvent, index: number) {
    event.stopPropagation();
    this.removeMenuImage(index);
  }





  trackBy(index: number, restaurant: any): number {
    return restaurant.id;
  }


  // Get all restaurants
  getAllRestaurants(page: number = 1) {
    this.resturantServices.getRestaurants(page).subscribe({
      next: (res) => {
        console.log(res.data);
        this.restaurants = res.data;
      },
      error: (err) => {
        console.error('Error fetching restaurants:', err);
      }
    });
  }

  // Open the modal to add a new restaurant
  openAddModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.restaurantForm.reset();
    this.menuImages.clear();
    this.imagePreview = null;
    this.menuImagePreviews = [];
    this.restaurantForm.enable();
    this.mode = false;
    this.show = false;
    this.viewData = false;
  }

  // Submit the form
  onSubmit() {

    console.log(this.restaurantForm.value);

    if (this.restaurantForm.valid) {
      console.log(this.restaurantForm.value);

      const formData = this.restaurantForm.value;

      if (this.mode) {
        // Update Restaurant

        this.resturantServices.updateRestaurant(  this.restaurantId ,formData).subscribe({
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
              this.getAllRestaurants();
              this.closeModal();
              this.restaurantForm.reset();
              this.menuImages.clear();
              this.imagePreview = null;
              this.menuImagePreviews = [];
            });
          },
          error: (err) => {
            console.error('Error updating restaurant:', err);
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

      }else {
        // Add Restaurant

        this.restaurantForm.get('removedMenuImages')?.setValue([]);

        this.resturantServices.addRestaurant(formData).subscribe({
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
              this.getAllRestaurants();
              this.closeModal();
              this.restaurantForm.reset();
              this.menuImages.clear();
              this.imagePreview = null;
              this.menuImagePreviews = [];
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
      }
    } else {
      console.error('Form is invalid');
    }

  }


  // Open the modal to edit a restaurant
  restaurantId!: string;
  // ✅ Open Edit Modal
  openEditModal(restaurant: any) {
    this.restaurantId = restaurant._id;
    this.showModal = true;
    this.mode = true;

    this.restaurantForm.patchValue({
      name: restaurant.name,
      rating: restaurant.rating,
      isOpen: restaurant.isOpen,
      discripion: restaurant.discripion,
      phone: restaurant.phone,
      websiteLink: restaurant.websiteLink,
    });

    // Reset images
    this.menuImages.clear();
    this.removedMenuImages.clear();
    this.menuImagePreviews = [];
    this.imagePreview = null;

    // Main image
    const imageValue = typeof restaurant.image === 'string'
      ? restaurant.image
      : restaurant.image?.secure_url || null;
    this.restaurantForm.get('image')?.setValue(imageValue);
    this.imagePreview = imageValue;

    // Menu images
    if (restaurant.menuImages) {
      restaurant.menuImages.forEach((img: any) => {
        this.menuImages.push(this.fb.control(img));
        this.menuImagePreviews.push(img.secure_url);
      });
    }

    this.restaurantForm.get('removedMenuImages')?.setValue([]);
  }




  // Delete a restaurant

  deleteRestaurant(restaurantId: string) {
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
        this.resturantServices.deleteRestaurant(restaurantId.toString()).subscribe({
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
              this.getAllRestaurants();
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


  //
  viewData : boolean = false;
  openViewModal(restaurant: any) {
    this.viewData = true;
    console.log('restaurant', restaurant);


    this.show = true;
    this.showModal = true;
    this.restaurantForm.patchValue({
      name: restaurant.name,
      cuisine: restaurant.cuisine,
      rating: restaurant.rating,
      deliveryTime: restaurant.deliveryTime,
      distance: restaurant.distance,
      isOpen: restaurant.isOpen,
      discripion: restaurant.discripion,
      phone: restaurant.phone,
      websiteLink: restaurant.websiteLink,
      image: null,
    });
    this.menuImages.clear();
    this.imagePreview = null;
    this.menuImagePreviews = [];
    this.restaurantForm.disable();

    if (restaurant.image && restaurant.image.secure_url) {
      this.imagePreview = restaurant.image.secure_url ;
    }


    if (restaurant.menuImages) {
      restaurant.menuImages.forEach((img: any) => {
        this.menuImages.push(this.fb.control(img)); // تخزنها في الفورم عادي
        this.menuImagePreviews.push(img.secure_url); // تعرض اللينك مباشرة
      });
    }

    console.log('restaurant.menuImages', restaurant.menuImages);
  }


  showModalAddRole = false;
  openAddRoleModal(restaurantId: number) {

    this.getAlladmins(this.accountType);
    console.log('restaurantId', restaurantId);
    this.showModalAddRole = true;
    this.autharizaForm.patchValue({ restaurantId: restaurantId });

  }


  closeModalAddRole() {
    this.showModalAddRole = false;
    this.autharizaForm.reset();
    this.restaurantForm.enable();
    this.viewData = false;
  }


  onSubmitAddRole() {
    if (this.autharizaForm.valid) {
      const formData = this.autharizaForm.value;
      console.log('formData', formData);
      this.resturantServices.addAuthorization(formData).subscribe({
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
