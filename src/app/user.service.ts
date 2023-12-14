import {Injectable, NgModule} from "@angular/core";
import {HttpClient, HttpClientModule, HttpHeaders, HttpParams} from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environments/environment.local";
import { User } from "./user";
import {SharedService} from "./shared.service";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: "root",
})
export class UserService {

  token: string = '';

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem("token") as string;
  }

  getUserByEmail(email: String): Observable<any> {
    return this.http.get<any>(BACKEND_URL + "users/" + email, {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.token),
    });
  }

  updateUserData(user: User, emailFromJwt: string): Observable<any> {
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.token)
      .set('Content-Type', 'application/json');

    return this.http.patch<any>(BACKEND_URL + "users/" + emailFromJwt, {
      name: user.name,
      surname: user.surname,
      email: user.email,
      role: user.role
    }, { headers: headers });
  }

}

@NgModule({
  providers: [UserService]
})
export class UserModule {}
