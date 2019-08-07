import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit,OnDestroy {

  users: any[] = [];
  username: string = '';
  password: string = '';
  isAdmin: boolean = false;
  sub: Subscription;
  sub2: Subscription;
  usersFull: any[] = [];

  constructor(
    private localService: LocalService,
  ) { }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  init() {
    this.localService.initDbs('users');
    this.sub = this.localService.subjects['users'].subscribe(
      (data) => {
        this.users = data;
      }
    );
  }

  applyFilter($event) {
    let selected = [];

    if ($event.length != 0) {
      for (let user of this.users) {
        if (user.username.toLowerCase().indexOf($event.toLowerCase()) != -1) {
          selected.push(user);
        }
      }
      this.users = selected;
    } else {
      this.init();
    }
  }

  addUser() {
    let user = {
      username: this.username,
      password: this.password,
      isAdmin: this.isAdmin,
      isActive: true,
      createdAt: Date.now(),
      lastUpdatedAt: Date.now()
    };

    this.localService.save('users', user, this.localService.users).subscribe();
    this.username = this.password = '';
    this.isAdmin = false;
  }

  delete(user) {
    if (confirm('Etes vous certain de vouloir effectuer cette action ?')) {
      user.isActive = false;
      this.localService.save('users', user, this.localService.users);
    }
  }
}
