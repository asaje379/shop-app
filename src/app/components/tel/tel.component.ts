import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tel',
  templateUrl: './tel.component.html',
  styleUrls: ['./tel.component.scss']
})
export class TelComponent implements OnInit {

  user: any;

  constructor(
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.user = this.userService.getUser() ? this.userService.getUser() : {isAdmin: false};
  }

}
