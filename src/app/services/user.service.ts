import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: any;

  constructor() { }

  getUser() {
    return this.user;
  }

  setUser(user: any) {
    this.user = user;
  }
}
