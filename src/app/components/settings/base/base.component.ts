import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  user: any;

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.user = this.userService.getUser() ? this.userService.getUser() : {isAdmin: false};
    if(this.user.isAdmin) {
      this.router.navigate['/signin'];
    }
  }

}
