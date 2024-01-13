import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authServices: AuthService,
    private formBuilder: FormBuilder,
  ) {

  }

  @ViewChild('modal') modal!: TemplateRef<any>;
  @ViewChild('modalRecovery') modalRecovery!: TemplateRef<any>;

  form = this.formBuilder.group({
    email: [null, Validators.required],
    password: [null, Validators.required]
  })

  formCode = this.formBuilder.group({
    code: [null, Validators.required],
  })

  formPass = this.formBuilder.group({
    password: [null, Validators.required],
    confirm_password: [null, Validators.required],
  })

  error: boolean = false;
  loading: boolean = false;
  err_msg: any = null;
  fase_recovery: number = 0;
  modalRecoveryCtrl:any = null

  login() {
    this.error = false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.authServices.login(this.form.value)
      .subscribe({
        next: (e) => {
          console.log(e)
          localStorage.setItem('token', e.token)
          localStorage.setItem('user', JSON.stringify(e.user))
          this.router.navigate(['/user'])
        },
        error: ({ error }) => {
          this.error = true;
          this.loading = false;
        }
      })
  }

  sendEmail() {
    this.err_msg = null;
    if (this.form.get('email').invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.authServices.sendCode(this.form.value)
      .subscribe(
        {
          next: (e: any) => {
            console.log(e)
            this.loading = false;
            this.fase_recovery = 1;
          },
          error: ({ error }) => {
            console.log(error.message)
            this.loading = false;
            this.err_msg = error.message;

          },
        })
  }

  sendCode() {
    if (this.formCode.invalid) {
      this.formCode.markAllAsTouched();
      return;
    }

    this.authServices.verifyCode({ email: this.form.get('email').value, code: this.formCode.value.code })
      .subscribe({
        next:(e: any) => {
          console.log(e)
          this.fase_recovery = 2;
          this.formCode.reset()
        },
        error: ({ error }) => {
          this.err_msg = error.message;
          this.loading = false;
          this.formCode.reset()
        }
      })
  }

  changePassword(){
    this.err_msg = null;
    if (this.formPass.invalid) {
      this.formPass.markAllAsTouched();
      return;
    }
    if(this.formPass.get('password').value != this.formPass.get('confirm_password').value){
      this.err_msg = "las contraseñas no son iguales"
      return;
    }
    this.loading = true

    this.authServices.changePassword({email:this.form.value.email, password: this.formPass.value.password})
    .subscribe((e:any)=>{
      this.loading = false
      console.log(e)
      this.formPass.reset()
      this.dialog.closeAll()

    })
  }

  getFieldInvalid(field: string) {
    return this.form.get(field)?.invalid && this.form.get(field)?.touched
  }

  getFieldInvalidCode(field: string) {
    return this.formCode.get(field)?.invalid && this.form.get(field)?.touched
  }

  getFieldInvalidPass(field: string) {
    return this.formPass.get(field)?.invalid && this.formPass.get(field)?.touched
  }

  openModal() {
    this.dialog.open(this.modal,
      {
        maxWidth: '600px',
        maxHeight: 'max-content',
        height: 'max-content',
        width: 'max-content',
        panelClass: 'full-screen-modal'
      }).beforeClosed()
      .subscribe(e => {
      })
  }

  openModalRecovery() {
   this.modalRecoveryCtrl = this.dialog.open(this.modalRecovery,
      {
        maxWidth: '600px',
        maxHeight: 'max-content',
        height: 'max-content',
        width: 'max-content',
        panelClass: 'full-screen-modal'
      }).beforeClosed()
      .subscribe(e => {
        this.err_msg = null;
        this.fase_recovery = 0;
        this.form.reset()
      })

  }

}
