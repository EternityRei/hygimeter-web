import { Component } from '@angular/core';
import {User} from "../user";
import {JwtHelperService} from "@auth0/angular-jwt";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {SharedModule, SharedService} from "../shared.service";

@Component({
  selector: 'app-news-dashboard',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './news-dashboard.component.html',
  styleUrl: './news-dashboard.component.css'
})
export class NewsDashboardComponent {

  usersFound: boolean = false;
  message: string = "";
  activeAdminUsername = "";
  helper = new JwtHelperService();
  editInfo: boolean = false;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private sharedService: SharedService
  ) {
    const currentUserToken = localStorage.getItem("token") as string;
    this.activeAdminUsername = this.helper.decodeToken(currentUserToken).sub;
  }

  handOverUserEmail() {
    this.sharedService.changeUserEmail(this.activeAdminUsername);
  }

  logout() {
    localStorage.removeItem("token");
    this.router.navigateByUrl("login");
  }

}
