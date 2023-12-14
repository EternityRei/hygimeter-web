import {Component, OnInit} from '@angular/core';
import {User} from "../user";
import {JwtHelperService} from "@auth0/angular-jwt";
import {UserModule, UserService} from "../user.service";
import {Router} from "@angular/router";
import {catchError, tap} from "rxjs";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [UserModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {

  user: User;
  activeMenuItem: string = "users";
  userFound: boolean = false;
  message: string = "";
  helper = new JwtHelperService();
  editInfo: boolean = false;
  email: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    const currentUserToken = localStorage.getItem("token") as string;
    this.user = new User(
      '',
      '',
      '',
       '',
       ''
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
          this.user = data.results[0];
          console.log(this.user);
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
