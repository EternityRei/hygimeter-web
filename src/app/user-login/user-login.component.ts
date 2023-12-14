import { Component } from '@angular/core';
import {JwtHelperService} from "@auth0/angular-jwt";
import {AuthenticationService,AuthModule} from "../authentication.service";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {catchError, tap} from "rxjs";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [AuthModule, FormsModule, CommonModule],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})
export class UserLoginComponent {
  email: string = "";
  password: string = "";
  passwordFieldType: string = "password"
  helper = new JwtHelperService();
  message: string = "";
  isButtonDisabled: boolean = true;
  emptyFields: string[] = [];
  isAuthenticated: boolean = false;
  invalidFields: string[] = [];


  constructor(private authenticationService: AuthenticationService, private router: Router, public dialog: MatDialog) {
  }

  public login() {
    this.message = "";
    this.emptyFields = [];
    this.invalidFields = [];
    this.checkInputDataExistence();
    if (this.emptyFields.length > 0) {
      this.isButtonDisabled = true;
      return;
    }
    const credentials = {
      email: this.email,
      password: this.password
    }

    this.authenticationService.login(credentials).pipe(
      tap((data) => {
        const token = data.results[0].access_token;
        localStorage.setItem("token", token)
        this.router.navigate(['/dashboard'])
          .then(r =>
            console.log('Navigation to user route complete')
          );
      }),
      catchError((error) => {
        console.log(error);
        this.analyseError(error);
        this.message = error.error.statusMessage;
        console.log(this.message);
        throw error;
      })
    ).subscribe();
  }

  checkInputDataExistence() {
    if (!this.email) {
      this.emptyFields.push(this.email)
    }
    if (!this.password) {
      this.emptyFields.push(this.password)
    }
  }

  checkFormValidity() {
    this.isButtonDisabled = !this.email.trim() || !this.password.trim();
  }

  analyseError(error: any) {
    if (error.error.statusCode === 'IRRELEVANT_EMAIL') {
      this.isButtonDisabled = true;
      this.invalidFields.push(this.email);
    } else if (error.error.statusCode === 'INVALID_PASSWORD') {
      this.isButtonDisabled = true;
      this.invalidFields.push(this.password)
    } else {
      this.isButtonDisabled = true;
    }
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}
