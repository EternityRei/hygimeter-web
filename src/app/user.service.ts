import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environments/environment.local";
import { User } from "./user";

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
}
