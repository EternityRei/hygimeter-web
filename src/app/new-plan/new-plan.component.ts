import { Component } from '@angular/core';
import { CommonModule, Time } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import {SharedModule, SharedService} from "../shared.service";
import { environment } from "../../environments/environment.local";
import { tap } from 'rxjs';

const BACKEND_URL = environment.backendApiUrl;

@Component({
  selector: 'app-new-plan',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, SharedModule, RouterLink],
  templateUrl: './new-plan.component.html',
  styleUrls: ['./new-plan.component.css']
})
export class NewPlanComponent {
  id: string = "";
  initialPlan: { 
    temperature?: Number; 
    absoluteHumidity?: Number,
    relativeHumidity?: Number,
    lightLevel?: Number,
    ventilationType?: String,
    lightsOffTime?: Time,
  } = {
  }

  goalPlan: { 
    temperature?: Number; 
    absoluteHumidity?: Number,
    relativeHumidity?: Number,
    lightLevel?: Number,
    ventilationType?: String,
    lightsOffTime?: Time,
  } = {
  }

  disabled_fields: String[] = [];
  isButtonDisabled: boolean = true;

  constructor (
    private route: ActivatedRoute,
    private http: HttpClient,
  ) {
    
  }

  login() {
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
            let article = data.results[0]
            let parameterKeys = Object.keys(article.parameters)
            for (let key of parameterKeys) {
              console.log(key)
              if(key == "temperature") {
                this.goalPlan.temperature = article.parameters[key].slice(0, -2)
              }
              if(key == "absoluteHumidity") {
                this.goalPlan.absoluteHumidity = article.parameters[key].slice(0, -1)
              }
              if(key == "relativeHumidity") {
                this.goalPlan.relativeHumidity = article.parameters[key].slice(0, -1)
              }
              if(key == "lightLevel") {
                this.goalPlan.lightLevel = article.parameters[key];
              }
              if(key == "ventilationType") {
                this.goalPlan.ventilationType = article.parameters[key]
              }
              if(key == "lightsOffTime") {
                this.goalPlan.lightsOffTime = article.parameters[key]
              }
              this.disabled_fields.push(key);
            }
          })
        ).subscribe();
    });
  }

  checkIfButtonShouldBeDisabled() {
    if(this.goalPlan.temperature == this.initialPlan.temperature &&
      this.goalPlan.absoluteHumidity == this.initialPlan.absoluteHumidity &&
      this.goalPlan.relativeHumidity == this.initialPlan.relativeHumidity &&
      this.goalPlan.lightLevel == this.initialPlan.lightLevel &&
      this.goalPlan.ventilationType == this.initialPlan.ventilationType &&
      this.goalPlan.lightsOffTime == this.initialPlan.lightsOffTime) {
        this.isButtonDisabled = true;
    } else {
      // check are there null values in goalPlan and initialPlan
      if (this.goalPlan.temperature == null || this.initialPlan.temperature == null ||
        this.goalPlan.absoluteHumidity == null || this.initialPlan.absoluteHumidity == null ||
        this.goalPlan.relativeHumidity == null || this.initialPlan.relativeHumidity == null ||
        this.goalPlan.lightLevel == null || this.initialPlan.lightLevel == null ||
        this.goalPlan.ventilationType == null || this.initialPlan.ventilationType == null ||
        this.goalPlan.lightsOffTime == null || this.initialPlan.lightsOffTime == null) {
          this.isButtonDisabled = true;
      } else {
        this.isButtonDisabled = false;
      }
    }
  }

  applyForGoal(field: String) {
    console.log(field);
    if(!this.disabled_fields.includes(field)) {
      if(field == "temperature") {
        this.goalPlan.temperature = this.initialPlan.temperature;
      }
      if(field == "absoluteHumidity") {
        this.goalPlan.absoluteHumidity = this.initialPlan.absoluteHumidity;
      }
      if(field == "relativeHumidity") {
        this.goalPlan.relativeHumidity = this.initialPlan.relativeHumidity;
      }
      if(field == "lightLevel") {
        this.goalPlan.lightLevel = this.initialPlan.lightLevel;
      }
      if(field == "ventilationType") {
        this.goalPlan.ventilationType = this.initialPlan.ventilationType;
      }
      if(field == "lightsOffTime") {
        this.goalPlan.lightsOffTime = this.initialPlan.lightsOffTime;
      }
    }
    this.checkIfButtonShouldBeDisabled();
  }

  cancelApplyingForGoal(field: String) {
    this.disabled_fields.push(field);
    this.checkIfButtonShouldBeDisabled();
  }
}