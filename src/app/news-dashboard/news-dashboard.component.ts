import { Component } from '@angular/core';
import {User} from "../user";
import {JwtHelperService} from "@auth0/angular-jwt";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import {SharedModule, SharedService} from "../shared.service";
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs';
import { environment } from "../../environments/environment.local";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  constructor() {}

  getCurrentLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation is not supported by your browser.');
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    });
  }
}

const BACKEND_URL = environment.backendApiUrl;

interface CustomGeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
    altitude?: number;
    accuracy: number;
    altitudeAccuracy?: number;
    heading?: number;
    speed?: number;
  };
  timestamp: number;
}

@Component({
  selector: 'app-news-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, SharedModule, RouterLink],
  templateUrl: './news-dashboard.component.html',
  styleUrl: './news-dashboard.component.css'
})
export class NewsDashboardComponent {
  rawArticles: any[] = [];
  articles: any[] = [];

  usersFound: boolean = false;
  message: string = "";
  activeAdminUsername = "";
  helper = new JwtHelperService();
  editInfo: boolean = false;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private http: HttpClient,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private sanitizer: DomSanitizer,
    private geolocationService: GeolocationService
  ) {
    const currentUserToken = localStorage.getItem("token") as string;
    this.activeAdminUsername = this.helper.decodeToken(currentUserToken).sub;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log(BACKEND_URL + "topics/top")
      console.log(new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem("token") as string))

      this.geolocationService.getCurrentLocation().then((position: GeolocationPosition) => {
        console.log('Latitude:', position.coords.latitude);
        console.log('Longitude:', position.coords.longitude);
      }).catch((error: GeolocationPositionError) => {
        console.error('Error getting location', error);
      });

      const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + localStorage.getItem("token"))
      .set('Content-Type', 'application/json');

      let result = this.http.post<any>(BACKEND_URL + "topics/top", {}, {
        headers: headers
      })
        .pipe(
          tap((data: any) => {
            this.rawArticles = data.results
            console.log(this.rawArticles)
            let ids = this.rawArticles.map((article: any) => article.file.slice(0, -4))
            for (let id of ids) {
              this.http.get<any>(BACKEND_URL + "topics/" + id, {
                headers: headers
              })
                .pipe(
                  tap((data: any) => {
                    let article = data.results[0]
                    article.id = id

                    article.image = this.sanitizer.bypassSecurityTrustResourceUrl(article.image);

                    this.articles.push(article)
                    
                  })
                ).subscribe();
            }
            // 
          })
        ).subscribe();
    });

    // this.articles = [
    //   {
    //     id: 1,
    //     title: 'Article 1',
    //     content: 'article 1 contentarticle 1 content',
    //     image: 'https://picsum.photos/200/300'
    //   },
    //   {
    //     id: 2,
    //     title: 'Article 2',
    //     content: 'article 2 content',
    //     image: 'https://picsum.photos/200/300'
    //   },
    //   {
    //     id: 3,
    //     title: 'Article 3',
    //     content: 'article 3 content',
    //     image: 'https://picsum.photos/200/300'
    //   },
    //   {
    //     id: 4,
    //     title: 'Article 4',
    //     content: 'article 4 content',
    //     image: 'https://picsum.photos/200/300'
    //   },
    //   {
    //     id: 5,
    //     title: 'Article 5',
    //     content: 'article 5 content',
    //     image: 'https://picsum.photos/200/300'
    //   },
    //   {
    //     id: 6,
    //     title: 'Article 5',
    //     content: 'article 5 content',
    //     image: 'https://picsum.photos/200/300'
    //   },
    //   {
    //     id: 7,
    //     title: 'Article 5',
    //     content: 'article 5 content',
    //     image: 'https://picsum.photos/200/300'
    //   }
    // ];
  }

  handOverUserEmail() {
    this.sharedService.changeUserEmail(this.activeAdminUsername);
  }

  logout() {
    localStorage.removeItem("token");
    this.router.navigateByUrl("login");
  }

}
