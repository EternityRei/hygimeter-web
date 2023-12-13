import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MatTabsModule} from "@angular/material/tabs";
import {UserRegistrationComponent} from "../user-registration/user-registration.component";
import {UserLoginComponent} from "../user-login/user-login.component";

@Component({
  selector: 'app-user-authentication',
  standalone: true,
  imports: [
    MatTabsModule,
    UserRegistrationComponent,
    UserLoginComponent
  ],
  templateUrl: './user-authentication.component.html',
  styleUrl: './user-authentication.component.css'
})
export class UserAuthenticationComponent {
  constructor(private route: ActivatedRoute) {}

  getSelectedTabIndex(): number {
    const path = this.route.snapshot.routeConfig?.path;
    return path === 'registration' ? 0 : 1;
  }
}
