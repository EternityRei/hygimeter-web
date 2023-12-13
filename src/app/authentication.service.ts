import { NgModule } from '@angular/core';
import {Injectable} from '@angular/core';
import {HttpClient, HttpClientModule, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

import {environment} from '../environments/environment.local';

const headers = new HttpHeaders()
  .set('Content-Type', 'application/json')
const httpOptions = {headers: headers}
const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) {
  }

  login(credentials: any): Observable<any> {
    return this.http.post(BACKEND_URL + "auth/login", {
      email: credentials.email,
      password: credentials.password
    }, httpOptions)
  }

  register(user: any): Observable<any> {
    return this.http.post(BACKEND_URL + "users", {
      name: user.name,
      surname: user.surname,
      email: user.email,
      password: user.password,
      role: user.role
    }, httpOptions)
  }
}

@NgModule({
  imports: [HttpClientModule],
  providers: [AuthenticationService]
})
export class AuthModule {}
