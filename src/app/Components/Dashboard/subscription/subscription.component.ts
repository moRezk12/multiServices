import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubscriptionService } from 'src/app/Core/Services/Subscription/subscription.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {

  subscriptionForm! : FormGroup;
  showModal : boolean = false;
  show : boolean = false;
  mode : boolean = false

  subscriptions : any[] = [];

  constructor(private fb: FormBuilder , private _subscriptionService : SubscriptionService) { }

  ngOnInit(){
    this.subscriptionForm = this.fb.group({
      price : ['' , [Validators.required]],
      durationDays : ['' , [Validators.required]]
    });

    this.getAllSubscriptions();

  }

  // Get all subscriptions
  getAllSubscriptions(){
    console.log("============");

    this._subscriptionService.getAllSubscription().subscribe({
      next : (res) => {
        this.subscriptions = res.data;
        console.log(res);

      },
      error : (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        })
      }
    })
  }

  openModal(){
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.subscriptionForm.reset();
    this.mode = false;
    this.show = false;
    this.subscriptionId = '';
  }

  onSubmit(){



    if(this.subscriptionForm.valid){

      const formValue = this.subscriptionForm.value;

      if(this.mode){
        this._subscriptionService.updateSubscription(this.subscriptionId , formValue).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: res.message || 'Success',
              text: 'Subscription updated successfully!',
              confirmButtonColor: '#28a745',
              timer: 2500,
            }).then(() => {
              this.getAllSubscriptions();
              this.closeModal();

            })
          },
          error: (err) => {
            console.error('❌ Error updating subscription:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: err.error?.message || 'Failed to update subscription. Please try again.',
              confirmButtonColor: '#d33',
              timer: 2500,
            });
          }
        });
      }else{
        this._subscriptionService.addSubscription(formValue).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: res.message || 'Success',
              text: 'Subscription added successfully!',
              confirmButtonColor: '#28a745',
              timer: 2500,
            }).then(() => {
              this.getAllSubscriptions();
              this.closeModal();
            })
          },
          error: (err) => {
            console.error('❌ Error adding subscription:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: err.error?.message || 'Failed to add subscription. Please try again.',
              confirmButtonColor: '#d33',
              timer: 2500,
            });
          }
        });
      }
    }else {
      this.subscriptionForm.markAllAsTouched();

    }


  }

  subscriptionId : any ;

  EditSubscription(user : any){
    this.mode = true;
    this.showModal = true;

    this.subscriptionId = user._id

    this.subscriptionForm.patchValue({
      price : user.price,
      durationDays : user.durationDays
    });
  }

  deleteSubscription(id : any){
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
        this._subscriptionService.deleteSubscription(id).subscribe({
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
              this.getAllSubscriptions();
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

  ViewSubscription(user : any){
    this.showModal = true;
    this.subscriptionForm.patchValue({
      price : user.price,
      durationDays : user.durationDays
    });
    this.mode = false;
    this.show = true;
    this.subscriptionForm.disable();
  }



}
