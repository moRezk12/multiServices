import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/Core/Services/Auth/login.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  showPassword : boolean = false;
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder ,
    private router : Router,
    private _loginService : LoginService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

     // Check if the value is a phone number
    this.loginForm.get('identifier')?.valueChanges.subscribe(value => {
      if (this.isPhoneNumber(value)) {
        if (!value.startsWith('+20')) {
          this.loginForm.patchValue({ identifier: `+20${value}` }, { emitEvent: false });
        }
      }
    });

  }

  // Check if the value is a phone number
  isPhoneNumber(value: string): boolean {
    return /^[0-9]{1,}$/.test(value);
  }

  // Login
  onLogin() {

    console.log(this.loginForm.value);


    if (this.loginForm.valid) {
      const data = this.loginForm.value;

      this._loginService.login(data).subscribe({
        next: (res: any) => {

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: res.message,
            confirmButtonColor: '#28a745',
            confirmButtonText: 'OK',
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            if (res.data?.access_Token) {
              localStorage.setItem('token', res.data.access_Token);
            }
            this.router.navigate(['/restaurant']);
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
