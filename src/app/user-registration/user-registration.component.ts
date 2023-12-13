import { Component } from '@angular/core';
import {AuthenticationService, AuthModule} from "../authentication.service";
import {Router} from "@angular/router";
import {catchError, tap} from "rxjs";
import {FormsModule} from "@angular/forms";
import {AppModule} from "../app.module";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [AuthModule, FormsModule, AppModule, NgIf],
  templateUrl: './user-registration.component.html',
  styleUrl: './user-registration.component.css'
})
export class UserRegistrationComponent {
  constructor(private authenticationService: AuthenticationService, private router: Router) {
    console.log("Loaded");
  }

  name: string = "";
  surname: string = "";
  password: string = "";
  email: string = "";
  role: string = "USER";
  passwordFieldType: string = "password";
  message: string = "";
  isFormRegisterVisible = true;
  isIsSuccessRegister = true;
  isButtonDisabled: boolean = false;
  emptyField: string[] = [];

  public register() {
    this.message = "";
    this.emptyField = [];
    this.checkInputDataExistence();
    if (this.emptyField.length > 0) {
      this.isButtonDisabled = true;
      return;
    }

    const user = {
      name: this.name,
      surname: this.surname,
      password: this.password,
      email: this.email,
      role: this.role
    }
    this.authenticationService.register(user).pipe(
      tap((data:any) => {
        this.isFormRegisterVisible = false;
        this.isIsSuccessRegister = true;
        this.isButtonDisabled = false;
        this.message = data.statusMessage;
        setTimeout(() => {
          this.message = "";
          this.router.navigateByUrl(`login`)
        }, 700);
      }),
      catchError((error:any) => {
        if (error.error.statusCode == 'DUPLICATE_EMAIL') {
          this.isButtonDisabled = true;
        }
        this.message = error.error.statusMessage;
        this.isIsSuccessRegister = false;
        return [];
      })
    ).subscribe();
  }

  checkInputDataExistence() {
    if (!this.name) {
      this.emptyField.push(this.name)
    }
    if (!this.surname) {
      this.emptyField.push(this.surname)
    }
    if (!this.password) {
      this.emptyField.push(this.password)
    }
    if (!this.email) {
      this.emptyField.push(this.email)
    }
  }

  checkFormValidity() {
    if (this.name && this.surname && this.email && this.password) {
      this.isButtonDisabled = false;
    } else {
      this.isButtonDisabled = true;
    }
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}
