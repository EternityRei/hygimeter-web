import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterLink} from "@angular/router";
import {AuthenticationService, AuthModule} from "../authentication.service";
import {SharedModule, SharedService} from "../shared.service";
import {CommonModule} from "@angular/common";
import {filter, Subscription} from "rxjs";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    AuthModule,
    CommonModule,
    SharedModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  email: string = '';
  private subscriptions = new Subscription();

  constructor(
    private authService: AuthenticationService,
    private sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit() {
    // Initially check if user is logged in
    this.checkLoginStatus();

    // Listen for router events to detect when a navigation has ended
    this.subscriptions.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(event => {
        // Check the login status again after each navigation end
        this.checkLoginStatus();
      })
    );
  }

  private checkLoginStatus() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.subscriptions.add(
        this.sharedService.currentAdminUsername.subscribe(email => {
          this.email = email;
        })
      );
    }
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    this.subscriptions.unsubscribe();
  }

  logout() {
    localStorage.removeItem("token");
    this.router.navigateByUrl("login");
    this.isLoggedIn = false;
  }
}
