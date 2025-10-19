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
    this.viewData = false;

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

  }

  closeAddProductModal() {
    this.showModelAddProduct = false;
  }



    // images
  // getter للـ FormArray
  get images(): FormArray {
    return this.productForm.get('images') as FormArray;
  }

  // preview لكل صورة
  imagePreviews: string[] = [];

  // لما تختار صور جديدة
  onImagesSelected(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file: File) => {
        // ضيف الصورة للـ FormArray
        this.images.push(new FormControl(file));

        // preview
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreviews.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  // حذف صورة معينة
  onRemoveImage(index: number, event: MouseEvent) {
    event.stopPropagation(); // يمنع فتح نافذة اختيار صور
    this.images.removeAt(index);
    this.imagePreviews.splice(index, 1);
  }

  // Submit the form to add a product
  onSubmitAddProduct() {
    console.log(this.productForm.value);
    if (this.productForm.valid) {
      const Data = this.productForm.value;

      // تحويل FormArray للصور إلى مصفوفة عادية
      const imagesArray = this.productForm.get('images')?.value;


      this._supermarketService.addProduct(this.selectedSection._id, Data).subscribe({
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
            confirmButtonText: 'Close',
            timer: 2000,
            timerProgressBar: true,
          });
        }
      });
    } else {
      console.error('Product form is invalid');
    }
  }

  // Open the modal to edit a product
  openEditProductModal(product : any) {
    console.log('product', product);
    this.showModelAddProduct = true;
    this.viewData = false;
    // this.selectedProduct = product;

    // Patch the form with existing product data
    this.productForm.patchValue({
      price: product.price,
      discount: product.discount,
      stock: product.stock,
    });

    this.productForm.get('name')?.patchValue({
      en: product.name.en,
      ar: product.name.ar,
      fr: product.name.fr,
    });

    this.productForm.get('description')?.patchValue({
      en: product.description.en,
      ar: product.description.ar,
      fr: product.description.fr,
    });

    this.imagePreviews = [];

    // لو عندك صور موجودة في المنتج، ممكن تعبيهم في الـ FormArray والـ previews
    if (product.images && product.images.length) {
      product.images.forEach((img: any) => {
        // هنا بنضيف URL الصورة للـ previews
        this.imagePreviews.push(img.secure_url);
        // وممكن تضيف null أو placeholder للـ FormArray لأننا ما عندنا الملف الأصلي
        this.images.push(new FormControl(null));
      });
    }


  }

}
