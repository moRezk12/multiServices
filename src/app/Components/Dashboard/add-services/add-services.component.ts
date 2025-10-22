import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/Core/Services/Admin/admin.service';
import { PaidServicesService } from 'src/app/Core/Services/paidServices/paid-services.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-services',
  templateUrl: './add-services.component.html',
  styleUrls: ['./add-services.component.css']
})
export class AddServicesComponent {

  showModal = false;
    show: boolean = false;
    mode : boolean = false;
    Services: any[] = []; // Array to hold restaurant data

    // Form Group
    ServiceForm! : FormGroup;

    constructor( private allServices : PaidServicesService ,
      private fb: FormBuilder
    ) { }

    ngOnInit(): void {

      // Initialize the form
      this.ServiceForm = this.fb.group({
        serviceName: ['', [Validators.required]],
        subscriptionDuration: ['', [Validators.required]],
        subscriptionPrice: ['', [Validators.required]],
    phoneNumber: ['+222', [Validators.required, Validators.pattern(/^\+222\d{8}$/)]],
        invoiceImage: [null, [Validators.required]],
      });

    this.fixPhonePrefix();

      // Initialize or fetch data if needed
      this.getAllservices();
    }

    private fixPhonePrefix(): void {
  const phoneControl = this.ServiceForm.get('phoneNumber');

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



  // ✅ متغير للصورة الواحدة
  imagePreview: string | null = null;

  // -----------------------------
  // ✅ اختيار صورة واحدة
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.ServiceForm.patchValue({ invoiceImage: file });
      this.ServiceForm.get('invoiceImage')?.markAsTouched();
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result as string);
      reader.readAsDataURL(file);
    }
  }
  // -----------------------------
  // ✅ حذف الصورة (ترجيعها للحالة الأصلية)
  onRemoveImage() {
    this.imagePreview = null;
    this.ServiceForm.patchValue({ invoiceImage: null });
    this.ServiceForm.get('invoiceImage')?.markAsTouched();
  }





    trackBy(index: number, restaurant: any): number {
      return restaurant.id;
    }


    // Get all services
    getAllservices() {
      console.log('getAllservices');

      this.allServices.getAllServices().subscribe({
        next: (res) => {

          console.log(res);
          this.Services = res.data;
        },
        error: (err) => {
          console.error('Error fetching services:', err);
        }
      });
    }

    // Open the modal to add a new restaurant
    openAddModal() {
      this.showModal = true;
    }

    closeModal() {
      this.showModal = false;
      this.ServiceForm.reset();
      this.imagePreview = null;
      // this.ServiceForm.enable();
      this.mode = false;
      this.viewData = false;
    }

    // Submit the form
  onSubmit() {
    console.log(this.ServiceForm.value);

      if (this.ServiceForm.invalid) {
      this.ServiceForm.markAllAsTouched();
      console.log("Form is invalid");
      return;
    }

    if (this.ServiceForm.valid) {
      const formValue = this.ServiceForm.value;
      const formData = this.prepareFormData(formValue);

      if (this.mode) {
        // ✅ تعديل
        this.allServices.updateService(this.servicesId, formData).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: res.message || 'Success',
              text: 'services updated successfully!',
              confirmButtonColor: '#28a745',
              timer: 2000,
            }).then(() => {
              this.closeModal();
              this.getAllservices();
              this.ServiceForm.reset();
              this.imagePreview = null;
            });
          },
          error: (err) => {
            console.error('Error updating services:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to update services. Please try again.',
            });
          },
        });
      } else {
        // ✅ إضافة جديدة
        this.allServices.addService(formData).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: res.message || 'Success',
              text: 'services added successfully!',
              confirmButtonColor: '#28a745',
              timer: 2000,
            }).then(() => {
              this.getAllservices();
              this.closeModal();
              this.ServiceForm.reset();
              this.imagePreview = null;
            });
          },
          error: (err) => {
            console.error('Error adding services:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to add services. Please try again.',
            });
          },
        });
      }
    } else {
      console.error('Form is invalid');
      this.ServiceForm.markAllAsTouched();
    }
  }

  prepareFormData(formValue: any): FormData {
    const formData = new FormData();

    // نصوص وحقول بسيطة
    formData.append('serviceName', formValue.serviceName);
    formData.append('subscriptionDuration', formValue.subscriptionDuration);
    formData.append('subscriptionPrice', formValue.subscriptionPrice);
    formData.append('phoneNumber', formValue.phoneNumber);

    // الصورة
    if (formValue.invoiceImage instanceof File) {
      formData.append('invoiceImage', formValue.invoiceImage);
    } else if (typeof formValue.invoiceImage === 'string') {
      formData.append('oldImage', formValue.invoiceImage);
    }


    return formData;
  }


    servicesId! : number

    // Open the modal to edit a restaurant
  // ✅ فتح المودال للتعديل
  openEditModal(services: any) {
    console.log('services', services);

    this.servicesId = services._id;
    console.log(this.servicesId);

    this.showModal = true;
    this.show = false;
    this.mode = true;

    this.ServiceForm.patchValue({
      serviceName: services.serviceName,
      subscriptionDuration: services.subscriptionDuration,
      subscriptionPrice: services.subscriptionPrice,
      phoneNumber: services.phoneNumber
    });



    const imageValue =
      typeof services.invoiceImage === 'string'
        ? services.invoiceImage
        : services.invoiceImage?.secure_url || null;

    this.ServiceForm.get('invoiceImage')?.setValue(imageValue);
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
        this.allServices.deleteService(restaurantId).subscribe({
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
              this.getAllservices();
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
    openViewModal(services: any) {
      this.viewData = true;
      console.log('services', services);


      this.show = true;
      this.showModal = true;
    this.ServiceForm.patchValue({
      serviceName: services.serviceName,
      subscriptionDuration: services.subscriptionDuration,
      subscriptionPrice: services.subscriptionPrice,
      phoneNumber: services.phoneNumber
    });



    const imageValue =
      typeof services.invoiceImage === 'string'
        ? services.invoiceImage
        : services.invoiceImage?.secure_url || null;

    this.ServiceForm.get('invoiceImage')?.setValue(imageValue);
    this.imagePreview = imageValue

      this.ServiceForm.disable();


    }




}
