import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/Core/Services/Auth/login.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-confirmpass',
  templateUrl: './confirmpass.component.html',
  styleUrls: ['./confirmpass.component.css']
})
export class ConfirmpassComponent {

  showPassword : boolean = false
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder ,
    private router : Router,
    private _loginService : LoginService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      phone: ['', [Validators.required]],
      otp: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    const storedPhone = localStorage.getItem('phone');
    if (storedPhone) {
      this.loginForm.patchValue({ phone: storedPhone });
    }


  }

  // Login
  Confirme() {
    const phone = localStorage.getItem('phone');

    if (this.loginForm.valid) {
      const data = this.loginForm.value;
      this._loginService.confirmpass(data).subscribe({
        next : (res : any ) => {

          Swal.fire({
            icon: 'success',
            title: 'Success',
            // text: 'Password confirmed successfully!',
            text: res.message,
            confirmButtonColor: '#28a745',
            confirmButtonText: 'OK',
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            this.router.navigate(['/login']);
          });
        },
        error : (err) => {
          Swal.fire({
            icon: 'error',
            title: err.error?.message,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Close',
            timer: 2000,
            timerProgressBar: true,
          });
        }
      })
    }

  }


    // Show password
    showIcon() {
      this.showPassword = !this.showPassword;
    }



}
