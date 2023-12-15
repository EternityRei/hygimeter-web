import {RouterModule, Routes} from '@angular/router';
import {UserRegistrationComponent} from "./user-registration/user-registration.component";
import {NgModule} from "@angular/core";
import {HomeComponent} from "./home/home.component";
import {UserLoginComponent} from "./user-login/user-login.component";
import {NewsDashboardComponent} from "./news-dashboard/news-dashboard.component";
import {UserProfileComponent} from "./user-profile/user-profile.component";
import {TopicComponent} from "./topic/topic.component";
import {NewPlanComponent} from "./new-plan/new-plan.component"

export const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full' },
  {path: 'home', component: HomeComponent},
  {path: 'registration', component: UserRegistrationComponent},
  {path: 'login', component: UserLoginComponent},
  {path: 'dashboard', component: NewsDashboardComponent},
  {path: 'user-profile', component: UserProfileComponent},
  {path: 'topic/:topic', component: TopicComponent},
  {path: 'new-plan/:topic', component: NewPlanComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

