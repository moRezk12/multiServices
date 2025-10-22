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
    phone: ['+222', [Validators.required, Validators.pattern(/^\+222\d{8}$/)]],
      image: [null, [Validators.required]],
    });


    this.autharizaForm = this.fb.group({
      role: ['staff' , [Validators.required]],
      userId: ['', [Validators.required]],
      supermarketId: [''],
    });

    this.fixPhonePrefix();


    // Initialize or fetch data if needed
    this.getAllSupermarket();
  }

private fixPhonePrefix(): void {
  const phoneControl = this.supermarketForm.get('phone');

  phoneControl?.valueChanges.subscribe(value => {
    if (value == null) return;

    // 🧹 إزالة أي رموز غير أرقام بعد +222
    if (!value.startsWith('+222')) {
      const digitsOnly = value.replace(/\D/g, ''); // يحتفظ بالأرقام فقط
      phoneControl.patchValue(`+222${digitsOnly}`, { emitEvent: false });
    }

    // 🧩 لو المستخدم حاول يمسح +222 نحافظ عليها
    if (value.length < 4 || !value.startsWith('+222')) {
      phoneControl.patchValue('+222', { emitEvent: false });
    }

    // 🧠 لا تسمح إلا بالأرقام بعد +222
    if (value.startsWith('+222')) {
      const prefix = '+222';
      const digits = value.slice(prefix.length).replace(/\D/g, ''); // خُذ الأرقام فقط بعد +222
      phoneControl.patchValue(prefix + digits, { emitEvent: false });
    }
  });
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


// ✅ متغير للصورة الواحدة
imagePreview: string | null = null;

// -----------------------------
// ✅ اختيار صورة واحدة
onImageSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.supermarketForm.patchValue({ image: file });
    this.supermarketForm.get('image')?.markAsTouched();
    const reader = new FileReader();
    reader.onload = () => (this.imagePreview = reader.result as string);
    reader.readAsDataURL(file);
  }
}
// -----------------------------
// ✅ حذف الصورة (ترجيعها للحالة الأصلية)
onRemoveImage() {
  this.imagePreview = null;
  this.supermarketForm.patchValue({ image: null });
  this.supermarketForm.get('image')?.markAsTouched();
}





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
  console.log(this.supermarketForm.value);

    if (this.supermarketForm.invalid) {
    this.supermarketForm.markAllAsTouched();
    console.log("Form is invalid");
    return;
  }

  if (this.supermarketForm.valid) {
    const formValue = this.supermarketForm.value;
    const formData = this.prepareFormData(formValue);

    if (this.mode) {
      // ✅ تعديل
      this._supermarketService.updateSupermarket(this.supermarketId, formData).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: res.message || 'Success',
            text: 'Supermarket updated successfully!',
            confirmButtonColor: '#28a745',
            timer: 2000,
          }).then(() => {
            this.closeModal();
            this.getAllSupermarket();
            this.supermarketForm.reset();
            this.imagePreview = null;
          });
        },
        error: (err) => {
          console.error('Error updating supermarket:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update supermarket. Please try again.',
          });
        },
      });
    } else {
      // ✅ إضافة جديدة
      this._supermarketService.addSupermarket(formData).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: res.message || 'Success',
            text: 'Supermarket added successfully!',
            confirmButtonColor: '#28a745',
            timer: 2000,
          }).then(() => {
            this.getAllSupermarket();
            this.closeModal();
            this.supermarketForm.reset();
            this.imagePreview = null;
          });
        },
        error: (err) => {
          console.error('Error adding supermarket:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to add supermarket. Please try again.',
          });
        },
      });
    }
  } else {
    console.error('Form is invalid');
    this.supermarketForm.markAllAsTouched();
  }
}

prepareFormData(formValue: any): FormData {
  const formData = new FormData();

  // نصوص بسيطة
  formData.append('supermarketLocationLink', formValue.supermarketLocationLink);
  formData.append('isOpen', formValue.isOpen);
  formData.append('phone', formValue.phone);

  // الحقول المترجمة (JSON)
  formData.append('name', JSON.stringify(formValue.name));
  formData.append('description', JSON.stringify(formValue.description));

  // الصورة
  if (formValue.image instanceof File) {
    formData.append('image', formValue.image);
  } else if (typeof formValue.image === 'string') {
    formData.append('oldImage', formValue.image);
  }

  return formData;
}


  supermarketId! : number

  // Open the modal to edit a restaurant
// ✅ فتح المودال للتعديل
openEditModal(supermarket: any) {
  console.log('supermarket', supermarket);

  this.supermarketId = supermarket._id;
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

  const imageValue =
    typeof supermarket.image === 'string'
      ? supermarket.image
      : supermarket.image?.secure_url || null;

  this.supermarketForm.get('image')?.setValue(imageValue);
  this.imagePreview = imageValue;
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
      this._supermarketService.deleteSupermarket(restaurantId).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: res.message || 'Deleted!',
            text: 'The product has been deleted.',
            confirmButtonColor: '#28a745',
            confirmButtonText: 'OK',
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            this.getAllSupermarket();
          });
        },
        error: (err) => {
          console.error('Error deleting product:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete the product. Please try again.',
            confirmButtonColor: '#d33',
            confirmButtonText: 'Close',
            timer: 2000,
            timerProgressBar: true,
          });
        }
        })
      }
    })

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
