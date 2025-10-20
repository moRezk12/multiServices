import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SupermarketService } from 'src/app/Core/Services/Supermarket/supermarket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-section',
  templateUrl: './add-section.component.html',
  styleUrls: ['./add-section.component.css']
})
export class AddSectionComponent implements OnInit {

  showModal = false;
  show: boolean = false;
  mode : boolean = false;
  supermarket: any[] = []; // Array to hold restaurant data

  // Form Group
  sectionForm! : FormGroup;
  productForm! : FormGroup;

  constructor( private _supermarketService : SupermarketService ,
    private activeRoute: ActivatedRoute ,
    private fb: FormBuilder
  ) { }

  selectIdSupermarket!: any;
  routeSub!: any;

  ngOnInit(): void {

    // Get the ID from the route
      this.routeSub = this.activeRoute.paramMap.subscribe(params => {
    this.selectIdSupermarket = params.get('id');
    console.log('Selected Supermarket ID:', this.selectIdSupermarket);

    if (this.selectIdSupermarket) {
      this.getAllSection(this.selectIdSupermarket);
    }
  });


    // Initialize the form
    this.sectionForm = this.fb.group({
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

    });

    this.productForm = this.fb.group({
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
      price: ['', [Validators.required, Validators.min(0)]],
      discount: ['', [Validators.min(0), Validators.max(100)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      images: this.fb.array([]),
    });

    // Initialize or fetch data if needed
    this.getAllSection(this.selectIdSupermarket);
  }




// -----------------------------





  trackBy(index: number, restaurant: any): number {
    return restaurant.id;
  }


  // Get all Sections
  getAllSection(id : any ) {
    console.log('getAllSections');
    console.log(this.selectIdSupermarket);

    this._supermarketService.getAllSections(id).subscribe({
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
    this.sectionForm.reset();
    this.mode = false;
    // this.viewData = false;

  }

  // Submit the form
  onSubmit() {



    if (this.sectionForm.valid) {
      console.log(this.sectionForm.value);
      const Data = this.sectionForm.value;

      if(this.mode){

        this._supermarketService.updateSection(this.sectionId , Data).subscribe({
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
              this.getAllSection(this.selectIdSupermarket);
              this.closeModal();
              this.sectionForm.reset();
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
      }else {

        this._supermarketService.addSection(this.selectIdSupermarket , Data).subscribe({
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
              this.getAllSection(this.selectIdSupermarket);
              this.closeModal();
              this.sectionForm.reset();
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



  sectionId!: number;
  // Open the modal to edit a restaurant
  openEditModal(section: any) {

    console.log('section', section);
    this.sectionId = section._id;
    this.showModal = true;
    this.mode = true; // Set mode to edit
    this.sectionForm.patchValue({
      isOpen: section.isOpen,
      phone: section.phone,
      sectionLocationLink: section.sectionLocationLink,
    });

    this.sectionForm.get('name')?.patchValue({
      en: section.name.en,
      ar: section.name.ar,
      fr: section.name.fr,
    });

    this.sectionForm.get('description')?.patchValue({
      en: section.description.en,
      ar: section.description.ar,
      fr: section.description.fr,
    });


  }

  // Delete a restaurant
  deleteRestaurant(sectionId: number) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this section!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this._supermarketService.deleteSection(sectionId).subscribe({
          next: (res) => {
            this.getAllSection(this.selectIdSupermarket);
            Swal.fire({
              icon: 'success',
              title: res.message || 'Success',
              text: 'Section deleted successfully!',
              confirmButtonColor: '#28a745',
              confirmButtonText: 'OK',
              timer: 2000,
              timerProgressBar: true,
            }).then(() => {
                this.getAllSection(this.selectIdSupermarket);
              });
          },
          error: (err) => {
            console.error('Error deleting section:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete section. Please try again.',
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
  modeProduct = false;
  viewData : boolean = false;
  selectedSection: any;
  openViewModal(supermarket: any) {
    this.viewData = true;
    this.selectedSection = supermarket;

  }

  closeData() {
    this.viewData = false;
  }


  showModelProduct = false;
  selectedProduct: any;
  openProductModal(product : any) {
    console.log('product', product);
    this.showModelProduct = true;
    this.viewData = false;
    this.selectedProduct = product;
  }

  closeProductModal() {
    this.showModelProduct = false;
  }



  // Open the modal to add a new product


  showModelAddProduct = false;
  openAddProductModal() {
    this.showModelAddProduct = true;
    this.viewData = false;
    this.modeProduct = false;


  }

  closeAddProductModal() {
    this.showModelAddProduct = false;
    this.modeProduct = false;
    this.productForm.reset();
    this.imagePreviews = [];
  }



    // images
    imagePreviews: string[] = [];
// ✅ getters
get images(): FormArray {
  return this.productForm.get('images') as FormArray;
}

// ✅ اختيار صور جديدة
// ✅ اختيار صور جديدة
onImagesSelected(event: any) {
  const files: FileList = event.target.files;

  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      // ✅ تحقق من الحد الأقصى (3 صور فقط)
      if (this.images.length >= 3) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'You can only select up to 3 images.',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Close',
          // timer: 2000,
          // timerProgressBar: true,
        })
        break; // نوقف التكرار
      }
      this.addImage(files[i]);
    }
  }

  // ✅ إعادة تعيين input بعد الرفع علشان يقدر يختار نفس الصورة تاني لو حب
  event.target.value = '';
}

// ✅ إضافة صورة جديدة للـ FormArray والعرض
addImage(file: File) {
  this.images.push(this.fb.control(file));
  const reader = new FileReader();
  reader.onload = () => this.imagePreviews.push(reader.result as string);
  reader.readAsDataURL(file);
}



// ✅ حذف صورة
removeImage(index: number) {
  this.images.removeAt(index);
  this.imagePreviews.splice(index, 1);
}
onRemoveImage(event: MouseEvent, index: number) {
  event.stopPropagation();
  this.removeImage(index);
}


  // Submit the form to add a product
  onSubmitAddProduct() {

    console.log(this.selectIdSupermarket);


    console.log(this.productForm.value);

    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      const formData = this.prepareProductFormData(formValue);

      if (this.modeProduct) {
        // 🔹 تحديث المنتج
        this._supermarketService.updateProduct(this.productIdToEdit, formData).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: res.message || 'Success',
              text: 'Product updated successfully!',
              confirmButtonColor: '#28a745',
              timer: 2000,
              timerProgressBar: true,
            }).then(() => {
              this.getAllSection(this.selectIdSupermarket);
              this.closeAddProductModal();
              this.productForm.reset();
              this.imagePreviews = [];
              this.images.clear();
            });
          },
          error: (err) => {
            console.error('Error updating product:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to update product. Please try again.',
              confirmButtonColor: '#d33',
              timer: 2000,
              timerProgressBar: true,
            });
          }
        });

      } else {
        // 🔹 إضافة منتج جديد
        this._supermarketService.addProduct(this.selectedSection._id, formData).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: res.message || 'Success',
              text: 'Product added successfully!',
              confirmButtonColor: '#28a745',
              timer: 2000,
              timerProgressBar: true,
            }).then(() => {
              this.getAllSection(this.selectIdSupermarket);
              this.closeAddProductModal();
              this.productForm.reset();
              this.imagePreviews = [];
              this.images.clear();
            });
          },
          error: (err) => {
            console.error('Error adding product:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to add product. Please try again.',
              confirmButtonColor: '#d33',
              timer: 2000,
              timerProgressBar: true,
            });
          }
        });
      }
    } else {
      console.error('Product form is invalid');
      this.productForm.markAllAsTouched();
    }
  }

