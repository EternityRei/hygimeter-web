import {RouterModule, Routes} from '@angular/router';
import {UserRegistrationComponent} from "./user-registration-component/user-registration.component";
import {NgModule} from "@angular/core";
import {HomeComponent} from "./home/home.component";

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {path: 'home', component: HomeComponent},
  {path: 'registration', component: UserRegistrationComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

