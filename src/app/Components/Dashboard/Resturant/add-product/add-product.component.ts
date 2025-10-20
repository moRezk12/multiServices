import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from 'src/app/Core/Services/Restaurant/restaurant.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  showModal = false;
  show: boolean = false;
  mode : boolean = false;
  Products: any[] = []; // Array to hold restaurant data

  // Form Group
  productForm! : FormGroup;

  resturandId !: string ;
  constructor( private _resturantService : RestaurantService , private route : ActivatedRoute,
    private fb: FormBuilder
  ) {

    this.route.params.subscribe(params => {
      const id = params['id'];
      console.log('Received ID:', id);
      this.resturandId = id ;
    });
  }

  ngOnInit(): void {

    // Initialize the form
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      discount: ['', [Validators.required]],
      price: ['', [Validators.required]],
      restaurantId: ['', [Validators.required]],
      images: this.fb.array([]),
      removedImages: this.fb.array([]),
    });

    this.getAllProducts();

  }

  getAllProducts() {
    this._resturantService.getProductsByRestaurantId(this.resturandId).subscribe({
      next: (res) => {
        console.log(res);
        this.Products = res.data;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    })
  }


  // images

  menuImagePreviews: string[] = [];

get images(): FormArray {
  return this.productForm.get('images') as FormArray;
}

get removedImages(): FormArray {
  return this.productForm.get('removedImages') as FormArray;
}

onImagesSelected(event: any) {
  const files: FileList = event.target.files;
  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      if (this.images.length >= 3) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'You can only select up to 3 images.',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Close',
        });
        break;
      }
      this.addMenuImage(files[i]);
    }
  }
}

addMenuImage(file: File) {
  this.images.push(this.fb.control(file));
  const reader = new FileReader();
  reader.onload = () => this.menuImagePreviews.push(reader.result as string);
  reader.readAsDataURL(file);
}

removeMenuImage(index: number) {
  const removedImage = this.images.at(index).value;

  // ✅ لو احنا في وضع Edit و الصورة قديمة (جاية من backend)
  if (this.mode && removedImage && typeof removedImage === 'object' && removedImage.public_id) {
    this.removedImages.push(this.fb.control(removedImage.public_id));
  }

  // ✅ لو الصورة عبارة عن URL فقط
  if (this.mode && typeof removedImage === 'string' && removedImage.includes('cloudinary')) {
    this.removedImages.push(this.fb.control(removedImage));
  }

  // حذف الصورة من الفورم والمعاينة
  this.images.removeAt(index);
  this.menuImagePreviews.splice(index, 1);
}

onRemoveMenuImage(event: MouseEvent, index: number) {
  event.stopPropagation();
  this.removeMenuImage(index);
}




  trackBy(index: number, restaurant: any): number {
    return restaurant.id;
  }



  // Open the modal to add a new restaurant
  openAddModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.productForm.reset();
    this.menuImagePreviews = [];
    this.show = false;
    this.mode = false;
    // this.viewData = false;
  }

  // Submit the form
 onSubmit() {
    // نضيف restaurantId لو مش موجود
    this.productForm.patchValue({
      restaurantId: this.resturandId
    });

    if (this.productForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Form',
        text: 'Please fill in all required fields correctly.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Close',
        timer: 2000,
        timerProgressBar: true,
      });
      return;
    }

    // هنا نحضر FormData
    const formValue = this.productForm.value;
    const finalFormData = this.prepareFormData(formValue);

    console.log('Final FormData before submit (preview):', formValue);

    if (this.mode) {
      // Update Mode (بعتنا FormData)
      this._resturantService.updateProductById(this.productId, finalFormData).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: res.message || 'Success',
            text: 'Product updated successfully!',
            confirmButtonColor: '#28a745',
            confirmButtonText: 'OK',
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            this.getAllProducts();
            this.closeModal();
            this.resetForm();
            this.menuImagePreviews = [];
          });
        },
        error: (err) => {
          console.error('Error updating product:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update product. Please try again.',
            confirmButtonColor: '#d33',
            confirmButtonText: 'Close',
            timer: 2000,
            timerProgressBar: true,
          });
        }
      });
    } else {
      // Add Mode
      this._resturantService.addProductToRestaurant(finalFormData).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: res.message || 'Success',
            text: 'Product added successfully!',
            confirmButtonColor: '#28a745',
            confirmButtonText: 'OK',
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            this.closeModal();
            this.getAllProducts();
            this.resetForm();
            this.menuImagePreviews = [];
          });
        },
        error: (err) => {
          console.error('Error adding product:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to add product. Please try again.',
            confirmButtonColor: '#d33',
            confirmButtonText: 'Close',
            timer: 2000,
            timerProgressBar: true,
          });
        }
      });
    }
  }