// 🧩 ========== تجهيز بيانات الإرسال ==========





  productIdToEdit: number | null = null;

  openEditProductModal(product: any) {
  this.showModelAddProduct = true;
  this.modeProduct = true;
  this.viewData = false;
  this.productIdToEdit = product._id;

  this.imagePreviews = [];
  this.images.clear();

  this.productForm.patchValue({
    name: product.name,
    description: product.description,
    price: product.price,
    discount: product.discount,
    stock: product.stock,
  });

  // ✅ تحميل الصور القديمة وتحويلها إلى ملفات File
  if (product.images && product.images.length > 0) {
    product.images.forEach(async (img: any) => {
      const url = img.secure_url || img.url || img;
      const file = await this.urlToFile(url, 'image.jpg'); // نحول الصورة لملف
      this.images.push(this.fb.control(file)); // نحطها كـ File في الـ FormArray
      this.imagePreviews.push(url); // للعرض فقط
    });
  }
}

// ✅ دالة تحويل URL إلى ملف File
async urlToFile(url: string, filename: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
}

prepareProductFormData(formValue: any): FormData {
  const formData = new FormData();

  // ✅ الحقول النصية
  formData.append('name', JSON.stringify(formValue.name));
  formData.append('description', JSON.stringify(formValue.description));
  formData.append('price', formValue.price ? String(formValue.price) : '0');
  formData.append('discount', formValue.discount ? String(formValue.discount) : '0');
  formData.append('stock', formValue.stock ? String(formValue.stock) : '0');

  // ✅ فصل الصور القديمة عن الجديدة
  const oldImages: any[] = [];
  const newFiles: File[] = [];

  (formValue.images || []).forEach((img: any) => {
    if (img instanceof File) {
      newFiles.push(img);
    } else if (typeof img === 'string') {
      oldImages.push(img);
    } else if (img && (img.secure_url || img.url)) {
      oldImages.push(img.secure_url || img.url);
    }
  });

  // ✅ أرسل الصور القديمة كـ JSON
  formData.append('oldImages', JSON.stringify(oldImages));

  // ✅ أرسل الصور الجديدة بنفس اسم الحقل اللي السيرفر متوقعه: images
  newFiles.forEach((file: File) => {
    formData.append('images', file); // 👈 لازم يكون "images"
  });

  return formData;
}




  openDeleteProductModal(id: number) {

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
            this._supermarketService.deleteProduct(id.toString()).subscribe({
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
                  this.viewData = false;
                  this.getAllSection(this.selectIdSupermarket);
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
