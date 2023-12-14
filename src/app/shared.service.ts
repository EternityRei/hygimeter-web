import {Injectable, NgModule} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private userEmail = new BehaviorSubject<string>('');
  currentAdminUsername = this.userEmail.asObservable();

  constructor() {}

  changeUserEmail(username: string) {
    this.userEmail.next(username);
  }
}

@NgModule({
  providers: [SharedService]
})
export class SharedModule {}