// ====== تجهيز FormData ======
prepareFormData(formValue: any): FormData {
  const formData = new FormData();

  // ✅ الحقول النصية والبسيطة
  formData.append('name', formValue.name || '');
  formData.append('description', formValue.description || '');
  formData.append('restaurantId', formValue.restaurantId || '');

  // ✅ نحول discount و price لأرقام، لو undefined نخليها 0
  formData.append('discount', formValue.discount ? String(formValue.discount) : '0');
  formData.append('price', formValue.price ? String(formValue.price) : '0');

  // ✅ صور المنتج
  if (formValue.images && formValue.images.length > 0) {
    formValue.images.forEach((img: any) => {
      if (img instanceof File) {
        formData.append('images', img);
      } else if (img.secure_url || img.url) {
        formData.append('oldImages', JSON.stringify(img));
      }
    });
  }

  // ✅ الصور المحذوفة
  if (formValue.removedImages && formValue.removedImages.length > 0) {
    formData.append('removedImages', JSON.stringify(formValue.removedImages));
  }

  return formData;
}



  // ====== Reset ======
  resetForm() {
    this.productForm.reset();
    this.images.clear();
    this.removedImages.clear();
    this.menuImagePreviews = [];
    this.mode = false;
    this.productId = '';
  }

// ====== Edit Mode ======
productId!: string;

// ====== Open Edit Modal ======
  openEditModal(product: any) {
    console.log('product', product);

    this.productId = product._id;
    this.showModal = true;
    this.mode = true; // edit mode

    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      discount: product.discount,
      price: product.price,
      restaurantId: product.restaurantId,
    });

    // تنظيف الصور القديمة والحالة
    this.images.clear();
    this.menuImagePreviews = [];
    this.removedImages.clear();

    // لو في صور موجودة من الباك اند
    if (Array.isArray(product.images) && product.images.length > 0) {
      product.images.forEach((img: any) => {
        // نضيف الكائن أو الرابط كقيمة في الفورم (لما يكون img كائن فيه secure_url/public_id)
        this.images.push(this.fb.control(img));
        this.menuImagePreviews.push(img.secure_url || img.url || img);
      });
    } else {
      this.productForm.patchValue({ images: [] });
    }
  }


  // Delete a restaurant
  deleteRestaurant(restaurantId: string) {
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
        this._resturantService.deleteProductById(restaurantId).subscribe({
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
              this.getAllProducts();
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
        });
      }
    })
  }

  //
  viewData : boolean = false;
  openViewModal(product: any) {
    this.viewData = true;
    console.log('product', product);


    this.show = true;
    this.showModal = true;
    this.productForm.patchValue({
      name : product.name,
      description: product.description,
      discount: product.discount,
      price: product.price,
      restaurantId: product.restaurantId,
    });

    this.productForm.disable();

      // ✅ نضيف صور المينيو
if (product.images) {
  product.images.forEach((img: any) => {
    this.images.push(this.fb.control(img));
    this.menuImagePreviews.push(img.secure_url);
  });
}

    console.log(product.images);

  }
}
