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
  constructor(private http: HttpClient) {}

  getUsersByRole(role: String): Observable<any> {
    return this.http.get<any>(BACKEND_URL + "users", {
      params: new HttpParams().append("role", role.valueOf()),
    });
  }

  getUserByEmail(email: String): Observable<any> {
    const token = localStorage.getItem("token") as string;
    return this.http.get<any>(BACKEND_URL + "users/" + email, {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    });
  }
}

@NgModule({
  providers: [UserService]
})
export class UserModule {}
