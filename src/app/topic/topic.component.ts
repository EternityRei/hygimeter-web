import { Component } from '@angular/core';
import {User} from "../user";
import {JwtHelperService} from "@auth0/angular-jwt";
import {Router, RouterLink} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {SharedModule, SharedService} from "../shared.service";
import { CommonModule } from '@angular/common';
import {HttpClient, HttpClientModule, HttpHeaders, HttpParams} from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { ActivatedRoute } from '@angular/router';
import { environment } from "../../environments/environment.local";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


const BACKEND_URL = environment.backendApiUrl;

@Component({
  selector: 'app-topic',
  standalone: true,
  imports: [CommonModule, HttpClientModule, SharedModule, RouterLink],
  templateUrl: './topic.component.html',
  styleUrl: './topic.component.css'
})
export class TopicComponent {
  id: string = "";
  article: any = {};
  safeVideoUrl?: SafeResourceUrl;
  parameterKeys: string[] = [];

  usersFound: boolean = false;
  message: string = "";
  activeAdminUsername = "";
  helper = new JwtHelperService();
  editInfo: boolean = false;

  internalToReadableMap: { [key: string]: string } = {
    "temperature": "Temperature",
    "absoluteHumidity": "Absolute Humidity",
    "relativeHumidity": "Relative Humidity",
    "ventilation": "Ventilation Type",
    "lightsOffTime": "Lights Off Time",
    "lightLevel": "Light Level",
  }

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private sharedService: SharedService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
    const currentUserToken = localStorage.getItem("token") as string;
    this.activeAdminUsername = this.helper.decodeToken(currentUserToken).sub;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['topic']; // Get the topic parameter
      let result = this.http.get<any>(BACKEND_URL + "topics/" + this.id, {
        headers: 
        new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem("token") as string)
      })
        .pipe(
          tap((data: any) => {
            this.article = data.results[0]
            console.log(this.article)
            this.parameterKeys = Object.keys(this.article.parameters)
            this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.article.video);
          })
        ).subscribe();
    });
  }

  handOverUserEmail() {
    this.sharedService.changeUserEmail(this.activeAdminUsername);
  }

  logout() {
    localStorage.removeItem("token");
    this.router.navigateByUrl("login");
  }

}
