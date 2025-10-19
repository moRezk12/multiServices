import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PrivacypolicyService } from 'src/app/Core/Services/privacyPolicy/privacypolicy.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {

  showModal : boolean = false;
  mode : boolean = false;
  show : boolean = false;

privacyPolicyForm!: FormGroup;

  constructor(private fb: FormBuilder , private _privacyPolicyService : PrivacypolicyService) {}

  ngOnInit(): void {
    this.initForm();
    this.getAllPrivacyPolicy();

  }

  initForm() {
    this.privacyPolicyForm = this.fb.group({
      whatsappNumber: ['', [Validators.required, Validators.pattern(/^\+?\d{6,15}$/)]],
      privacyPolicy: this.fb.array([this.createPolicyItem()])
    });
  }

privacyPolicies: any;

getAllPrivacyPolicy() {
  this._privacyPolicyService.getPrivacyPolicy().subscribe({
    next: (res) => {
      console.log(res);
       this.privacyPolicies = res.data.settings;
    },
    error: (err) => {
      console.log(err);
    }
  });
}


  createPolicyItem(): FormControl {
    return this.fb.control('', Validators.required);
  }

  get privacyPolicyArray() {
    return this.privacyPolicyForm.get('privacyPolicy') as FormArray;
  }

  addPolicy() {
    this.privacyPolicyArray.push(this.createPolicyItem());
  }

  removePolicy(index: number) {
    this.privacyPolicyArray.removeAt(index);
  }

  onSubmit() {
    if (this.privacyPolicyForm.invalid) return;
    console.log(this.privacyPolicyForm.value);

    this._privacyPolicyService.addPrivacyPolicy(this.privacyPolicyForm.value).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: res.message || 'Success',
          text: 'Privacy Policy added successfully!',
          confirmButtonColor: '#28a745',
          confirmButtonText: 'OK',
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          this.getAllPrivacyPolicy();
          this.closeModal();  // Close the modal
        })
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add privacy policy. Please try again.',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Close',
          timer: 2000,
          timerProgressBar: true,
        });
      }
    })

  }


  deletePrivacy() {
    this._privacyPolicyService.deletePrivacyPolicy().subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: res.message || 'Success',
          text: 'Privacy Policy deleted successfully!',
          confirmButtonColor: '#28a745',
          confirmButtonText: 'OK',
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          this.getAllPrivacyPolicy();
          this.closeModal();
        })

      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete privacy policy. Please try again.',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Close',
          timer: 2000,
          timerProgressBar: true,
        });
      }
    })
  }

  openViewModal(privacyPolicy: any) {

  }

  openAddModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }


}
