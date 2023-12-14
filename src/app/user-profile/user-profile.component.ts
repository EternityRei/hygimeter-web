import {Component, Input, OnInit} from '@angular/core';
import {User} from "../user";
import {JwtHelperService} from "@auth0/angular-jwt";
import {UserModule, UserService} from "../user.service";
import {Router} from "@angular/router";
import {catchError, tap} from "rxjs";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [UserModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {

  retrievedUser: User;
  userFound: boolean = false;
  message: string = "";
  helper = new JwtHelperService();
  email: string = '';
  changedFields: Set<string> = new Set<string>();
  emptyFields: string[] = [];

  constructor(
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    const currentUserToken = localStorage.getItem("token") as string;
    this.retrievedUser = new User(
      '',
      '',
      '',
       '',
       'USER'
    );
    this.email = this.helper.decodeToken(currentUserToken).sub as string;
  }

  ngOnInit(): void {
    this.getUserByEmail(this.email);
  }

  public getUserByEmail(email: string) {
    this.userService
      .getUserByEmail(email)
      .pipe(
        tap((data: any) => {
          this.retrievedUser = data.results[0];
          console.log(this.retrievedUser);
          this.userFound = true;
        }),
        catchError((error: any) => {
          console.log(error);
          this.userFound = false;
          if (error.status == 404) {
            this.message = error.error.statusMessage;
          } else {
            this.handleError(error);
          }
          return [];
        })
      )
      .subscribe();
  }

  updateUserData() {
    const updatedUser: User = { ...this.retrievedUser };
    console.log("Updated user = ", updatedUser);
    if (!this.checkValidity(updatedUser)) {
      this.changedFields.clear();
      return;
    }
    this.userService
      .updateUserData(updatedUser, this.email)
      .pipe(
        tap((response: any) => {
          this.getUserByEmail(updatedUser.email);
          this.displayMessageBar(
            "User's profile has been updated successfully"
          );
          this.changedFields.clear();
          this.isFormChanged();
        }),
        catchError((error: any) => {
          console.log(error);
          if (error.status == 404) {
            this.message = error.error.statusMessage;
          } else {
            this.handleError(error);
          }
          return [];
        })
      )
      .subscribe();
  }

  setFieldChanged(field: string): void {
    this.changedFields.add(field);
    this.checkValidity(this.retrievedUser);
  }

  isFormChanged(): boolean {
    return this.changedFields.size > 0 && !(this.emptyFields.length > 0);
  }

  checkValidity(user: User): boolean {
    this.emptyFields.splice(0);
    if (!user.name) {
      this.emptyFields.push("name");
      return false;
    } else if (!user.surname) {
      this.emptyFields.push("surname");
      return false;
    } else if (!user.email) {
      this.emptyFields.push("email");
      return false;
    }
    return true;
  }

  private handleError(error: any): void {
    console.log(error);
    if (error.status == 401 || error.status == 403) {
      this.logout();
    } else {
      this.displayMessageBar(error.error.statusMessage);
    }
  }

  logout() {
    localStorage.removeItem("token");
    this.router.navigateByUrl("login");
  }

  displayMessageBar(message: string): void {
    const config: MatSnackBarConfig = {
      verticalPosition: "top",
      horizontalPosition: "center",
      duration: 5000,
    };
    this.snackBar.open(message, "Cancel", config);
  }

}
