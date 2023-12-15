import {Injectable, NgModule} from "@angular/core";
import {HttpClient, HttpClientModule, HttpHeaders, HttpParams} from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { environment } from "../environments/environment.local";
import { User } from "./user";
import {SharedService} from "./shared.service";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

const BACKEND_URL = environment.backendApiUrl;

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

    let result = this.http.patch<any>(BACKEND_URL + "users/" + emailFromJwt, {
      name: user.name,
      surname: user.surname,
      email: user.email,
      role: user.role
    }, { headers: headers })
      .pipe(
        tap((data: any) => {
          console.log("User updated with data: ");
          console.log(data);
          if (data.results[0].email != emailFromJwt) {
            this.token = data.results[1];
          }
        })
      );
    return result;
  }

}

@NgModule({
  providers: [UserService]
})
export class UserModule {}
